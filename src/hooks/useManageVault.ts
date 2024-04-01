import { useEffect, useState } from 'react'
import { Address, Hash, isHash, parseEther } from 'viem'
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { readContract } from 'wagmi/actions'

import { bitSmileyAbi } from '@/contracts/BitSmiley'
import { bitUsdAbi } from '@/contracts/BitUsd'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useTokenAllowance } from '@/hooks/useTokenAllowance'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useUserInfo } from '@/hooks/useUserInfo'
import { TransactionStatus } from '@/types/common'

export const useManageVault = () => {
  const config = useConfig()
  const contractAddresses = useContractAddresses()

  const { address } = useUserInfo()
  const { writeContractAsync } = useWriteContract()

  const bitUsdAddress = contractAddresses?.BitUSDL2
  const wBtcAddress = contractAddresses?.WBTC
  const bitSmileyAddress = contractAddresses?.BitSmiley

  const { refetchBalance: refetchWBtcBalance } = useTokenBalance(wBtcAddress)
  const { refetchBalance: refetchBitUsdBalance } =
    useTokenBalance(bitUsdAddress)

  const { allowance: wBtcAllowance, refetchAllowance: refetchWBtcAllowance } =
    useTokenAllowance(wBtcAddress, bitSmileyAddress)

  const {
    allowance: bitUsdAllowance,
    refetchAllowance: refetchBitUsdAllowance
  } = useTokenAllowance(bitUsdAddress, bitSmileyAddress)

  // Approval start
  const [isApprovingWbtc, setIsApprovingWbtc] = useState(false)
  const [approvalTxId, setApprovalTxId] = useState('')
  const [approvalTxnStatus, setApprovalTxnStatus] = useState(
    TransactionStatus.Idle
  )
  const { status: approvalTxnResultStatus } = useWaitForTransactionReceipt({
    hash: approvalTxId as Hash,
    query: {
      enabled: isHash(approvalTxId)
    }
  })

  useEffect(() => {
    if (approvalTxnResultStatus === 'success') {
      setApprovalTxnStatus(TransactionStatus.Success)
      if (isApprovingWbtc) {
        refetchWBtcAllowance()
      } else {
        refetchBitUsdAllowance()
      }
    }
    if (approvalTxnResultStatus === 'error') {
      setApprovalTxnStatus(TransactionStatus.Failed)
    }
  }, [
    isApprovingWbtc,
    approvalTxnResultStatus,
    refetchBitUsdAllowance,
    refetchWBtcAllowance
  ])

  const approvalVault = async (type: 'wBTC' | 'bitUSD', value?: string) => {
    const isWBtc = type === 'wBTC'
    const contractAddresses = isWBtc ? wBtcAddress : bitUsdAddress

    if (!contractAddresses || !bitSmileyAddress || !value) return

    let parsedValue = parseEther(value)
    if (isWBtc) {
      setIsApprovingWbtc(true)
    } else {
      // pass 1 more in case fee changes
      parsedValue = parseEther(value) + parseEther('1')
    }

    try {
      setApprovalTxnStatus(TransactionStatus.Signing)
      const txnId = await writeContractAsync({
        abi: bitUsdAbi,
        address: contractAddresses,
        functionName: 'approve',
        args: [bitSmileyAddress, parsedValue]
      })

      setApprovalTxId(txnId)
      setApprovalTxnStatus(TransactionStatus.Processing)
    } catch (e) {
      console.error(e)
      setApprovalTxnStatus(TransactionStatus.Failed)
    }
  }
  // Approval end

  // openVault start
  const [openVaultTxId, setOpenVaultTxId] = useState('')
  const [openVaultTxnStatus, setOpenVaultTxnStatus] = useState(
    TransactionStatus.Idle
  )
  const { status: openVaultTxnResultStatus } = useWaitForTransactionReceipt({
    hash: openVaultTxId as Hash,
    query: {
      enabled: isHash(openVaultTxId)
    }
  })

  useEffect(() => {
    if (openVaultTxnResultStatus === 'success') {
      refetchWBtcBalance()
      refetchWBtcAllowance()
      setOpenVaultTxnStatus(TransactionStatus.Success)
    }
    if (openVaultTxnResultStatus === 'error') {
      setOpenVaultTxnStatus(TransactionStatus.Failed)
    }
  }, [openVaultTxnResultStatus, refetchWBtcAllowance, refetchWBtcBalance])

  const openVault = async (
    deposit: string,
    mint: string,
    collateralId: string
  ) => {
    const totalNum = Number(mint) + Number(deposit)

    if (!bitSmileyAddress || !totalNum) return

    try {
      setOpenVaultTxnStatus(TransactionStatus.Signing)
      const txnId = await writeContractAsync({
        abi: bitSmileyAbi,
        address: bitSmileyAddress,
        functionName: 'openVault',
        args: [collateralId as Address, parseEther(mint), parseEther(deposit)]
      })

      setOpenVaultTxId(txnId)
      setOpenVaultTxnStatus(TransactionStatus.Processing)
    } catch (e) {
      console.error(e)
      setOpenVaultTxnStatus(TransactionStatus.Failed)
    }
  }
  // openVault end

  // mintFromBtc start
  const [mintFromBtcTxId, setMintFromBtcTxId] = useState('')
  const [mintFromBtcTxnStatus, setMintFromBtcTxnStatus] = useState(
    TransactionStatus.Idle
  )
  const { status: mintResultStatus } = useWaitForTransactionReceipt({
    hash: mintFromBtcTxId as Hash,
    query: {
      enabled: isHash(mintFromBtcTxId)
    }
  })

  useEffect(() => {
    if (mintResultStatus === 'success') {
      refetchWBtcBalance()
      refetchWBtcAllowance()
      setMintFromBtcTxnStatus(TransactionStatus.Success)
    }
    if (mintResultStatus === 'error') {
      setMintFromBtcTxnStatus(TransactionStatus.Failed)
    }
  }, [mintResultStatus, refetchWBtcAllowance, refetchWBtcBalance])

  const mintFromBtc = async (depositBtc: string, mintBitUsd: string) => {
    if (!bitSmileyAddress || !address || (!depositBtc && !mintBitUsd)) return

    try {
      setMintFromBtcTxnStatus(TransactionStatus.Signing)
      const vaultAddress = await readContract(config, {
        abi: bitSmileyAbi,
        address: bitSmileyAddress,
        functionName: 'owners',
        args: [address]
      })

      const txnId = await writeContractAsync({
        abi: bitSmileyAbi,
        address: bitSmileyAddress,
        functionName: 'mint',
        args: [vaultAddress, parseEther(mintBitUsd), parseEther(depositBtc)]
      })

      setMintFromBtcTxId(txnId)
      setMintFromBtcTxnStatus(TransactionStatus.Processing)
    } catch (e) {
      console.error(e)
      setMintFromBtcTxnStatus(TransactionStatus.Failed)
    }
  }
  // mintFromBtc end

  // repayToBtc start
  const [repayToBtcTxId, setRepayToBtcTxId] = useState('')
  const [repayToBtcTxnStatus, setRepayToBtcTxnStatus] = useState(
    TransactionStatus.Idle
  )
  const { status: repayResultStatus } = useWaitForTransactionReceipt({
    hash: repayToBtcTxId as Hash,
    query: {
      enabled: isHash(repayToBtcTxId)
    }
  })

  useEffect(() => {
    if (repayResultStatus === 'success') {
      refetchBitUsdBalance()
      refetchBitUsdAllowance()
      setRepayToBtcTxnStatus(TransactionStatus.Success)
    }
    if (repayResultStatus === 'error') {
      setRepayToBtcTxnStatus(TransactionStatus.Failed)
    }
  }, [refetchBitUsdAllowance, refetchBitUsdBalance, repayResultStatus])

  const repayToBtc = async (
    withdrawBtc: string,
    repayBitUsd: string,
    debtBitUSD?: string
  ) => {
    if (!bitSmileyAddress || !address || (!withdrawBtc && !repayBitUsd)) return

    try {
      setRepayToBtcTxnStatus(TransactionStatus.Signing)
      const vaultAddress = await readContract(config, {
        abi: bitSmileyAbi,
        address: bitSmileyAddress,
        functionName: 'owners',
        args: [address]
      })

      const ceiledRepayBitUsd = !repayBitUsd
        ? parseEther('0')
        : // pass one more in case fee changes
          parseEther(repayBitUsd) + parseEther('0.01')

      const isRepayAll =
        !!debtBitUSD &&
        (parseEther(repayBitUsd) >= parseEther(debtBitUSD) ||
          ceiledRepayBitUsd >= parseEther(debtBitUSD))

      let txnId: Address
      if (isRepayAll) {
        txnId = await writeContractAsync({
          abi: bitSmileyAbi,
          address: bitSmileyAddress,
          functionName: 'repayAll',
          args: [vaultAddress, parseEther(withdrawBtc)]
        })
      } else {
        txnId = await writeContractAsync({
          abi: bitSmileyAbi,
          address: bitSmileyAddress,
          functionName: 'repay',
          args: [vaultAddress, ceiledRepayBitUsd, parseEther(withdrawBtc)]
        })
      }

      setRepayToBtcTxId(txnId)
      setRepayToBtcTxnStatus(TransactionStatus.Processing)
    } catch (e) {
      console.error(e)
      setRepayToBtcTxnStatus(TransactionStatus.Failed)
    }
  }
  // repayToBtc end

  return {
    wBtcAllowance: wBtcAllowance ?? 0,
    bitUsdAllowance: bitUsdAllowance ?? 0,

    approvalVault,
    approvalTxnStatus,
    approvalTxId,
    setApprovalTxnStatus,

    openVault,
    openVaultTxId,
    openVaultTxnStatus,
    setOpenVaultTxnStatus,

    mintFromBtc,
    mintFromBtcTxnStatus,
    mintFromBtcTxId,
    setMintFromBtcTxnStatus,

    repayToBtc,
    repayToBtcTxnStatus,
    repayToBtcTxId,
    setRepayToBtcTxnStatus
  }
}
