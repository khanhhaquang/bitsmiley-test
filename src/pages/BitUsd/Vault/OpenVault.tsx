import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ChevronLeftIcon, VaultInfoBorderIcon } from '@/assets/icons'
import { useReadErc20Symbol } from '@/contracts/ERC20'
import { useCollaterals } from '@/hooks/useCollaterals'
import { useManageVault } from '@/hooks/useManageVault'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useTokenPrice } from '@/hooks/useTokenPrice'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useVaultDetail } from '@/hooks/useVaultDetail'
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

export const OpenVault: React.FC<{ chainId: number; collateralId: string }> = ({
  chainId,
  collateralId
}) => {
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

  const { balance: wbtcBalance } = useTokenBalance(
    collateral?.collateral?.tokenAddress
  )
  const wbtcPrice = useTokenPrice()

  const [mint, setMint] = useState('')
  const [deposit, setDeposit] = useState('')

  const {
    txnErrorMsg,
    setTxnErrorMsg,
    openVault,
    openVaultTxId,
    openVaultTxnStatus,
    setOpenVaultTxnStatus,
    approvalVault,
    approvalTxnStatus,
    wBtcAllowance
  } = useManageVault(collateral)

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
    if (wbtcBalance <= 0) return true
  }, [wbtcBalance])

  const depositInputErrorMsg = useMemo(() => {
    if (deposit) {
      if (Number(deposit) <= 0) {
        return 'Deposit value must larger than zero.'
      }
      if (Number(deposit) > wbtcBalance)
        return 'Deposit value is exceeding balance.'
    }

    return ''
  }, [deposit, wbtcBalance])

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
    if (!isApproved) {
      approvalVault('wBTC', deposit)
    } else {
      openVault(deposit, mint, collateralId)
    }
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

  return (
    <div className="size-full overflow-y-auto pb-12">
      {processingModal}
      <VaultTitleBlue>OPEN A VAULT</VaultTitleBlue>
      <VaultHeader collateral={collateral} />

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
            wbtcBalance,
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

          {isApproved ? (
            <SubmitButton
              onClick={handleNext}
              className="h-9 w-full flex-1"
              disabled={isNextButtonDisabled}>
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
