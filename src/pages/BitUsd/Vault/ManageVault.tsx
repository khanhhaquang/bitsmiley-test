import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  BitCoinIcon,
  ChevronLeftIcon,
  ManageVaultSectionTitleIcon,
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
import { IMintingPair } from '@/services/user'
import { TransactionStatus } from '@/types/common'
import { formatNumberAsCompact } from '@/utils/number'

import {
  ActionButton,
  InputSuffixActionButton
} from '../components/ActionButton'
import { NumberInput } from '../components/NumberInput'
import { Processing, ProcessingModal } from '../components/Processing'
import { VaultInfo } from '../components/VaultInfo'
import { VaultTitleBlue } from '../components/VaultTitle'
import { displayMintingPairValues, displayVaultValues } from '../display'

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
    refetchVault,
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
        return 'The transaction is getting processed.'
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
      return (
        (!depositBtc && !mintBitUsd) ||
        (Number(maxToMint) >= 0 && Number(mintBitUsd) > Number(maxToMint))
      )
    }

    if (!!repayBitUsd && Number(repayBitUsd) > bitUsdBalance) return true

    if (
      !!repayBitUsd &&
      !!(Number(vault.debtBitUSD) - Number(repayBitUsd)) &&
      Number(vault.debtBitUSD) - Number(repayBitUsd) <
        Number(mintingPair?.vaultFloor)
    ) {
      return true
    }

    return (
      (!withdrawBtc && !repayBitUsd) ||
      (Number(maxToWithdraw) >= 0 &&
        Number(withdrawBtc) > Number(maxToWithdraw))
    )
  }, [
    bitUsdBalance,
    depositBtc,
    isMintFromBtc,
    maxVault,
    mintBitUsd,
    mintingPair?.vaultFloor,
    repayBitUsd,
    vault,
    withdrawBtc
  ])

  const withdrawWbtcDisabled = useMemo(
    () => Number(maxVault?.availableToWithdraw) <= 0,
    [maxVault?.availableToWithdraw]
  )
  const mintBitUsdDisabled = useMemo(
    () => Number(maxVault?.availableToMint) <= 0,
    [maxVault?.availableToMint]
  )
  const repayBitUsdDisabled = useMemo(
    () => Number(vault?.debtBitUSD) <= 0,
    [vault?.debtBitUSD]
  )

  const depositWbtcGreyOut = useMemo(
    () => isMintFromBtc === false,
    [isMintFromBtc]
  )
  const withdrawWbtcGreyOut = useMemo(
    () => isMintFromBtc === true || withdrawWbtcDisabled,
    [isMintFromBtc, withdrawWbtcDisabled]
  )
  const mintBitUsdGreyOut = useMemo(
    () => isMintFromBtc === false || mintBitUsdDisabled,
    [isMintFromBtc, mintBitUsdDisabled]
  )
  const repayBitUsdGreyOut = useMemo(
    () => isMintFromBtc === true || repayBitUsdDisabled,
    [isMintFromBtc, repayBitUsdDisabled]
  )

  const handleInput = (
    type: 'depositBtc' | 'withdrawBtc' | 'mintBitUsd' | 'repayBitUsd',
    value: string
  ) => {
    if (type === 'depositBtc') {
      setDepositBtc(value)
      setWithdrawBtc('')
      setRepayBitUsd('')
      setChangedCollateral(value)
      setChangedBitUsd(mintBitUsd)

      setMaxVaultBitUsd('')
      setMaxVaultCollateral(value)
    }

    if (type === 'withdrawBtc') {
      setWithdrawBtc(value)
      setDepositBtc('')
      setMintBitUsd('')
      setChangedCollateral('-' + value)
      setChangedBitUsd('-' + repayBitUsd)
    }

    if (type === 'mintBitUsd') {
      setMintBitUsd(value)
      setWithdrawBtc('')
      setRepayBitUsd('')
      setChangedCollateral(depositBtc)
      setChangedBitUsd(value)
    }

    if (type === 'repayBitUsd') {
      setRepayBitUsd(value)
      setDepositBtc('')
      setMintBitUsd('')
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

  if (!mintingPair || !vault) return null

  return (
    <div className="pb-12">
      <ProcessingModal
        message="Waiting for wallet signature"
        open={isTransactionStatusSigning}
      />

      <VaultTitleBlue>MANAGE VAULT</VaultTitleBlue>
      <ManageVaultHeaderInformation mintingPair={mintingPair} />

      {isApproving ? (
        <div className="mx-auto mt-40 flex w-[400px]">
          <Processing message="Waiting for approval from wallet" />
        </div>
      ) : (
        <div className="mx-auto mt-10 flex w-[652px] flex-col gap-y-6">
          {isTransactionStatusIdle ? (
            <>
              <div className="flex flex-col gap-y-3">
                <ManageVaultSectionTitle title="BTC" />
                <div className="grid grid-cols-2 gap-x-3">
                  <NumberInput
                    value={depositBtc}
                    onFocus={() => setIsMintFromBtc(true)}
                    onChange={(e) => handleInput('depositBtc', e.target.value)}
                    greyOut={depositWbtcGreyOut}
                    title="deposit wbtc"
                    inputSuffix={`~${depositInUsd}$`}
                    titleSuffix={
                      'Available: ' + formatNumberAsCompact(wbtcBalance)
                    }
                  />
                  <NumberInput
                    value={withdrawBtc}
                    onFocus={() => setIsMintFromBtc(false)}
                    onChange={(e) => handleInput('withdrawBtc', e.target.value)}
                    disabled={withdrawWbtcDisabled}
                    greyOut={withdrawWbtcGreyOut}
                    title="withdraw wbtc"
                    titleSuffix={
                      <span className="flex items-center gap-x-2">
                        Max: $
                        {
                          displayVaultValues(maxVault, false)
                            .availableToWithdraw
                        }
                        <InfoIndicator message="123" />
                      </span>
                    }
                    inputSuffix={
                      <InputSuffixActionButton
                        disabled={withdrawWbtcDisabled}
                        onClick={() =>
                          handleInput(
                            'withdrawBtc',
                            maxVault?.availableToWithdraw || ''
                          )
                        }>
                        Max
                      </InputSuffixActionButton>
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-y-3">
                <ManageVaultSectionTitle title="bitUSD" />
                <div className="grid grid-cols-2 gap-x-3">
                  <NumberInput
                    value={mintBitUsd}
                    disabled={mintBitUsdDisabled}
                    onFocus={() => setIsMintFromBtc(true)}
                    onChange={(e) => handleInput('mintBitUsd', e.target.value)}
                    greyOut={mintBitUsdGreyOut}
                    title="mint bitUSD"
                    titleSuffix={
                      'Max: ' + displayVaultValues(maxVault).availableToMint
                    }
                    inputSuffix={
                      <InputSuffixActionButton
                        disabled={mintBitUsdDisabled}
                        onClick={() =>
                          handleInput(
                            'mintBitUsd',
                            maxVault?.availableToMint || ''
                          )
                        }>
                        Max
                      </InputSuffixActionButton>
                    }
                  />
                  <NumberInput
                    value={repayBitUsd}
                    onFocus={() => setIsMintFromBtc(false)}
                    disabled={repayBitUsdDisabled}
                    onChange={(e) => handleInput('repayBitUsd', e.target.value)}
                    greyOut={repayBitUsdGreyOut}
                    title="repay bitUSD"
                    titleSuffix={
                      'Available: ' + formatNumberAsCompact(bitUsdBalance)
                    }
                    inputSuffix={
                      <div className="flex items-center gap-x-2">
                        {!!minRepay && (
                          <InputSuffixActionButton
                            onClick={() =>
                              handleInput('repayBitUsd', minRepay.toString())
                            }
                            disabled={repayBitUsdDisabled}>
                            Min
                          </InputSuffixActionButton>
                        )}
                        <InputSuffixActionButton
                          disabled={repayBitUsdDisabled}
                          className="w-[92px]"
                          onClick={() =>
                            handleInput('repayBitUsd', vault?.debtBitUSD || '')
                          }>
                          Repay all
                        </InputSuffixActionButton>
                      </div>
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <Processing
              actionButtonClassName="w-[300px]"
              type={processingType}
              onClickActionButton={async () => {
                await refetchVault()
                await refetchMintingPairs()
                navigate(-1)
              }}
              actionButtonText={processingType !== 'info' ? 'Ok' : ''}
              message={processingMessage}
              link={txnLink}
            />
          )}

          <VaultInfo
            type="changes"
            vault={vault}
            changedVault={changedVault}
            hasChangedVault={hasChangedVault}
            className="aspect-[652/196]"
            innerClassName="gap-x-20"
            borderSvg={
              <VaultChangesBorderIcon className="absolute inset-0 z-0 w-full" />
            }
          />

          {isTransactionStatusIdle && (
            <div className="flex w-full items-center gap-x-4">
              <ActionButton
                className="h-9 shrink-0"
                onClick={() => navigate(-1)}>
                <span className="flex items-center gap-x-2">
                  <ChevronLeftIcon />
                  Back
                </span>
              </ActionButton>

              <ActionButton
                onClick={handleNext}
                disabled={nextButtonDisabled}
                className="h-9 w-full flex-1">
                {isNotApproved
                  ? `Give permission to use ${
                      isMintFromBtc ? 'wBTC' : 'bitUSD'
                    }`
                  : 'Next'}
              </ActionButton>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const ManageVaultSectionTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex items-center gap-x-2">
      <BitCoinIcon />
      <div className="font-smb text-xs text-blue">
        <div>MANAGE</div>
        <div>{title}</div>
      </div>
      <ManageVaultSectionTitleIcon />
    </div>
  )
}

const ManageVaultHeaderInformation: React.FC<{ mintingPair: IMintingPair }> = ({
  mintingPair
}) => {
  return (
    <div className="mt-6 flex items-center justify-center gap-x-9 font-ibmr text-sm text-white/70">
      <div>
        <span>Network: </span>
        <span>{displayMintingPairValues(mintingPair).network}</span>
      </div>
      <div>
        <span>
          Stability Fee{' '}
          <InfoIndicator message="The annual stability fee for the bitusd minted" />
          :{' '}
        </span>
        <span>{displayMintingPairValues(mintingPair).borrowRate}</span>
      </div>
      <div>
        <span>
          Liquidation Penalty{' '}
          <InfoIndicator message="Fee charged for liquidators" />:{' '}
        </span>
        <span>{displayMintingPairValues(mintingPair).liquidationPenalty}</span>
      </div>
    </div>
  )
}
