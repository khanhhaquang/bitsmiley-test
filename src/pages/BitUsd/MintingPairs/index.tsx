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
import { bobTestnet, botanixTestnet } from '@/config/wagmi'
import { useCollaterals } from '@/hooks/useCollaterals'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IDetailedCollateral } from '@/types/vault'
import { cn } from '@/utils/cn'

import { ActionButton } from '../components/ActionButton'
import { VaultTitleBlue, VaultTitleWhite } from '../components/VaultTitle'
import { displayCollateralValues, getHealthFactorTextColor } from '../display'
import {
  AvailableMintingPairsTable,
  MyVaultsMintingPairsTable,
  TTable
} from '../tables'

const MintingPairs: React.FC = () => {
  const {
    availableCollaterals,
    openedCollaterals,
    hasOpenedCollaterals,
    isLoading,
    isRefetching
  } = useCollaterals()

  return (
    <div
      className={cn(
        'scrollbar-none flex size-full flex-col items-center gap-y-12 overflow-y-auto overscroll-contain py-11',
        !hasOpenedCollaterals && 'pt-22'
      )}>
      {isLoading || isRefetching ? (
        <OnChainLoader />
      ) : (
        <>
          <MintingPairsTable
            isOpenedVaults
            collaterals={openedCollaterals}
            table={MyVaultsMintingPairsTable}
          />
          <MintingPairsTable
            collaterals={availableCollaterals}
            table={AvailableMintingPairsTable}
          />
        </>
      )}
    </div>
  )
}

const MintingPairsTable: React.FC<{
  isOpenedVaults?: boolean
  table: TTable<IDetailedCollateral>
  collaterals?: Record<string, IDetailedCollateral[]>
}> = ({ collaterals, isOpenedVaults, table }) => {
  const flatMintingPairs = Object.values(collaterals || {}).reduce(
    (pre, curr) => [...pre, ...curr],
    []
  )

  if (!collaterals || !flatMintingPairs.length) return null

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
          {Object.entries(collaterals).map(([chainId, pairs], index) => (
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
                {pairs.map((collateral, index) => (
                  <MintingPairTableRow
                    key={index}
                    table={table}
                    isOpenedVaults={isOpenedVaults}
                    collateral={collateral}
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
  collateral: IDetailedCollateral
  table: TTable<IDetailedCollateral>
}> = ({ collateral, table, isOpenedVaults }) => {
  const navigate = useNavigate()
  const { evmChainId, isConnected } = useUserInfo()
  const { switchChain } = useSwitchChain()

  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false)

  const handleEnterVault = () => {
    if (evmChainId && isConnected && collateral.chainId !== evmChainId) {
      switchChain(
        { chainId: collateral.chainId },
        {
          onSuccess: () => {
            navigate(`./vault/${collateral.chainId}/${collateral.collateralId}`)
          },
          onError: () => {
            console.error('Switching network failed')
          }
        }
      )
      return
    }

    if (collateral.chainId !== evmChainId) {
      setIsConnectWalletModalOpen(true)
      return
    }
    navigate(`./vault/${collateral.chainId}/${collateral.collateralId}`)
  }

  const liquidated = collateral.liquidated?.[0]
  const liquidatedDate = dayjs(liquidated?.timestamp).format('DD/MM/YYYY')

  const healthFactor =
    !isOpenedVaults || !collateral?.healthFactor
      ? 0
      : Number(collateral.healthFactor) * 10

  const isInLiquidationRisk = useMemo(
    // TODO confirm when to show this message
    () => isOpenedVaults && !!healthFactor && healthFactor < 200,
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
        expectedChainId={collateral.chainId}
        hideParticle={
          collateral.chainId === bobTestnet.id ||
          collateral.chainId === botanixTestnet.id
        } //TODO: CHECKING FOR MAINNET WHEN IT'S AVAILABLE
        isOpen={isConnectWalletModalOpen}
        onClose={() => setIsConnectWalletModalOpen(false)}
      />
      <TableRow className="py-3 [&_td]:w-[120px] [&_td]:p-0">
        {table.map(({ key, format, className }) => (
          <TableCell key={key} className={cn('text-nowrap', className)}>
            {format(collateral)}
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
            <Image src={chainsIconUrl[collateral.chainId]} width={15} />
            <span className="text-xs text-white/70">
              {displayCollateralValues(collateral).network}
            </span>
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
