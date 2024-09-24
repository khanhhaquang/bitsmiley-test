import { isAxiosError } from 'axios'
import { memo, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Hash, isHash } from 'viem'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'

import { ChevronLeftIcon, VaultInfoBorderIcon } from '@/assets/icons'
import { NativeBtcWalletModal } from '@/components/ConnectWallet/NativeBtcWalletModal'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { useReadErc20Symbol } from '@/contracts/ERC20'
import { useBTCBalance } from '@/hooks/useBTCBalance'
import { useCollaterals } from '@/hooks/useCollaterals'
import { useMempool } from '@/hooks/useMempool'
import { useTokenPrice } from '@/hooks/useTokenPrice'
import { useVaultDetail } from '@/hooks/useVaultDetail'
import { useZetaClient } from '@/hooks/useZetaClient'
import { ZetaService } from '@/services/zeta'
import {
  deleteLocalStorage,
  getLocalStorage,
  setLocalStorage
} from '@/utils/storage'

import VaultHeader from './component/VaultHeader'

import {
  ActionButton,
  InputSuffixActionButton,
  SubmitButton
} from '../components/ActionButton'
import { NumberInput } from '../components/NumberInput'
import { VaultInfo } from '../components/VaultInfo'
import { VaultTitleBlue } from '../components/VaultTitle'
import { ZetaProcessing } from '../components/ZetaProcessing'
import { ProcessingStatus, TxnStep } from '../components/ZetaProcessing.types'
import { formatBitUsd, formatWBtc } from '../display'

