import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ChevronLeftIcon, VaultInfoBorderIcon } from '@/assets/icons'
import { commonParam } from '@/config/settings'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useManageVault } from '@/hooks/useManageVault'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useTokenPrice } from '@/hooks/useTokenPrice'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserMintingPairs } from '@/hooks/useUserMintingPairs'
import { useUserVault } from '@/hooks/useUserVault'
import { TransactionStatus } from '@/types/common'
import { IVault } from '@/types/vault'
import { formatNumberAsCompact } from '@/utils/number'

import {
  ActionButton,
  InputSuffixActionButton
} from '../components/ActionButton'
import { NumberInput } from '../components/NumberInput'
import { Processing, ProcessingModal } from '../components/Processing'
import { VaultInfo } from '../components/VaultInfo'
import { VaultTitleBlue } from '../components/VaultTitle'
import { displayMintingPairValues, formatBitUsd } from '../display'

export const OpenVault: React.FC<{ chainId: string }> = ({ chainId }) => {
  const navigate = useNavigate()
  const { mintingPair, refetch: refetchMintingPairs } =
    useUserMintingPairs(chainId)
  const { refetchVaultAddress } = useUserVault()
  const { blockExplorerUrl } = useUserInfo()
  const contractAddresses = useContractAddresses()
  const { balance: wbtcBalance } = useTokenBalance(contractAddresses?.WBTC)
  const wbtcPrice = useTokenPrice()

  const [mint, setMint] = useState('')
  const [deposit, setDeposit] = useState('')

  const {
    openVault,
    openVaultTxId,
    openVaultTxnStatus,
    setOpenVaultTxnStatus,
    approvalVault,
    approvalTxnStatus,
    wBtcAllowance
  } = useManageVault()

  const isApproving =
    approvalTxnStatus === TransactionStatus.Signing ||
    approvalTxnStatus === TransactionStatus.Processing
  const isApproved = Number(wBtcAllowance) >= Number(deposit)

  const maxMint = useMemo(
    () =>
      !deposit
        ? Number(mintingPair?.vaultCeiling)
        : Math.min(
            Number(mintingPair?.vaultCeiling),
            Number(deposit) *
              wbtcPrice *
              (Number(commonParam.safeRate) / 10 ** 9)
          ),
    [deposit, mintingPair?.vaultCeiling, wbtcPrice]
  )

  const isNextButtonDisabled = useMemo(() => {
    if (!deposit) return true

    if (Number(deposit) > wbtcBalance) return true
    if (mint && Number(mint) > Number(maxMint)) return true
    if (mint && Number(mint) < Number(mintingPair?.vaultFloor)) return true
    return false
  }, [deposit, maxMint, mint, mintingPair?.vaultFloor, wbtcBalance])

  const depositDisabled = useMemo(() => {
    if (wbtcBalance <= 0) return true
  }, [wbtcBalance])

  const mintDisabled = useMemo(() => {
    return (
      !!mintingPair?.vaultFloor &&
      Number(maxMint) < Number(mintingPair?.vaultFloor)
    )
  }, [maxMint, mintingPair?.vaultFloor])

  const handleNext = () => {
    if (!isApproved) {
      approvalVault('wBTC', deposit)
    } else {
      openVault(deposit, mint)
    }
  }

  const handleInput = (value?: string, callback?: (v: string) => void) => {
    callback?.(value || '')
  }

  const depositInUsd = useMemo(() => {
    return (wbtcPrice * Number(deposit)).toFixed(2)
  }, [deposit, wbtcPrice])

  const vaultInfo: IVault = useMemo(
    () => ({
      debtBitUSD: mint,
      lockedCollateral: deposit,
      healthFactor: !mint
        ? ''
        : (
            ((wbtcPrice * Number(deposit) * 0.75) / Number(mint)) *
            100
          ).toString()
    }),
    [deposit, mint, wbtcPrice]
  )

  useEffect(() => {
    if (mintDisabled) setMint('')
  }, [mintDisabled])

  return (
    <div className="pb-12">
      <ProcessingModal
        message="Waiting for wallet signature"
        open={openVaultTxnStatus === TransactionStatus.Signing}
      />
      <ProcessingModal
        open={openVaultTxnStatus === TransactionStatus.Processing}
        message="Your transaction is getting processed."
        link={
          !!blockExplorerUrl && !!openVaultTxId
            ? `${blockExplorerUrl}/tx/${openVaultTxId}`
            : ''
        }
      />
      <ProcessingModal
        type="success"
        actionButtonText="Ok"
        open={openVaultTxnStatus === TransactionStatus.Success}
        onClickActionButton={async () => {
          await refetchVaultAddress()
          await refetchMintingPairs()
          navigate(-1)
        }}
        message="You have successfully created a vault. Now you can see it in the
        Testnet main page"
      />
      <ProcessingModal
        type="error"
        actionButtonText="Ok"
        onClickActionButton={() =>
          setOpenVaultTxnStatus(TransactionStatus.Idle)
        }
        open={openVaultTxnStatus === TransactionStatus.Failed}
        message={
          !blockExplorerUrl || !openVaultTxId ? (
            <span>This transaction has failed.</span>
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

      <VaultTitleBlue>OPEN A VAULT</VaultTitleBlue>

      {isApproving ? (
        <div className="mx-auto mt-40 flex w-[400px]">
          <Processing message="Waiting for approval from wallet" />
        </div>
      ) : (
        <div className="mx-auto mt-11 flex w-[400px] flex-col gap-y-4">
          <NumberInput
            value={deposit}
            onInputChange={(v) => handleInput(v, setDeposit)}
            greyOut={depositDisabled}
            disabled={depositDisabled}
            title="DEPOSIT WBTC"
            titleSuffix={`Balance: ${formatNumberAsCompact(wbtcBalance)}`}
            inputSuffix={
              <div className="flex h-full items-center gap-x-1.5 py-1">
                {'~' + depositInUsd + '$'}
              </div>
            }
          />
          <NumberInput
            value={mint}
            onInputChange={(v) => handleInput(v, setMint)}
            disabled={mintDisabled}
            greyOut={mintDisabled}
            disabledMessage={`Max bitUSD you can mint doesn't reach vault floor: ${
              displayMintingPairValues(mintingPair).vaultFloor
            } bitUSD`}
            title="Mint bitUSD"
            titleSuffix={`Max Mint: ${formatBitUsd(maxMint, false, true)}`}
            inputSuffix={
              <InputSuffixActionButton
                onClick={() => setMint(maxMint.toString() || '')}>
                Max
              </InputSuffixActionButton>
            }
          />
          <VaultInfo
            vault={vaultInfo}
            mintingPairs={mintingPair}
            borderSvg={
              <VaultInfoBorderIcon className="absolute inset-0 z-0 w-full" />
            }
          />
          <div className="flex w-full items-center gap-x-4">
            <ActionButton className="h-9 shrink-0" onClick={() => navigate(-1)}>
              <span className="flex items-center gap-x-2">
                <ChevronLeftIcon />
                Back
              </span>
            </ActionButton>

            <ActionButton
              onClick={handleNext}
              className="h-9 w-full flex-1"
              disabled={isNextButtonDisabled}>
              {isApproved ? 'Next' : 'Give permission to use BTC'}
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  )
}
