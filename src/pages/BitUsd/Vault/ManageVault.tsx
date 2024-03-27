import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ArrowLeftDoubleIcon,
  BitCoinIcon,
  CloseIcon,
  DollarIcon,
  ManageVaultInfoTitleIcon,
  ManageVaultSectionTitleIcon,
  OrIcon,
  VaultChangesBorderIcon,
  VaultInfoIcon
} from '@/assets/icons'
import { InfoIndicator } from '@/components/InfoIndicator'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useManageVault } from '@/hooks/useManageVault'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useTokenPrice } from '@/hooks/useTokenPrice'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserMintingPairs } from '@/hooks/useUserMintingPairs'
import { useUserVault } from '@/hooks/useUserVault'
import { IMintingPair } from '@/services/user'
import { TransactionStatus } from '@/types/common'
import { cn } from '@/utils/cn'
import {
  formatNumberAsCompact,
  formatNumberWithSeparator
} from '@/utils/number'

import {
  ActionButton,
  InputSuffixActionButton,
  SubmitButton
} from '../components/ActionButton'
import { NumberInput } from '../components/NumberInput'
import { ProcessingModal } from '../components/Processing'
import { RefreshButton } from '../components/RefreshButton'
import { VaultInfo } from '../components/VaultInfo'
import { VaultTitleBlue } from '../components/VaultTitle'
import { displayMintingPairValues, displayVaultValues } from '../display'
import {
  ManageVaultHeaderInfoTable,
  ManageVaultVaultInfoTable
} from '../tables'

export const ManageVault: React.FC<{ chainId: string }> = ({ chainId }) => {
  const navigate = useNavigate()
  const { blockExplorerUrl } = useUserInfo()
  const { mintingPair, refetch: refetchMintingPairs } =
    useUserMintingPairs(chainId)
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

  const isApproving =
    approvalTxnStatus === TransactionStatus.Signing ||
    approvalTxnStatus === TransactionStatus.Processing

  const isNotApproved = isMintFromBtc
    ? depositBtc && wBtcAllowance < Number(depositBtc)
    : repayBitUsd && bitUsdAllowance < Number(repayBitUsd)

  const isTransactionStatusIdle = useMemo(() => {
    if (isMintFromBtc) return mintFromBtcTxnStatus === TransactionStatus.Idle
    return repayToBtcTxnStatus === TransactionStatus.Idle
  }, [isMintFromBtc, mintFromBtcTxnStatus, repayToBtcTxnStatus])

  const isTransactionStatusSigning = useMemo(() => {
    if (isMintFromBtc) return mintFromBtcTxnStatus === TransactionStatus.Signing
    return repayToBtcTxnStatus === TransactionStatus.Signing
  }, [isMintFromBtc, mintFromBtcTxnStatus, repayToBtcTxnStatus])

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

  const depositInUsd = useMemo(() => {
    return (wbtcPrice * Number(depositBtc)).toFixed(2)
  }, [depositBtc, wbtcPrice])

  const minRepay = useMemo(() => {
    if (!repayBitUsd || !vault || !mintingPair) return 0

    const debt = Number(vault.debtBitUSD)
    const floor = Number(mintingPair.vaultFloor)
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
      Number(maxVault?.availableToMint) < Number(mintingPair?.vaultFloor),
    [maxVault?.availableToMint, mintingPair?.vaultFloor]
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
      repayToBtc(withdrawBtc, repayBitUsd)
    }
  }

  const liquidated = mintingPair?.liquidated?.[0]
  const [isLiquidatedWarningOpen, setIsLiquidatedWarningOpen] =
    useState(!!liquidated)

  const processingModal = useMemo(() => {
    if (isTransactionStatusSigning || isApproving)
      <ProcessingModal message="Waiting for wallet signature" />

    if (!isTransactionStatusIdle && !isTransactionStatusSigning)
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
    isApproving,
    isTransactionStatusIdle,
    isTransactionStatusSigning,
    navigate,
    processingMessage,
    processingType,
    refetchMintingPairs,
    refreshVaultValues,
    txnLink
  ])

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
      <ManageVaultHeaderInformation mintingPair={mintingPair} />

      <div className="mx-auto mt-10 flex w-[709px] flex-col">
        {!!liquidated && isLiquidatedWarningOpen && (
          <div className="mb-6 flex items-center justify-between border border-yellow bg-white/5 px-3 py-1.5 font-ibmr text-sm text-yellow">
            <span>
              This vault was liquidated at block height:{' '}
              {liquidated?.blockNumber}{' '}
              <span className="group cursor-pointer font-ibmb text-green">
                [
                <a
                  target="_blank"
                  href={`${blockExplorerUrl}/tx/${liquidated?.transactionHash}`}
                  className="group-hover:underline">
                  Check on-chain
                </a>
                ]
              </span>
            </span>
            <button
              className="cursor-pointer text-white hover:text-white/50"
              onClick={() => setIsLiquidatedWarningOpen(false)}>
              <CloseIcon width={10} height={10} />
            </button>
          </div>
        )}

        <VaultInfoSection className="mb-12" mintingPair={mintingPair} />

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
              disabledMessage={`Max bitUSD you can mint doesn't reach vault floor: ${
                displayMintingPairValues(mintingPair).vaultFloor
              } bitUSD`}
              titleSuffix={
                'Max Mint: ' +
                displayVaultValues(maxVault, false).availableToMint
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

            <SubmitButton
              onClick={handleNext}
              disabled={nextButtonDisabled}
              className="h-9 w-full flex-1">
              {isNotApproved
                ? `Give permission to use ${isMintFromBtc ? 'wBTC' : 'bitUSD'}`
                : 'Next'}
            </SubmitButton>
          </div>
        )}
      </div>
    </div>
  )
}

