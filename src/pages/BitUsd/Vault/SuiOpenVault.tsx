import { memo, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ChevronLeftIcon, VaultInfoBorderIcon } from '@/assets/icons'
import { useSuiCollaterals } from '@/hooks/useSuiCollaterals'
import { useSuiToken } from '@/hooks/useSuiToken'
import { useSuiTokenPrice } from '@/hooks/useSuiTokenPrice'
import { useSuiTransaction } from '@/hooks/useSuiTransaction'
import { useSuiVaultDetail } from '@/hooks/useSuiVaultDetail'
import { IDetailedCollateral } from '@/types/vault'

import VaultHeader from './component/VaultHeader'

import {
  ActionButton,
  InputSuffixActionButton,
  SubmitButton
} from '../components/ActionButton'
import { NumberInput } from '../components/NumberInput'
import SuiProcessing from '../components/SuiProcessing'
import { VaultInfo } from '../components/VaultInfo'
import { VaultTitleBlue } from '../components/VaultTitle'
import { formatBitUsd, formatWBtc } from '../display'

const OpenVault: React.FC<{ chainId: number; collateralId: string }> = ({
  collateralId
}) => {
  const navigate = useNavigate()
  const { collateral, refetch: refetchCollateral } =
    useSuiCollaterals(collateralId)

  const {
    refreshVaultValues,
    tryOpenVaultInfo,
    setTryOpenVaultBitUsd,
    setTryOpenVaultCollateral,
    capturedMaxMint
  } = useSuiVaultDetail(collateral)

  const [mint, setMint] = useState('')
  const [deposit, setDeposit] = useState('')

  const { openAndMint, transactionState } = useSuiTransaction(collateralId)

  const { price: collateralPrice } = useSuiTokenPrice(collateral?.collateralId)
  const { balance: collateralBalance, coinMetadata: collateralMetaData } =
    useSuiToken(collateral?.collateral?.tokenAddress)

  const deptTokenSymbol = collateralMetaData?.name || ''

  const depositDisabled = useMemo(() => {
    if (collateralBalance <= 0) return true
  }, [collateralBalance])

  const depositInputErrorMsg = useMemo(() => {
    if (deposit) {
      if (Number(deposit) <= 0) {
        return 'Deposit value must larger than zero.'
      }
      if (Number(deposit) > collateralBalance)
        return 'Deposit value is exceeding balance.'
    }

    return ''
  }, [deposit, collateralBalance])

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
    openAndMint(deposit, mint, collateralId)
  }

  const handleInput = (value?: string, callback?: (v: string) => void) => {
    callback?.(value || '')
  }

  const depositInUsd = useMemo(() => {
    return (collateralPrice * Number(deposit)).toFixed(2)
  }, [deposit, collateralPrice])

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
      <SuiProcessing
        {...transactionState}
        refetchCollateral={refetchCollateral}
        refreshVaultValues={refreshVaultValues}
      />
      <VaultTitleBlue>OPEN A VAULT</VaultTitleBlue>
      <VaultHeader collateral={collateral as IDetailedCollateral} />

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
            collateralBalance,
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
          collateral={collateral as IDetailedCollateral}
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

export const SuiOpenVault = memo(OpenVault)
