import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ArrowLeftDoubleIcon,
  BitCoinIcon,
  DollarIcon,
  OrIcon,
  VaultChangesBorderIcon
} from '@/assets/icons'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useSuiCollaterals } from '@/hooks/useSuiCollaterals'
import { useSuiToken } from '@/hooks/useSuiToken'
import { useSuiTokenPrice } from '@/hooks/useSuiTokenPrice'
import { useSuiTransaction } from '@/hooks/useSuiTransaction'
import { useSuiVaultDetail } from '@/hooks/useSuiVaultDetail'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IDetailedCollateral } from '@/types/vault'
import {
  formatNumberAsCeil,
  formatNumberAsCompact,
  formatNumberWithSeparator
} from '@/utils/number'
import { convertToMist } from '@/utils/sui'

import { LiquidatedWarning } from './component/LiquidatedWarning'
import { ManageVaultHeaderInformation } from './component/ManageVaultHeaderInformation'
import {
  ManageVaultInfoSection,
  ManageVaultSectionTitle
} from './component/ManageVaultInfoSection'

import {
  ActionButton,
  InputSuffixActionButton,
  SubmitButton
} from '../components/ActionButton'
import { NumberInput } from '../components/NumberInput'
import { ProcessingModal } from '../components/Processing'
import { ProcessingType } from '../components/Processing.types'
import { VaultInfo } from '../components/VaultInfo'
import { VaultTitleBlue } from '../components/VaultTitle'
import { displayVaultValues } from '../display'