export const OpenVault: React.FC<{
  chainId: number
  collateralId: string
}> = ({ chainId, collateralId }) => {
  const navigate = useNavigate()
  const MempoolService = useMempool()
  const { collateral } = useCollaterals(chainId, collateralId)

  const {
    tryOpenVaultInfo,
    setTryOpenVaultBitUsd,
    setTryOpenVaultCollateral,
    capturedMaxMint
  } = useVaultDetail(collateral)

  const { data: deptTokenSymbol = '-' } = useReadErc20Symbol({
    address: collateral?.collateral?.tokenAddress
  })

  const { address: evmAddress } = useAccount()
  const { balanceAsBtc: btcBalance } = useBTCBalance()
  const wbtcPrice = useTokenPrice()

  const [deposit, setDeposit] = useState('')

  const [showProcessing, setShowProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(TxnStep.One)
  const [processingStatus, setProcessingStatus] = useState(
    ProcessingStatus.Processing
  )
  const [processingTxn, setProcessingTxn] = useState('')
  const { data: zetaTxnReceipt } = useWaitForTransactionReceipt({
    hash: processingTxn as Hash,
    query: {
      enabled:
        isHash(processingTxn) &&
        processingStep === TxnStep.Two &&
        processingStatus === ProcessingStatus.Processing
    }
  })

  const { btcAddress, mint, setMint, handleSendBtc, signData, broadcastTxn } =
    useZetaClient(chainId, collateralId)

  const [btcWalletOpen, setBtcWalletOpen] = useState(!btcAddress)

  const depositDisabled = useMemo(() => {
    if (btcBalance <= 0) return true
    return false
  }, [btcBalance])

  const depositInputErrorMsg = useMemo(() => {
    if (deposit) {
      if (Number(deposit) <= 0) {
        return 'Deposit value must larger than zero.'
      }
      if (Number(deposit) > btcBalance)
        return 'Deposit value is exceeding balance.'
    }

    return ''
  }, [deposit, btcBalance])

  const mintInputErrorMsg = useMemo(() => {
    if (mint) {
      if (Number(mint) > Number(collateral?.collateral?.vaultMaxDebt)) {
        return 'Mint bitUSD value can’t exceed vault max debt.'
      }
      if (Number(mint) < Number(collateral?.collateral?.vaultMinDebt))
        return 'Mint bitUSD value doesn’t reach vault floor.'

      if (Number(mint) > Number(capturedMaxMint))
        return 'Mint bitUSD value can’t exceed max mint.'
    }

    return ''
  }, [
    capturedMaxMint,
    collateral?.collateral?.vaultMaxDebt,
    collateral?.collateral?.vaultMinDebt,
    mint
  ])

  const mintDisabled = useMemo(() => {
    return !collateral?.collateral?.vaultMinDebt || !capturedMaxMint
  }, [collateral?.collateral?.vaultMinDebt, capturedMaxMint])

  const isNextButtonDisabled = useMemo(() => {
    if (!deposit) return true
    if (depositInputErrorMsg) return true
    if (mintInputErrorMsg) return true
    if (processingTxn) return true

    return false
  }, [deposit, depositInputErrorMsg, mintInputErrorMsg, processingTxn])

  const handleBroadcasting = async (rawTxn: string | null) => {
    console.log('🚀 ~ handleBroadcasting ~ rawTxn:', rawTxn)
    if (rawTxn) {
      console.log('broadcasting...')
      const btcTxn = await broadcastTxn(rawTxn)
      if (btcTxn) {
        setProcessingTxn(btcTxn)
        setLocalStorage(
          `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_TXN}-${evmAddress}`,
          btcTxn
        )
      } else {
        setProcessingStatus(ProcessingStatus.Error)
      }
    } else {
      setProcessingStatus(ProcessingStatus.Error)
    }
  }

  const handleNext = async () => {
    if (!btcAddress) {
      setBtcWalletOpen(true)
      return
    }
    setShowProcessing(true)
    //reset status
    setProcessingTxn('')
    deleteLocalStorage(
      `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_TXN}-${evmAddress}`
    )
    setProcessingStep(TxnStep.One)
    setProcessingStatus(ProcessingStatus.Processing)

    const rawTx = await handleSendBtc(Number(deposit))
    if (rawTx) {
      setLocalStorage(
        `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_RAW_BTC_TXN}-${evmAddress}`,
        rawTx
      )
      handleBroadcasting(rawTx)
    } else {
      setProcessingStatus(ProcessingStatus.Error)
    }
  }

  const handleInput = (value?: string, callback?: (v: string) => void) => {
    callback?.(value || '')
  }

  const depositInUsd = useMemo(() => {
    return (wbtcPrice * Number(deposit)).toFixed(2)
  }, [deposit, wbtcPrice])

  useEffect(() => {
    setTryOpenVaultBitUsd(mint)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mint])

  useEffect(() => {
    setMint('')
    setTryOpenVaultCollateral(deposit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deposit])

  useEffect(() => {
    if (btcAddress) {
      signData()
    }
  }, [btcAddress, signData])

  useEffect(() => {
    if (evmAddress) {
      setProcessingTxn(
        getLocalStorage(
          `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_TXN}-${evmAddress}`
        ) ?? ''
      )
      setProcessingStep(
        getLocalStorage(
          `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_STEP}-${evmAddress}`
        ) === '2'
          ? TxnStep.Two
          : TxnStep.One
      )
    }
  }, [evmAddress])

  useEffect(() => {
    if (
      processingTxn &&
      processingStep === TxnStep.One &&
      processingStatus === ProcessingStatus.Processing
    ) {
      setShowProcessing(true)
      const intervalId = setInterval(() => {
        MempoolService.getTransaction
          .call(processingTxn)
          .then((response) => {
            if (response?.status?.confirmed) {
              setProcessingStep(TxnStep.Two)
              setLocalStorage(
                `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_STEP}-${evmAddress}`,
                TxnStep.Two
              )
              setShowProcessing(true)
            } else {
              console.log('waiting txn confirm')
            }
          })
          .catch((e) => {
            if (isAxiosError(e) && e.response?.status === 404) {
              clearInterval(intervalId)
              setProcessingTxn('')
              deleteLocalStorage(
                `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_TXN}-${evmAddress}`
              )
              handleBroadcasting(
                getLocalStorage(
                  `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_RAW_BTC_TXN}-${evmAddress}`
                )
              )
            }
            console.log('get onchain btc txn error: ', e)
          })
      }, 3000)

      return () => {
        clearInterval(intervalId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    processingTxn,
    processingStatus,
    processingStep,
    MempoolService.getTransaction,
    evmAddress
  ])

  useEffect(() => {
    if (
      processingTxn &&
      processingStep === TxnStep.Two &&
      processingStatus === ProcessingStatus.Processing
    ) {
      setShowProcessing(true)
      const intervalId = setInterval(() => {
        ZetaService.inboundHashToCctx
          .call(processingTxn)
          .then((res) => {
            if (
              res?.data?.inboundHashToCctx.cctx_index &&
              res?.data?.inboundHashToCctx.cctx_index.length > 0
            ) {
              console.log(
                'zetaTxn:',
                res?.data?.inboundHashToCctx.cctx_index[0]
              )
              setProcessingTxn(res?.data?.inboundHashToCctx.cctx_index[0])
            } else {
              console.log('waiting txn inbound_hash')
            }
          })
          .catch(() => {
            console.log('waiting txn')
          })
      }, 3000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [processingTxn, processingStatus, processingStep, evmAddress])

  useEffect(() => {
    if (processingStep === TxnStep.Two && zetaTxnReceipt?.status) {
      setShowProcessing(true)
      deleteLocalStorage(
        `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_TXN}-${evmAddress}`
      )
      deleteLocalStorage(
        `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_STEP}-${evmAddress}`
      )

      console.log('zeta txnReceipt: ', zetaTxnReceipt?.status)
      if (zetaTxnReceipt?.status === 'success') {
        setProcessingStatus(ProcessingStatus.Success)
      }
      if (zetaTxnReceipt?.status === 'reverted') {
        setProcessingStatus(ProcessingStatus.Error)
      }
    }
  }, [zetaTxnReceipt, processingStep, evmAddress])

  return (
    <div className="size-full overflow-y-auto pb-12">
      <ZetaProcessing
        status={processingStatus}
        step={processingStep}
        txnId={processingTxn}
        open={showProcessing}
        onOpen={() => setShowProcessing(true)}
        onClose={() => setShowProcessing(false)}></ZetaProcessing>

      <VaultTitleBlue>OPEN A VAULT</VaultTitleBlue>
      <VaultHeader collateral={collateral} />

      <NativeBtcWalletModal
        onClose={() => setBtcWalletOpen(false)}
        isOpen={btcWalletOpen}
      />

      <div className="mx-auto mt-6 flex w-[400px] flex-col gap-y-4">
        <NumberInput
          scale={8}
          value={deposit}
          onInputChange={(v) => handleInput(v, setDeposit)}
          greyOut={depositDisabled}
          disabled={depositDisabled}
          errorMessage={depositInputErrorMsg}
          title={`DEPOSIT ${deptTokenSymbol}`}
          titleSuffix={`Available: ${formatWBtc(
            btcBalance,
            false,
            true
          )} ${deptTokenSymbol}`}
          inputSuffix={
            <div className="flex h-full items-center gap-x-1.5 py-1">
              {'~' + depositInUsd + '$'}
            </div>
          }
        />
        <NumberInput
          scale={4}
          value={mint}
          onInputChange={(v) => handleInput(v, setMint)}
          disabled={mintDisabled}
          greyOut={mintDisabled}
          errorMessage={mintInputErrorMsg}
          title="Mint bitUSD"
          titleSuffix={
            <span className="flex items-center gap-x-2">
              Max mint: {formatBitUsd(capturedMaxMint, true, true)}
            </span>
          }
          inputSuffix={
            !!capturedMaxMint &&
            !!Number(capturedMaxMint) && (
              <InputSuffixActionButton
                onClick={() => {
                  setMint(capturedMaxMint)
                }}>
                Max
              </InputSuffixActionButton>
            )
          }
        />
        <VaultInfo
          vault={{
            ...tryOpenVaultInfo,
            debtBitUSD: mint,
            lockedCollateral: deposit,
            collateralSymbol: deptTokenSymbol
          }}
          collateral={collateral}
          borderSvg={
            <VaultInfoBorderIcon className="absolute inset-0 z-0 text-white" />
          }
        />
        <div className="flex w-full items-center gap-x-4">
          <ActionButton className="h-9 shrink-0" onClick={() => navigate(-1)}>
            <span className="flex items-center gap-x-2 text-white">
              <ChevronLeftIcon />
              Back
            </span>
          </ActionButton>

          <SubmitButton
            onClick={handleNext}
            className="h-9 w-full flex-1"
            disabled={isNextButtonDisabled}>
            Open vault
          </SubmitButton>
        </div>
      </div>
    </div>
  )
}

export const ZetaOpenVault = memo(OpenVault)
