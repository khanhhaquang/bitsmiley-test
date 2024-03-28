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
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useManageVault } from '@/hooks/useManageVault'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useTokenPrice } from '@/hooks/useTokenPrice'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserMintingPairs } from '@/hooks/useUserMintingPairs'
import { useUserVault } from '@/hooks/useUserVault'
import { TransactionStatus } from '@/types/common'
import {
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
  chainId: string
  collateralId: string
}> = ({ chainId, collateralId }) => {
  const navigate = useNavigate()
  const { blockExplorerUrl } = useUserInfo()
  const { mintingPair, refetch: refetchMintingPairs } = useUserMintingPairs(
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
  } = useUserVault()

  const contractAddress = useContractAddresses()
  const [isMintFromBtc, setIsMintFromBtc] = useState<boolean | undefined>()

  const [depositBtc, setDepositBtc] = useState('')
  const [mintBitUsd, setMintBitUsd] = useState('')
  const [withdrawBtc, setWithdrawBtc] = useState('')
  const [repayBitUsd, setRepayBitUsd] = useState('')

  const wbtcPrice = useTokenPrice()
  const { balance: wbtcBalance } = useTokenBalance(contractAddress?.WBTC)
  const { balance: bitUsdBalance } = useTokenBalance(contractAddress?.BitUSDL2)

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
    repayToBtcTxId
  } = useManageVault()

  const depositInUsd = useMemo(() => {
    return (wbtcPrice * Number(depositBtc)).toFixed(2)
  }, [depositBtc, wbtcPrice])

  const minRepay = useMemo(() => {
    if (!repayBitUsd || !vault || !mintingPair) return 0

    const debt = Number(vault.debtBitUSD)
    const floor = Number(mintingPair?.collateral?.vaultMinDebt)
    const repay = Number(repayBitUsd)
    const remain = debt - repay

    if (remain >= floor) return 0
    return debt - floor
  }, [mintingPair, repayBitUsd, vault])

  const nextButtonDisabled = useMemo(() => {
    if (!maxVault || !vault || isMintFromBtc === undefined) return true

    const { availableToMint: maxToMint, availableToWithdraw: maxToWithdraw } =
      maxVault

    if (isMintFromBtc === true) {
      if (!depositBtc && !mintBitUsd) return true

      if (!!depositBtc && Number(depositBtc) > wbtcBalance) return true

      return Number(maxToMint) >= 0 && Number(mintBitUsd) > Number(maxToMint)
    }

    if (!withdrawBtc && !repayBitUsd) return true

    if (!!repayBitUsd && Number(repayBitUsd) > bitUsdBalance) return true

    if (Number(repayBitUsd) >= 0 && Number(minRepay) > Number(repayBitUsd))
      return true

    if (
      !!vault?.debtBitUSD &&
      !!vault?.fee &&
      !!repayBitUsd &&
      Number(repayBitUsd) < Number(vault?.fee)
    )
      return true

    return (
      Number(maxToWithdraw) >= 0 && Number(withdrawBtc) > Number(maxToWithdraw)
    )
  }, [
    bitUsdBalance,
    depositBtc,
    isMintFromBtc,
    maxVault,
    minRepay,
    mintBitUsd,
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
    () =>
      Number(maxVault?.availableToMint) <= 0 ||
      Number(maxVault?.availableToMint) <
        Number(mintingPair?.collateral.vaultMinDebt),
    [maxVault?.availableToMint, mintingPair?.collateral.vaultMinDebt]
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

  const liquidated = mintingPair?.liquidated?.[0]
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
        return 'The transaction has failed.'
      default:
        return 'Your transaction is getting processed on-chain.'
    }
  }, [processingType])

  const processingModal = useMemo(() => {
    if (isTransactionStatusSigning)
      return <ProcessingModal message="Waiting for wallet signature" />

    if (!isTransactionStatusIdle)
      return (
        <ProcessingModal
          actionButtonClassName="w-[300px]"
          type={processingType}
          onClickActionButton={async () => {
            await refetchMintingPairs()
            refreshVaultValues()
            navigate(-1)
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
    refetchMintingPairs,
    refreshVaultValues,
    txnLink
  ])

  const repayInputMessage = useMemo(() => {
    if (
      !!vault?.debtBitUSD &&
      !!vault?.fee &&
      !!repayBitUsd &&
      Number(repayBitUsd) < Number(vault?.fee)
    )
      return (
        <span className="text-warning">
          Min repay must exceed stability fee
        </span>
      )

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
    <div className="pb-12">
      {processingModal}
      <VaultTitleBlue>MANAGE VAULT</VaultTitleBlue>
      <ManageVaultHeaderInformation vault={vault} mintingPair={mintingPair} />

      <div className="mx-auto mt-10 flex w-[709px] flex-col">
        <LiquidatedWarning
          mintingPair={mintingPair}
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
              disabledMessage={`Max bitUSD you can mint doesn't reach vault floor: ${formatNumberAsCompact(
                mintingPair?.collateral.vaultMinDebt || ''
              )} bitUSD`}
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
                      handleInput('repayBitUsd', vault?.debtBitUSD || '')
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
            className="mx-auto aspect-[451/192] w-[451px]"
            innerClassName="gap-x-[70px] pl-7 text-white/70"
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
