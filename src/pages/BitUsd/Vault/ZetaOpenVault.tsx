import { memo, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ChevronLeftIcon, VaultInfoBorderIcon } from '@/assets/icons'
import { NativeBtcWalletModal } from '@/components/ConnectWallet/NativeBtcWalletModal'
import { useReadErc20Symbol } from '@/contracts/ERC20'
import { useBTCBalance } from '@/hooks/useBTCBalance'
import { useCollaterals } from '@/hooks/useCollaterals'
import { useTokenPrice } from '@/hooks/useTokenPrice'
import { useVaultDetail } from '@/hooks/useVaultDetail'
import { useZetaClient } from '@/hooks/useZetaClient'

import VaultHeader from './component/VaultHeader'
import { useZetaProcessing } from './useZetaProcessing'

import {
  ActionButton,
  InputSuffixActionButton,
  SubmitButton
} from '../components/ActionButton'
import { NumberInput } from '../components/NumberInput'
import { VaultInfo } from '../components/VaultInfo'
import { VaultTitleBlue } from '../components/VaultTitle'
import { ZetaProcessing } from '../components/ZetaProcessing'
import { ProcessingStatus } from '../components/ZetaProcessing.types'
import { formatBitUsd, formatCollateral } from '../display'

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

  const { data: deptTokenSymbol = '-' } = useReadErc20Symbol({
    address: collateral?.collateral?.tokenAddress
  })

  const { balanceAsBtc: btcBalance } = useBTCBalance()
  const wbtcPrice = useTokenPrice()

  const [deposit, setDeposit] = useState('')
  const [mint, setMint] = useState('')

  const { btcAddress, openVault, sign } = useZetaClient(chainId, collateralId)
  const {
    showProcessing,
    processingStep,
    processingStatus,
    processingTxn,
    setShowProcessing,
    setProcessingStatus,
    initProcess,
    cacheRawTxn,
    handleBroadcasting
  } = useZetaProcessing(chainId, collateralId)
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

  const depositInUsd = useMemo(() => {
    return (wbtcPrice * Number(deposit)).toFixed(2)
  }, [deposit, wbtcPrice])

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

  const handleNext = async () => {
    if (!btcAddress) {
      setBtcWalletOpen(true)
      return
    }
    //reset status
    initProcess()
    const rawTx = await openVault(Number(deposit), mint)
    if (rawTx) {
      cacheRawTxn(rawTx)
      handleBroadcasting(rawTx)
    } else {
      setProcessingStatus(ProcessingStatus.Error)
    }
  }

  const handleInput = (value?: string, callback?: (v: string) => void) => {
    callback?.(value || '')
  }

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
      sign()
    }
  }, [btcAddress, sign])

  return (
    <div className="size-full overflow-y-auto pb-12">
      <ZetaProcessing
        status={processingStatus}
        step={processingStep}
        txn={processingTxn}
        open={showProcessing}
        onOpen={() => setShowProcessing(true)}
        onClose={() => setShowProcessing(false)}
      />

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
          titleSuffix={`Available: ${formatCollateral(
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
