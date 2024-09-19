import { memo, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ChevronLeftIcon, VaultInfoBorderIcon } from '@/assets/icons'
import { NativeBtcWalletModal } from '@/components/ConnectWallet/NativeBtcWalletModal'
import { useReadErc20Symbol } from '@/contracts/ERC20'
import { useBTCBalance } from '@/hooks/useBTCBalance'
import { useCollaterals } from '@/hooks/useCollaterals'
import { useManageVault } from '@/hooks/useManageVault'
import { useTokenPrice } from '@/hooks/useTokenPrice'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useVaultDetail } from '@/hooks/useVaultDetail'
import { useZetaClient } from '@/hooks/useZetaClient'
import { TransactionStatus } from '@/types/common'

import VaultHeader from './component/VaultHeader'

import {
  ActionButton,
  InputSuffixActionButton,
  SubmitButton
} from '../components/ActionButton'
import { NumberInput } from '../components/NumberInput'
import { ProcessingModal, ProcessingType } from '../components/Processing'
import { VaultInfo } from '../components/VaultInfo'
import { VaultTitleBlue } from '../components/VaultTitle'
import { formatBitUsd, formatWBtc } from '../display'

export const OpenVault: React.FC<{
  chainId: number
  collateralId: string
}> = ({ chainId, collateralId }) => {
  const navigate = useNavigate()

  const { collateral, refetch: refetchCollateral } = useCollaterals(
    chainId,
    collateralId
  )

  const {
    refreshVaultValues,
    tryOpenVaultInfo,
    setTryOpenVaultBitUsd,
    setTryOpenVaultCollateral,
    capturedMaxMint
  } = useVaultDetail(collateral)

  const { blockExplorerUrl } = useUserInfo()
  const { data: deptTokenSymbol = '-' } = useReadErc20Symbol({
    address: collateral?.collateral?.tokenAddress
  })

  //TODO: create a useBtcBalance to get balance of btc in BTC chain, currently this is for EVM not correct
  // const { balance: btcBalance } = useTokenBalance(
  //   collateral?.collateral?.tokenAddress
  // )

  const { balance: btcBalance } = useBTCBalance(
    collateral?.collateral?.tokenAddress
  )
  const wbtcPrice = useTokenPrice()

  const [mint, setMint] = useState('')
  const [deposit, setDeposit] = useState('')
  const [btcWalletOpen, setBtcWalletOpen] = useState(false)

  const {
    txnErrorMsg,
    setTxnErrorMsg,
    openVaultTxId,
    openVaultTxnStatus,
    setOpenVaultTxnStatus,
    approvalTxnStatus,
    wBtcAllowance
  } = useManageVault(collateral)

  const { tapRootAddress, btcAddress, handleSendBtc, signData } = useZetaClient(
    chainId,
    collateralId
  )

  const isApproving = useMemo(
    () =>
      approvalTxnStatus === TransactionStatus.Signing ||
      approvalTxnStatus === TransactionStatus.Processing,
    [approvalTxnStatus]
  )

  const isApproved = useMemo(
    () => Number(wBtcAllowance) >= Number(deposit),
    [deposit, wBtcAllowance]
  )

  const depositDisabled = useMemo(() => {
    // if (btcBalance <= 0) return true
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

    return false
  }, [deposit, depositInputErrorMsg, mintInputErrorMsg])

  const handleNext = () => {
    if (!btcAddress) {
      setBtcWalletOpen(true)
      return
    }

    handleSendBtc(Number(deposit))
    //TODO: get commit txn hash and buildRevealTxn
  }

  const handleInput = (value?: string, callback?: (v: string) => void) => {
    callback?.(value || '')
  }

  const depositInUsd = useMemo(() => {
    return (wbtcPrice * Number(deposit)).toFixed(2)
  }, [deposit, wbtcPrice])

  const processingModal = useMemo(() => {
    if (isApproving)
      return <ProcessingModal message="Waiting for approval from wallet..." />

    switch (openVaultTxnStatus) {
      case TransactionStatus.Signing:
        return <ProcessingModal message="Waiting for wallet signature..." />

      case TransactionStatus.Processing:
        return (
          <ProcessingModal
            message="Your transaction is getting processed on-chain."
            link={
              !!blockExplorerUrl && !!openVaultTxId
                ? `${blockExplorerUrl}/tx/${openVaultTxId}`
                : ''
            }
          />
        )
      case TransactionStatus.Success:
        return (
          <ProcessingModal
            type={ProcessingType.Success}
            actionButtonText="Ok"
            onClickActionButton={() => {
              refetchCollateral()
              refreshVaultValues()
              navigate(-1)
            }}
            message="You have successfully created a vault. Now you can see it in the
        AlphaNet main page"
          />
        )

      case TransactionStatus.Failed:
        return (
          <ProcessingModal
            type={ProcessingType.Error}
            actionButtonText="Ok"
            onClickActionButton={() => {
              setOpenVaultTxnStatus(TransactionStatus.Idle)
              setTxnErrorMsg('')
            }}
            message={
              !blockExplorerUrl || !openVaultTxId ? (
                <span>{txnErrorMsg}</span>
              ) : (
                <span>
                  The transaction has failed. You can check it on-chain{' '}
                  <a
                    className="cursor-pointer text-green hover:underline"
                    href={`${blockExplorerUrl}/tx/${openVaultTxId}`}>
                    here
                  </a>
                </span>
              )
            }
          />
        )
      default:
        return null
    }
  }, [
    isApproving,
    openVaultTxnStatus,
    blockExplorerUrl,
    openVaultTxId,
    txnErrorMsg,
    refetchCollateral,
    refreshVaultValues,
    navigate,
    setOpenVaultTxnStatus,
    setTxnErrorMsg
  ])

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
    signData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="size-full overflow-y-auto pb-12">
      {processingModal}
      <VaultTitleBlue>OPEN A VAULT</VaultTitleBlue>
      <VaultHeader collateral={collateral} />

      <NativeBtcWalletModal
        onClose={() => setBtcWalletOpen(false)}
        isOpen={btcWalletOpen}
      />
      <div className="mt-4 flex flex-col items-center gap-y-2 text-xs">
        <span>To taproot address: {tapRootAddress}</span>
      </div>

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
            lockedCollateral: deposit
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

          {!isApproved ? (
            <SubmitButton
              onClick={handleNext}
              className="h-9 w-full flex-1"
              disabled={false}>
              Open vault
            </SubmitButton>
          ) : (
            <ActionButton
              onClick={handleNext}
              className="h-9 w-full flex-1"
              disabled={isNextButtonDisabled}>
              Give permission to use BTC
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  )
}

export const ZetaOpenVault = memo(OpenVault)