const VaultInfoSection: React.FC<{
  className?: string
  mintingPair?: IMintingPair
}> = ({ className, mintingPair }) => {
  return (
    <div className={cn('flex flex-col gap-y-6', className)}>
      <ManageVaultSectionTitle
        type="info"
        title="Vault"
        subTitle="info"
        icon={<VaultInfoIcon width={27} height={29} />}
      />

      <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
        {ManageVaultVaultInfoTable.map(({ key, title, format }, index) => (
          <div
            key={key}
            className={cn(
              'flex items-center border-t border-white/20 p-[1px] font-ibmr text-sm text-white/70',
              (index === ManageVaultVaultInfoTable.length - 1 ||
                index === ManageVaultVaultInfoTable.length - 2) &&
                'border-b'
            )}>
            <div className="h-6 w-[200px] border-r border-white/20 bg-white/5 px-1">
              {title}
            </div>
            <div className="py-1 pl-2 pr-1 font-bold text-white">
              {format(mintingPair)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ManageVaultSectionTitle: React.FC<{
  type?: 'info' | 'manage'
  icon: React.ReactNode
  title: string
  subTitle: string
  className?: string
}> = ({ type = 'manage', icon, title, subTitle, className }) => {
  return (
    <div className={cn('flex items-center gap-x-2 text-white', className)}>
      <div className="flex shrink-0 items-center gap-x-2 font-smb text-xs">
        {icon}
        <div>
          <div>{title}</div>
          <div>{subTitle}</div>
        </div>
      </div>
      <div className="relative w-full">
        {type === 'info' ? (
          <>
            <ManageVaultInfoTitleIcon className="w-full flex-1" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5">
              <RefreshButton />
            </div>
          </>
        ) : (
          <ManageVaultSectionTitleIcon className="w-full flex-1" />
        )}
      </div>
    </div>
  )
}

const ManageVaultHeaderInformation: React.FC<{
  mintingPair?: IMintingPair
}> = ({ mintingPair }) => {
  const navigate = useNavigate()

  return (
    <div className="mt-6 flex items-center justify-center gap-x-9 font-ibmr text-sm text-white/70">
      <button
        onClick={() => navigate(-1)}
        className="flex cursor-pointer items-center justify-center gap-x-1 font-ibmb text-sm hover:text-white active:text-white/50">
        <ArrowLeftDoubleIcon width={13} height={10} />
        Back
      </button>

      {ManageVaultHeaderInfoTable.map(({ key, title, message, format }) => (
        <div key={key} className="flex items-center gap-x-1">
          <span>
            {title} <InfoIndicator message={message} />:
          </span>
          <span>{format(mintingPair)}</span>
        </div>
      ))}
    </div>
  )
}