export const SuiManageVault: React.FC<{
  chainId: number
  collateralId: string
}> = ({ chainId, collateralId }) => {
  const navigate = useNavigate()
  const { suiBlockExplorerUrl } = useUserInfo()
  const { collateral, refetch: refetchCollaterals } =
    useSuiCollaterals(collateralId)

  const { mint, repay, repayAll, transactionState } =
    useSuiTransaction(collateralId)

  const {
    vault,
    changedVault,
    setChangedBitUsd,
    setChangedCollateral,
    hasChangedVault,
    refreshVaultValues,
    maxVault,
    setMaxVaultBitUsd,
    setMaxVaultCollateral
  } = useSuiVaultDetail(collateral)

  const { suiContractAddresses } = useContractAddresses(chainId)
  const [isMintFromBtc, setIsMintFromBtc] = useState<boolean | undefined>()

  const [depositBtc, setDepositBtc] = useState('')
  const [mintBitUsd, setMintBitUsd] = useState('')
  const [withdrawBtc, setWithdrawBtc] = useState('')
  const [repayBitUsd, setRepayBitUsd] = useState('')

  const { price: collateralPrice } = useSuiTokenPrice(collateral?.collateralId)
  const { balance: collateralBalance, coinMetadata: collateralMetaData } =
    useSuiToken(collateral?.collateral?.tokenAddress)

  const deptTokenSymbol = collateralMetaData?.name || ''

  const { balance: bitUsdBalance, coinMetadata: bitUSDMetaData } = useSuiToken(
    `${suiContractAddresses?.bitUSDPackageId}::bitusd::BITUSD`
  )

  const bitUSDDecimals = useMemo(
    () => bitUSDMetaData?.decimals ?? 0,
    [bitUSDMetaData?.decimals]
  )

  const depositInUsd = useMemo(() => {
    return (collateralPrice * Number(depositBtc)).toFixed(2)
  }, [depositBtc, collateralPrice])

  const minRepay = useMemo(() => {
    if (!repayBitUsd || !vault || !collateral) return 0

    const debt = Number(vault.debtBitUSD)
    const floor = Number(collateral?.collateral?.vaultMinDebt)
    const repay = Number(repayBitUsd)
    const remain = debt - repay

    if (remain >= floor) return 0
    return debt - floor
  }, [collateral, repayBitUsd, vault])

  const isRepayAll = useMemo(() => {
    const isRepayAllBTC =
      withdrawBtc && Number(withdrawBtc) === Number(vault?.availableToWithdraw)

    const ceiledRepayBitUsd = !repayBitUsd
      ? convertToMist(0, bitUSDDecimals)
      : // pass one more in case fee changes
        convertToMist(Number(repayBitUsd) + 0.01, bitUSDDecimals)

    const isRepayAllBUSD =
      !!vault?.debtBitUSD &&
      (convertToMist(repayBitUsd, bitUSDDecimals) >=
        convertToMist(vault?.debtBitUSD, bitUSDDecimals) ||
        ceiledRepayBitUsd >= convertToMist(vault?.debtBitUSD, bitUSDDecimals))
    return isRepayAllBTC || isRepayAllBUSD
  }, [
    withdrawBtc,
    vault?.availableToWithdraw,
    vault?.debtBitUSD,
    repayBitUsd,
    bitUSDDecimals
  ])

  const nextButtonDisabled = useMemo(() => {
    if (!maxVault || !vault || isMintFromBtc === undefined) return true

    const { availableToMint: maxToMint, availableToWithdraw: maxToWithdraw } =
      maxVault

    // mintAndDeposit
    if (isMintFromBtc === true) {
      // no input values
      if (!depositBtc || !mintBitUsd) return true // TO DO: Confirm with BE
      // deposit > balance
      if (!!depositBtc && Number(depositBtc) > collateralBalance) return true

      const minToMint = Number(collateral?.collateral?.vaultMinDebt)

      // mintBitUsd && changedVaultDebt < vaultFloor
      if (
        minToMint &&
        !!mintBitUsd &&
        Number(changedVault?.debtBitUSD) < minToMint
      )
        return true
      // mintBitusd > availableToMint
      return Number(maxToMint) >= 0 && Number(mintBitUsd) > Number(maxToMint)
    }

    // withdrawAndRepay
    // no input values
    if (!withdrawBtc && !repayBitUsd) return true
    // repay > balance
    if (!!repayBitUsd && Number(repayBitUsd) > bitUsdBalance) return true
    // remain < vaultFloor
    if (
      !!repayBitUsd &&
      !!minRepay &&
      Number(repayBitUsd) < Number(vault?.debtBitUSD) &&
      Number(minRepay) < Number(repayBitUsd)
    )
      return true
    // repay < stability fee
    if (
      !!vault?.debtBitUSD &&
      !!vault?.fee &&
      (!!repayBitUsd || !!withdrawBtc) &&
      Number(repayBitUsd) < Number(vault?.fee)
    )
      return true
    // withdraw > availableToWithdraw
    return (
      Number(maxToWithdraw) >= 0 && Number(withdrawBtc) > Number(maxToWithdraw)
    )
  }, [
    bitUsdBalance,
    changedVault?.debtBitUSD,
    depositBtc,
    isMintFromBtc,
    maxVault,
    minRepay,
    mintBitUsd,
    collateral?.collateral?.vaultMinDebt,
    repayBitUsd,
    vault,
    collateralBalance,
    withdrawBtc
  ])

  const depositWBtcDisabled = useMemo(
    () => collateralBalance <= 0,
    [collateralBalance]
  )
  const withdrawWbtcDisabled = useMemo(
    () => Number(maxVault?.availableToWithdraw) <= 0,
    [maxVault?.availableToWithdraw]
  )
  const mintBitUsdDisabled = useMemo(
    () => Number(maxVault?.availableToMint) <= 0,
    [maxVault?.availableToMint]
  )
  const repayBitUsdDisabled = useMemo(
    () => bitUsdBalance <= 0 || Number(vault?.debtBitUSD) <= 0,
    [bitUsdBalance, vault?.debtBitUSD]
  )

  const handleInput = (
    type: 'depositBtc' | 'withdrawBtc' | 'mintBitUsd' | 'repayBitUsd',
    v?: string
  ) => {
    const value = v || ''
    if (type === 'depositBtc') {
      setDepositBtc(value)
      setChangedCollateral(value)
      setChangedBitUsd(mintBitUsd)

      setMaxVaultBitUsd('')
      setMaxVaultCollateral(value)
    }

    if (type === 'withdrawBtc') {
      setWithdrawBtc(value)
      setChangedCollateral('-' + value)
      setChangedBitUsd('-' + repayBitUsd)
    }

    if (type === 'mintBitUsd') {
      setMintBitUsd(value)
      setChangedCollateral(depositBtc)
      setChangedBitUsd(value)
    }

    if (type === 'repayBitUsd') {
      setRepayBitUsd(value)
      setChangedBitUsd('-' + value)
      setChangedCollateral('-' + withdrawBtc)

      setMaxVaultCollateral('')
      setMaxVaultBitUsd(value ? '-' + value : '')
    }
  }

  const handleNext = () => {
    if (isMintFromBtc) {
      mint(depositBtc, mintBitUsd)
    } else {
      if (isRepayAll) {
        repayAll(vault?.availableToWithdraw as string)
      } else {
        repay(withdrawBtc, repayBitUsd)
      }
    }
  }

  const liquidated = collateral?.liquidated?.[0]
  const [isLiquidatedWarningOpen, setIsLiquidatedWarningOpen] =
    useState(!!liquidated)

  const noInputValues =
    !depositBtc && !mintBitUsd && !withdrawBtc && !repayBitUsd

  const processingType = useMemo(() => {
    if (transactionState?.isSuccess) return ProcessingType.Success
    if (transactionState?.isError) return ProcessingType.Error
    if (transactionState?.isPending) return ProcessingType.Processing
    return ProcessingType.Info
  }, [transactionState])

  const txnLink = useMemo(() => {
    if (
      !!suiBlockExplorerUrl &&
      isMintFromBtc &&
      transactionState?.transactionResponse
    )
      return `${suiBlockExplorerUrl}/tx/${transactionState?.transactionResponse}`
    return ''
  }, [suiBlockExplorerUrl, isMintFromBtc, transactionState])

  const processingMessage = useMemo(() => {
    switch (processingType) {
      case 'success':
        return 'Your vault change is completed.'
      case 'error':
        if (transactionState?.error) return transactionState?.error?.message
        return 'The transaction has failed.'
      default:
        return 'Your transaction is getting processed on-chain.'
    }
  }, [processingType, transactionState])

  const processingModal = useMemo(() => {
    if (transactionState && !transactionState?.isIdle)
      return (
        <ProcessingModal
          actionButtonClassName="w-[300px]"
          type={processingType}
          onClickActionButton={() => {
            refetchCollaterals()
            refreshVaultValues()
            if (processingType === 'error') {
              transactionState?.reset()
            }

            if (processingType === 'success') {
              navigate(-1)
            }
          }}
          actionButtonText={processingType !== 'info' ? 'Ok' : ''}
          message={processingMessage}
          link={txnLink}
        />
      )
    return null
  }, [
    transactionState,
    navigate,
    processingMessage,
    processingType,
    refetchCollaterals,
    refreshVaultValues,
    txnLink
  ])

  const commonBitUsdChangedErrorMsg = useMemo(() => {
    if (
      changedVault?.debtBitUSD &&
      Number(changedVault?.debtBitUSD) <
        Number(collateral?.collateral?.vaultMinDebt)
    ) {
      return 'Vault debt doesn’t reach vault floor.'
    }
    return ''
  }, [changedVault?.debtBitUSD, collateral?.collateral?.vaultMinDebt])

  const mintInputErrorMsg = useMemo(() => {
    if (!!mintBitUsd && commonBitUsdChangedErrorMsg) {
      return commonBitUsdChangedErrorMsg
    }
    return ''
  }, [commonBitUsdChangedErrorMsg, mintBitUsd])

  const repayInputErrorMsg = useMemo(() => {
    if (
      !!vault?.debtBitUSD &&
      !!vault?.fee &&
      !!repayBitUsd &&
      Number(repayBitUsd) < Number(vault?.fee)
    ) {
      return 'Min repay must exceed stability fee'
    }

    if (!!repayBitUsd && Number(repayBitUsd) > Number(bitUsdBalance)) {
      return 'Available bitUSD doesn’t cover the debts'
    }

    if (!!repayBitUsd && commonBitUsdChangedErrorMsg)
      return commonBitUsdChangedErrorMsg
    if (
      isRepayAll &&
      Number(repayBitUsd) < Number(vault?.debtBitUSD) + Number(vault?.fee)
    ) {
      return 'Repay all must cover debts and stability fee'
    }
    return ''
  }, [
    bitUsdBalance,
    commonBitUsdChangedErrorMsg,
    repayBitUsd,
    isRepayAll,
    vault?.debtBitUSD,
    vault?.fee
  ])

  useEffect(() => {
    if (withdrawBtc && !repayBitUsd && !!vault?.fee) {
      setRepayBitUsd(vault?.fee || '')
    }
  }, [repayBitUsd, vault, withdrawBtc])

  useEffect(() => {
    if (isMintFromBtc === true) {
      setWithdrawBtc('')
      setRepayBitUsd('')
    }

    if (isMintFromBtc === false) {
      setDepositBtc('')
      setMintBitUsd('')
    }
  }, [isMintFromBtc])

  return (
    <div className="size-full overflow-y-auto pb-12">
      {processingModal}
      <VaultTitleBlue>MANAGE VAULT</VaultTitleBlue>
      <ManageVaultHeaderInformation
        collateral={collateral as IDetailedCollateral}
      />

      <div className="mx-auto mt-10 flex w-[709px] flex-col">
        <LiquidatedWarning
          collateral={collateral as IDetailedCollateral}
          open={isLiquidatedWarningOpen}
          onClose={() => setIsLiquidatedWarningOpen(false)}
        />

        <ManageVaultInfoSection
          className="mb-12"
          vault={{ ...vault, collateralSymbol: deptTokenSymbol }}
        />

        <div className="mb-6 grid grid-cols-2 gap-x-[46px]">
          <div className="overflow-hidden">
            <ManageVaultSectionTitle
              title="manage"
              className="mb-6 gap-x-0"
              subTitle="btc"
              icon={<BitCoinIcon className="shrink-0" width={27} height={29} />}
            />
            <NumberInput
              scale={8}
              value={depositBtc}
              onInputChange={(v) => handleInput('depositBtc', v)}
              onFocus={() => setIsMintFromBtc(true)}
              greyOut={isMintFromBtc === false}
              disabled={depositWBtcDisabled && false}
              title={`deposit ${deptTokenSymbol}`}
              inputSuffix={`~${depositInUsd}$`}
              titleSuffix={
                'Available: ' + formatNumberAsCompact(collateralBalance)
              }
            />
            <div className="my-3 flex items-center justify-center gap-x-2">
              <div className="h-[1px] flex-1 bg-white/20" />
              <OrIcon />
              <div className="h-[1px] flex-1 bg-white/20" />
            </div>

            <NumberInput
              scale={8}
              value={withdrawBtc}
              onInputChange={(v) => handleInput('withdrawBtc', v)}
              disabled={withdrawWbtcDisabled}
              onFocus={() => setIsMintFromBtc(false)}
              greyOut={isMintFromBtc === true}
              title={`withdraw ${deptTokenSymbol}`}
              titleSuffix={
                <span className="flex items-center gap-x-2">
                  Max: {displayVaultValues(maxVault, false).availableToWithdraw}
                </span>
              }
              inputSuffix={
                <InputSuffixActionButton
                  disabled={withdrawWbtcDisabled || isMintFromBtc === true}
                  onClick={() => {
                    handleInput(
                      'withdrawBtc',
                      maxVault?.availableToWithdraw || ''
                    )
                    setIsMintFromBtc(false)
                  }}>
                  Max
                </InputSuffixActionButton>
              }
            />
          </div>

          <div className="overflow-hidden">
            <ManageVaultSectionTitle
              title="manage"
              className="mb-6 gap-x-0"
              subTitle="bitUsd"
              icon={<DollarIcon className="shrink-0" width={27} height={29} />}
            />
            <NumberInput
              scale={4}
              value={mintBitUsd}
              disabled={mintBitUsdDisabled && false}
              onFocus={() => setIsMintFromBtc(true)}
              onInputChange={(v) => handleInput('mintBitUsd', v)}
              greyOut={isMintFromBtc === false}
              title="mint bitUSD"
              errorMessage={mintInputErrorMsg}
              titleSuffix={
                <span className="flex items-center gap-x-2">
                  Max Mint:
                  {displayVaultValues(maxVault, false).availableToMint}
                </span>
              }
              inputSuffix={
                <InputSuffixActionButton
                  disabled={mintBitUsdDisabled || isMintFromBtc === false}
                  onClick={() => {
                    handleInput('mintBitUsd', maxVault?.availableToMint || '')
                    setIsMintFromBtc(true)
                  }}>
                  Max
                </InputSuffixActionButton>
              }
            />
            <div className="my-3 flex items-center justify-center gap-x-2">
              <div className="h-[1px] flex-1 bg-white/20" />
              <OrIcon />
              <div className="h-[1px] flex-1 bg-white/20" />
            </div>
            <NumberInput
              scale={4}
              value={repayBitUsd}
              disabled={repayBitUsdDisabled}
              errorMessage={repayInputErrorMsg}
              onInputChange={(v) => handleInput('repayBitUsd', v)}
              onFocus={() => setIsMintFromBtc(false)}
              greyOut={isMintFromBtc === true}
              title="repay bitUSD"
              titleSuffix={
                'Available: ' + formatNumberWithSeparator(bitUsdBalance)
              }
              inputSuffix={
                <InputSuffixActionButton
                  disabled={repayBitUsdDisabled || isMintFromBtc === true}
                  className="w-[92px]"
                  onClick={() => {
                    handleInput(
                      'repayBitUsd',
                      !vault?.fee
                        ? vault?.debtBitUSD
                        : formatNumberAsCeil(vault?.debtBitUSD || '') || ''
                    )
                    setIsMintFromBtc(false)
                  }}>
                  Repay all
                </InputSuffixActionButton>
              }
            />
          </div>
        </div>

        {hasChangedVault && (
          <VaultInfo
            type="manage"
            vault={vault}
            changedVault={changedVault}
            hasChangedVault={hasChangedVault}
            className="mx-auto aspect-[711/195] w-[711px]"
            innerClassName="gap-x-[70px] text-white/70 flex items-center justify-center"
            borderSvg={
              <VaultChangesBorderIcon className="absolute inset-0 z-0 w-full" />
            }
          />
        )}

        {transactionState?.isIdle && (
          <div className="mx-auto mt-6 flex w-[451px] items-center gap-x-4">
            <ActionButton
              className="h-9 shrink-0 bg-white/5"
              onClick={() => navigate(-1)}>
              <span className="flex items-center gap-x-2 text-white/70">
                <ArrowLeftDoubleIcon />
                Back
              </span>
            </ActionButton>
            {noInputValues ? (
              <ActionButton
                onClick={handleNext}
                disabled={nextButtonDisabled}
                className="h-9 w-full flex-1">
                Next
              </ActionButton>
            ) : (
              <SubmitButton
                onClick={handleNext}
                disabled={nextButtonDisabled}
                className="h-9 w-full flex-1">
                Confirm vault changes
              </SubmitButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
