import { memo, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ChevronLeftIcon, VaultInfoBorderIcon } from '@/assets/icons'
import { NativeBtcWalletModal } from '@/components/ConnectWallet/NativeBtcWalletModal'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { useReadErc20Symbol } from '@/contracts/ERC20'
import { useBTCBalance } from '@/hooks/useBTCBalance'
import { useCollaterals } from '@/hooks/useCollaterals'
import { useManageVault } from '@/hooks/useManageVault'
import { useTokenPrice } from '@/hooks/useTokenPrice'
import { useVaultDetail } from '@/hooks/useVaultDetail'
import { useZetaClient } from '@/hooks/useZetaClient'
import { MempoolService } from '@/services/mempool'
import { setLocalStorage } from '@/utils/storage'

import VaultHeader from './component/VaultHeader'

import {
  ActionButton,
  InputSuffixActionButton,
  SubmitButton
} from '../components/ActionButton'
import { NumberInput } from '../components/NumberInput'
import { VaultInfo } from '../components/VaultInfo'
import { VaultTitleBlue } from '../components/VaultTitle'
import {
  ProcessingStatus,
  TxnStep,
  ZetaProcessing
} from '../components/ZetaProcessing'
import { formatBitUsd, formatWBtc } from '../display'

export const OpenVault: React.FC<{
  chainId: number
  collateralId: string
}> = ({ chainId, collateralId }) => {
  const navigate = useNavigate()

  const { collateral } = useCollaterals(chainId, collateralId)

  const {
    tryOpenVaultInfo,
    setTryOpenVaultBitUsd,
    setTryOpenVaultCollateral,
    capturedMaxMint
  } = useVaultDetail(collateral)

  // const { blockExplorerUrl } = useUserInfo()
  const { data: deptTokenSymbol = '-' } = useReadErc20Symbol({
    address: collateral?.collateral?.tokenAddress
  })

  const { balanceAsBtc: btcBalance } = useBTCBalance()
  const wbtcPrice = useTokenPrice()

  const [mint, setMint] = useState('')
  const [deposit, setDeposit] = useState('')
  const [btcWalletOpen, setBtcWalletOpen] = useState(false)

  const [showProcessing, setShowProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(TxnStep.One)
  const [processingStatus, setProcessingStatus] = useState(
    ProcessingStatus.Processing
  )
  const [processingTxn, setProcessingTxn] = useState('')
  // const { data: txnReceipt } = useWaitForTransactionReceipt({
  //   hash: processingTxn as Hash,
  //   query: {
  //     enabled:
  //       isHash(processingTxn) &&
  //       processingStep === TxnStep.Two &&
  //       processingStatus === ProcessingStatus.Processing
  //   }
  // })

  const { wBtcAllowance } = useManageVault(collateral)

  const {
    tapRootAddress,
    btcAddress,
    handleSendBtc,
    signData,
    handleRevealTxn
  } = useZetaClient(chainId, collateralId)

  const isApproved = useMemo(
    () => Number(wBtcAllowance) >= Number(deposit),
    [deposit, wBtcAllowance]
  )

  const depositDisabled = useMemo(() => {
    if (btcBalance <= 0) return true
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
    setShowProcessing(true)
    setProcessingStep(TxnStep.One)
    setProcessingStatus(ProcessingStatus.Processing)

    handleSendBtc(Number(deposit))
      .then((res) => {
        if (res) {
          setProcessingTxn(res)
          setLocalStorage(LOCAL_STORAGE_KEYS.ZETA_PROCESSING_TXN, res)
        } else {
          setProcessingStatus(ProcessingStatus.Error)
        }
      })
      .catch((e) => {
        console.log('handleSendBtc error:', e)
        setProcessingStatus(ProcessingStatus.Error)
      })
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
    signData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      processingTxn &&
      processingStep === TxnStep.One &&
      processingStatus === ProcessingStatus.Processing
    ) {
      const intervalId = setInterval(() => {
        MempoolService.getTransaction
          .call(processingTxn)
          .then((response) => {
            if (response?.data?.status.confirmed) {
              setProcessingStatus(ProcessingStatus.Success)
            } else {
              console.log('waiting txn confirm')
            }
          })
          .catch(() => {
            console.log('waiting txn')
          })
      }, 1000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [processingTxn, processingStatus, processingStep])

  useEffect(() => {
    if (
      processingTxn &&
      processingStep === TxnStep.One &&
      processingStatus === ProcessingStatus.Success
    ) {
      handleRevealTxn(processingTxn, Number(deposit), (hash) => {
        console.log(hash)
        setProcessingStep(TxnStep.Two)
        if (hash) {
          setProcessingTxn(hash)
          setProcessingStatus(ProcessingStatus.Success)
        } else {
          setProcessingStatus(ProcessingStatus.Error)
        }
      }).catch((e) => {
        console.log('handleRevealTxn error:', e)
        setProcessingStep(TxnStep.Two)
        setProcessingStatus(ProcessingStatus.Error)
      })
    }
  }, [processingTxn, processingStatus, processingStep, deposit])

  // useEffect(() => {
  //   if (processingStep === TxnStep.Two) {
  //     if (txnReceipt?.status === 'success') {
  //       setProcessingStatus(ProcessingStatus.Success)
  //     }
  //     if (txnReceipt?.status === 'reverted') {
  //       setProcessingStatus(ProcessingStatus.Error)
  //     }
  //   }
  // }, [txnReceipt?.status, processingStep])

  return (
    <div className="size-full overflow-y-auto pb-12">
      {showProcessing && (
        <ZetaProcessing
          status={processingStatus}
          step={processingStep}
          txnId={processingTxn}
          onClose={() => setShowProcessing(false)}></ZetaProcessing>
      )}
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
