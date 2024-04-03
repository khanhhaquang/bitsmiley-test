import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ArrowLeftDoubleIcon,
  BitCoinIcon,
  DollarIcon,
  OrIcon,
  VaultChangesBorderIcon
} from '@/assets/icons'
import { InfoIndicator } from '@/components/InfoIndicator'
import { useCollaterals } from '@/hooks/useCollaterals'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useManageVault } from '@/hooks/useManageVault'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useTokenPrice } from '@/hooks/useTokenPrice'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useVaultDetail } from '@/hooks/useVaultDetail'
import { TransactionStatus } from '@/types/common'
import {
  formartNumberAsCeil,
  formatNumberAsCompact,
  formatNumberWithSeparator
} from '@/utils/number'

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
import { VaultInfo } from '../components/VaultInfo'
import { VaultTitleBlue } from '../components/VaultTitle'
import { displayVaultValues } from '../display'

export const ManageVault: React.FC<{
  chainId: number
  collateralId: string
}> = ({ chainId, collateralId }) => {
  const navigate = useNavigate()
  const { blockExplorerUrl } = useUserInfo()
  const { collateral, refetch: refetchCollaterals } = useCollaterals(
    chainId,
    collateralId
  )

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
  } = useVaultDetail()

  const {
    wBtcAllowance,
    bitUsdAllowance,
    approvalTxnStatus,
    approvalVault,
    mintFromBtc,
    repayToBtc,
    mintFromBtcTxnStatus,
    repayToBtcTxnStatus,
    mintFromBtcTxId,
    repayToBtcTxId,
    setApprovalTxnStatus,
    setMintFromBtcTxnStatus,
    setRepayToBtcTxnStatus,
    txnErrorMsg,
    setTxnErrorMsg
  } = useManageVault()

  const contractAddress = useContractAddresses()
  const [isMintFromBtc, setIsMintFromBtc] = useState<boolean | undefined>()

  const [depositBtc, setDepositBtc] = useState('')
  const [mintBitUsd, setMintBitUsd] = useState('')
  const [withdrawBtc, setWithdrawBtc] = useState('')
  const [repayBitUsd, setRepayBitUsd] = useState('')

  const wbtcPrice = useTokenPrice()
  const { balance: wbtcBalance } = useTokenBalance(contractAddress?.WBTC)
  const { balance: bitUsdBalance } = useTokenBalance(contractAddress?.BitUSDL2)

  const depositInUsd = useMemo(() => {
    return (wbtcPrice * Number(depositBtc)).toFixed(2)
  }, [depositBtc, wbtcPrice])

  const minRepay = useMemo(() => {
    if (!repayBitUsd || !vault || !collateral) return 0

    const debt = Number(vault.debtBitUSD)
    const floor = Number(collateral?.collateral?.vaultMinDebt)
    const repay = Number(repayBitUsd)
    const remain = debt - repay

    if (remain >= floor) return 0
    return debt - floor
  }, [collateral, repayBitUsd, vault])

  const nextButtonDisabled = useMemo(() => {
    if (!maxVault || !vault || isMintFromBtc === undefined) return true

    const { availableToMint: maxToMint, availableToWithdraw: maxToWithdraw } =
      maxVault

    // mintAndDeposit
    if (isMintFromBtc === true) {
      // no input values
      if (!depositBtc && !mintBitUsd) return true
      // deposit > balance
      if (!!depositBtc && Number(depositBtc) > wbtcBalance) return true

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
    wbtcBalance,
    withdrawBtc
  ])

  const depositWBtcDisabled = useMemo(() => wbtcBalance <= 0, [wbtcBalance])
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
      setMaxVaultBitUsd('-' + value)
    }
  }

  const handleNext = () => {
    if (isNotApproved) {
      approvalVault(
        isMintFromBtc ? 'wBTC' : 'bitUSD',
        isMintFromBtc ? depositBtc : repayBitUsd
      )
      return
    }

    if (isMintFromBtc) {
      mintFromBtc(depositBtc, mintBitUsd)
    } else {
      repayToBtc(withdrawBtc, repayBitUsd, vault?.debtBitUSD)
    }
  }

  const liquidated = collateral?.liquidated?.[0]
  const [isLiquidatedWarningOpen, setIsLiquidatedWarningOpen] =
    useState(!!liquidated)

  const isApproving =
    approvalTxnStatus === TransactionStatus.Signing ||
    approvalTxnStatus === TransactionStatus.Processing

  const noInputValues =
    !depositBtc && !mintBitUsd && !withdrawBtc && !repayBitUsd
  const isNotApproved = isMintFromBtc
    ? !!depositBtc && wBtcAllowance < Number(depositBtc)
    : !!repayBitUsd && bitUsdAllowance < Number(repayBitUsd)

  const isTransactionStatusIdle = useMemo(() => {
    if (isMintFromBtc) return mintFromBtcTxnStatus === TransactionStatus.Idle
    return repayToBtcTxnStatus === TransactionStatus.Idle
  }, [isMintFromBtc, mintFromBtcTxnStatus, repayToBtcTxnStatus])

  const isTransactionStatusSigning = useMemo(() => {
    if (isApproving) return true
    if (isMintFromBtc) return mintFromBtcTxnStatus === TransactionStatus.Signing
    return repayToBtcTxnStatus === TransactionStatus.Signing
  }, [isApproving, isMintFromBtc, mintFromBtcTxnStatus, repayToBtcTxnStatus])

  const getProcessingTypeFromTxnStatus = useCallback(
    (status: TransactionStatus) => {
      switch (status) {
        case TransactionStatus.Success:
          return 'success'
        case TransactionStatus.Failed:
          return 'error'
        default:
          return 'info'
      }
    },
    []
  )

  const processingType = useMemo(
    () =>
      getProcessingTypeFromTxnStatus(
        isMintFromBtc ? mintFromBtcTxnStatus : repayToBtcTxnStatus
      ),
    [
      getProcessingTypeFromTxnStatus,
      isMintFromBtc,
      mintFromBtcTxnStatus,
      repayToBtcTxnStatus
    ]
  )

  const txnLink = useMemo(() => {
    if (!!blockExplorerUrl && isMintFromBtc && mintFromBtcTxId)
      return `${blockExplorerUrl}/tx/${mintFromBtcTxId}`
    if (!!blockExplorerUrl && !isMintFromBtc && repayToBtcTxId)
      return `${blockExplorerUrl}/tx/${repayToBtcTxId}`
    return ''
  }, [blockExplorerUrl, isMintFromBtc, mintFromBtcTxId, repayToBtcTxId])

  const processingMessage = useMemo(() => {
    switch (processingType) {
      case 'success':
        return 'Your vault change is completed.'
      case 'error':
        if (txnErrorMsg) return txnErrorMsg
        return 'The transaction has failed.'
      default:
        return 'Your transaction is getting processed on-chain.'
    }
  }, [processingType, txnErrorMsg])

  const processingModal = useMemo(() => {
    if (isTransactionStatusSigning)
      return <ProcessingModal message="Waiting for wallet signature" />

    if (!isTransactionStatusIdle)
      return (
        <ProcessingModal
          actionButtonClassName="w-[300px]"
          type={processingType}
          onClickActionButton={() => {
            refetchCollaterals()
            refreshVaultValues()
            if (processingType === 'error') {
              setApprovalTxnStatus(TransactionStatus.Idle)
              setMintFromBtcTxnStatus(TransactionStatus.Idle)
              setRepayToBtcTxnStatus(TransactionStatus.Idle)
              setTxnErrorMsg('')
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
    isTransactionStatusIdle,
    isTransactionStatusSigning,
    navigate,
    processingMessage,
    processingType,
    refetchCollaterals,
    refreshVaultValues,
    setApprovalTxnStatus,
    setMintFromBtcTxnStatus,
    setRepayToBtcTxnStatus,
    setTxnErrorMsg,
    txnLink
  ])

  const repayInputMessage = useMemo(() => {
    if (
      !!vault?.debtBitUSD &&
      !!vault?.fee &&
      !!repayBitUsd &&
      Number(repayBitUsd) < Number(vault?.fee)
    ) {
      return (
        <span className="text-warning">
          Min repay must exceed stability fee
        </span>
      )
    }

    if (!!repayBitUsd && Number(repayBitUsd) > Number(bitUsdBalance)) {
      return (
        <span className="text-white">
          *Available bitUSD doesn’t cover the debts
        </span>
      )
    }

    return null
  }, [bitUsdBalance, repayBitUsd, vault?.debtBitUSD, vault?.fee])

  useEffect(() => {
    if (withdrawBtc && !repayBitUsd && !!vault?.fee) {
      setRepayBitUsd(vault?.fee || '')
    }
  }, [repayBitUsd, vault?.fee, withdrawBtc])

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
      <ManageVaultHeaderInformation collateral={collateral} />

      <div className="mx-auto mt-10 flex w-[709px] flex-col">
        <LiquidatedWarning
          collateral={collateral}
          open={isLiquidatedWarningOpen}
          onClose={() => setIsLiquidatedWarningOpen(false)}
        />

        <ManageVaultInfoSection className="mb-12" vault={vault} />

        <div className="mb-6 grid grid-cols-2 gap-x-12">
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
              disabled={depositWBtcDisabled}
              title="deposit wbtc"
              inputSuffix={`~${depositInUsd}$`}
              titleSuffix={'Available: ' + formatNumberAsCompact(wbtcBalance)}
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
              title="withdraw wbtc"
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
              value={mintBitUsd}
              disabled={mintBitUsdDisabled}
              onFocus={() => setIsMintFromBtc(true)}
              onInputChange={(v) => handleInput('mintBitUsd', v)}
              greyOut={isMintFromBtc === false}
              title="mint bitUSD"
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
              value={repayBitUsd}
              disabled={repayBitUsdDisabled}
              message={repayInputMessage}
              onInputChange={(v) => handleInput('repayBitUsd', v)}
              onFocus={() => setIsMintFromBtc(false)}
              greyOut={isMintFromBtc === true}
              title="repay bitUSD"
              titleSuffix={
                'Available: ' + formatNumberWithSeparator(bitUsdBalance)
              }
              inputSuffix={
                <div className="flex items-center gap-x-2">
                  {!!minRepay && (
                    <InputSuffixActionButton
                      onClick={() => {
                        handleInput('repayBitUsd', minRepay.toString())
                        setIsMintFromBtc(false)
                      }}
                      disabled={repayBitUsdDisabled || isMintFromBtc === true}>
                      Min
                    </InputSuffixActionButton>
                  )}
                  <InputSuffixActionButton
                    disabled={repayBitUsdDisabled || isMintFromBtc === true}
                    className="w-[92px]"
                    onClick={() => {
                      handleInput(
                        'repayBitUsd',
                        formartNumberAsCeil(vault?.debtBitUSD || '') || ''
                      )
                      setIsMintFromBtc(false)
                    }}>
                    Repay all
                  </InputSuffixActionButton>
                </div>
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

        {isTransactionStatusIdle && (
          <div className="mx-auto mt-6 flex w-[451px] items-center gap-x-4">
            <ActionButton
              className="h-9 shrink-0 bg-white/5"
              onClick={() => navigate(-1)}>
              <span className="flex items-center gap-x-2 text-white/70">
                <ArrowLeftDoubleIcon />
                Back
              </span>
            </ActionButton>

            {isNotApproved || noInputValues ? (
              <ActionButton
                onClick={handleNext}
                disabled={nextButtonDisabled}
                className="h-9 w-full flex-1">
                {isNotApproved ? (
                  <span className="flex items-center justify-center gap-x-2">
                    Give permission to use {isMintFromBtc ? 'wBTC' : 'bitUSD'}{' '}
                    <InfoIndicator message="give permission" />
                  </span>
                ) : (
                  'Next'
                )}
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
