import { useMemo, useState } from 'react'
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
import { displayMintingPairValues } from '../display'

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

  const minDeposit = !wbtcPrice
    ? 0
    : (Number(mint) / (wbtcPrice * (Number(commonParam.safeRate) / 10 ** 9))) *
      1.001

  const isNextButtonDisabled = useMemo(() => {
    if (!deposit) return true
    if (mint && deposit && Number(deposit) < minDeposit) return true
    if (mint && Number(mint) > Number(mintingPair?.vaultCeiling)) return true
    if (mint && Number(mint) < Number(mintingPair?.vaultFloor)) return true
    if (isApproved && Number(deposit) > wbtcBalance) return true
    return false
  }, [
    deposit,
    isApproved,
    minDeposit,
    mint,
    mintingPair?.vaultCeiling,
    mintingPair?.vaultFloor,
    wbtcBalance
  ])

  const handleNext = () => {
    if (!isApproved) {
      approvalVault('wBTC', deposit)
    } else {
      openVault(deposit, mint)
    }
  }

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (v: string) => void
  ) => {
    callback(e.target.value)
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
            (wbtcPrice * Number(deposit) * Number(mintingPair?.maxLTV)) /
            Number(mint)
          ).toString()
    }),
    [deposit, mint, mintingPair, wbtcPrice]
  )

  if (!mintingPair) return null

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
            onChange={(e) => handleInput(e, setDeposit)}
            title="DEPOSIT WBTC"
            titleSuffix={
              minDeposit
                ? `Min: ${formatNumberAsCompact(
                    minDeposit
                  )}, Balance: ${formatNumberAsCompact(wbtcBalance)}`
                : `Balance: ${formatNumberAsCompact(wbtcBalance)}`
            }
            inputSuffix={
              <div className="flex h-full items-center gap-x-1.5 py-1">
                {'~' + depositInUsd + '$'}
                {!!minDeposit && (
                  <InputSuffixActionButton
                    onClick={() => setDeposit(minDeposit.toString())}>
                    Min
                  </InputSuffixActionButton>
                )}
              </div>
            }
          />
          <NumberInput
            value={mint}
            onChange={(e) => handleInput(e, setMint)}
            title="Mint bitUSD"
            titleSuffix={`Min: ${
              displayMintingPairValues(mintingPair, false).vaultFloor
            }, Max: ${
              displayMintingPairValues(mintingPair, false).vaultCeiling
            }`}
            inputSuffix={
              <div className="flex h-full gap-x-1.5 py-1">
                <InputSuffixActionButton
                  onClick={() => setMint(mintingPair.vaultFloor || '')}>
                  Min
                </InputSuffixActionButton>
                <InputSuffixActionButton
                  onClick={() => setMint(mintingPair.vaultCeiling || '')}>
                  Max
                </InputSuffixActionButton>
              </div>
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
