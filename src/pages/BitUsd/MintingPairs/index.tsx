import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSwitchChain } from 'wagmi'

import {
  ArrowRightDoubleIcon,
  ReturnUpIcon,
  RightAngleVaultIcon
} from '@/assets/icons'
import { SelectWalletModal } from '@/components/ConnectWallet'
import { Image } from '@/components/Image'
import { InfoIndicator } from '@/components/InfoIndicator'
import { OnChainLoader } from '@/components/OnchainLoader'
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader
} from '@/components/ui/table'
import { chainsIconUrl } from '@/config/chain'
import { bobTestnet } from '@/config/wagmi'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserMintingPairs } from '@/hooks/useUserMintingPairs'
import { IMintingPair } from '@/services/user'
import { cn } from '@/utils/cn'

import { ActionButton } from '../components/ActionButton'
import { VaultTitleBlue, VaultTitleWhite } from '../components/VaultTitle'
import { getHealthFactorTextColor } from '../display'
import {
  AvailableMintingPairsTable,
  MyVaultsMintingPairsTable,
  TTable
} from '../tables'

const MintingPairs: React.FC = () => {
  const {
    availableMintingPairs,
    openedMintingPairs,
    hasOpenedMintingPairs,
    isLoading
  } = useUserMintingPairs()

  return (
    <div
      className={cn(
        'scrollbar-none flex size-full flex-col items-center gap-y-12 overflow-y-auto overscroll-contain py-11',
        !hasOpenedMintingPairs && 'pt-22'
      )}>
      {isLoading ? (
        <OnChainLoader />
      ) : (
        <>
          <MintingPairsTable
            isOpenedVaults
            mintingPairs={openedMintingPairs}
            table={MyVaultsMintingPairsTable}
          />
          <MintingPairsTable
            mintingPairs={availableMintingPairs}
            table={AvailableMintingPairsTable}
          />
        </>
      )}
    </div>
  )
}

const MintingPairsTable: React.FC<{
  isOpenedVaults?: boolean
  table: TTable<IMintingPair>
  mintingPairs?: Record<string, IMintingPair[]>
}> = ({ mintingPairs, isOpenedVaults, table }) => {
  const flatMintingPairs = Object.values(mintingPairs || {}).reduce(
    (pre, curr) => [...pre, ...curr],
    []
  )

  if (!mintingPairs || !flatMintingPairs.length) return null

  return (
    <div className="w-full">
      <div className="mb-6">
        {isOpenedVaults ? (
          <VaultTitleBlue>My Vaults</VaultTitleBlue>
        ) : (
          <VaultTitleWhite>Available minting pairs</VaultTitleWhite>
        )}
      </div>
      <div className="w-full px-5">
        <div className="relative w-full border border-white/20 px-7 pb-6 pt-4">
          {Object.entries(mintingPairs).map(([chainId, pairs], index) => (
            <Table
              key={index}
              className={cn(
                'w-full overflow-hidden font-ibmr text-xs',
                index !== 0 && !isOpenedVaults && 'border-t border-white/10'
              )}>
              <TableHeader className="[&_tr]:mb-0">
                <TableRow className="border-none [&_th]:w-[120px] [&_th]:pb-3 [&_th]:font-normal">
                  {(index !== 0
                    ? table.filter((t) => t.key === 'pairName')
                    : table
                  ).map(
                    ({ key, title, message, titleClassName, formatTitle }) => (
                      <TableHead key={key} className={titleClassName}>
                        {title || formatTitle?.(chainId)}{' '}
                        <InfoIndicator message={message} />
                      </TableHead>
                    )
                  )}
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pairs.map((mintingPair) => (
                  <MintingPairTableRow
                    table={table}
                    key={mintingPair.chainId}
                    isOpenedVaults={isOpenedVaults}
                    mintingPair={mintingPair}
                  />
                ))}
              </TableBody>
            </Table>
          ))}

          <RightAngleVaultIcon className="absolute bottom-1.5 left-1.5 text-grey9" />
          <RightAngleVaultIcon className="absolute bottom-1.5 right-1.5 -rotate-90 text-grey9" />
        </div>
      </div>
    </div>
  )
}

const MintingPairTableRow: React.FC<{
  isOpenedVaults?: boolean
  mintingPair: IMintingPair
  table: TTable<IMintingPair>
}> = ({ mintingPair, table, isOpenedVaults }) => {
  const navigate = useNavigate()
  const { evmChainId, isConnected } = useUserInfo()
  const { switchChain } = useSwitchChain()

  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false)

  const handleEnterVault = () => {
    if (evmChainId && isConnected && mintingPair.chainId !== evmChainId) {
      switchChain(
        { chainId: mintingPair.chainId },
        {
          onSuccess: () => {
            navigate(`./vault/${mintingPair.chainId}`)
          },
          onError: () => {
            console.error('Switching network failed')
          }
        }
      )
      return
    }

    if (mintingPair.chainId !== evmChainId) {
      setIsConnectWalletModalOpen(true)
      return
    }
    navigate(`./vault/${mintingPair.chainId}`)
  }

  const liquidated = mintingPair.liquidated?.[0]
  const liquidatedDate = dayjs(liquidated?.timestamp).format('DD/MM/YYYY')

  const healthFactor =
    !isOpenedVaults || !mintingPair?.healthFactor
      ? 0
      : Number(mintingPair.healthFactor) * 100

  const isInLiquidationRisk = useMemo(
    // TODO confirm when to show this message
    () => isOpenedVaults && !!healthFactor && healthFactor < 100,
    [healthFactor, isOpenedVaults]
  )

  const liquidationMessage = useMemo(() => {
    if (liquidated) return `This vault was liquidated on ${liquidatedDate}`
    if (isInLiquidationRisk)
      return 'This vault is at the risk of liquidation. Repay bitUSD or deposit wBTC to avoid liquidation'
    return ''
  }, [isInLiquidationRisk, liquidated, liquidatedDate])

  return (
    <>
      <SelectWalletModal
        expectedChainId={mintingPair.chainId}
        hideParticle={mintingPair.chainId === bobTestnet.id} //TODO: CHECKING FOR MAINNET WHEN IT'S AVAILABLE
        isOpen={isConnectWalletModalOpen}
        onClose={() => setIsConnectWalletModalOpen(false)}
      />
      <TableRow
        key={mintingPair.chainId}
        className="py-3 [&_td]:w-[120px] [&_td]:p-0">
        {table.map(({ key, format, className }) => (
          <TableCell key={key} className={cn('text-nowrap', className)}>
            {format(mintingPair)}
          </TableCell>
        ))}
        <TableCell className="flex w-[150px] items-center justify-end gap-x-2">
          <ActionButton onClick={() => handleEnterVault()}>
            <span className="flex items-center gap-x-2">
              Enter
              <ArrowRightDoubleIcon />
            </span>
          </ActionButton>
        </TableCell>
      </TableRow>

      {isOpenedVaults && (
        <TableRow className="-mt-4 justify-start gap-x-1 text-xs">
          <TableCell className="flex items-center gap-x-0.5">
            <Image src={chainsIconUrl[mintingPair.chainId]} width={15} />
            <span className="text-xs text-white/70">{mintingPair.network}</span>
          </TableCell>
          {liquidationMessage && (
            <TableCell
              className={cn(
                'font-ibmr text-xs',
                getHealthFactorTextColor(healthFactor),
                liquidated && 'text-warning'
              )}>
              <span className="flex items-center gap-x-1">
                <ReturnUpIcon />
                {liquidationMessage}
              </span>
            </TableCell>
          )}
        </TableRow>
      )}
    </>
  )
}

export default MintingPairs
