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
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader
} from '@/components/ui/table'
import { chainsIconUrl, aaSupportedChainIds } from '@/config/chain'
import { chainsNotSupportedByParticle, customChains } from '@/config/wagmi'
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
  return (
    <div
      className={cn(
        'scrollbar-none flex size-full flex-col items-center gap-y-12 overflow-y-auto overscroll-contain py-11',
        'pt-22'
      )}>
      <MintingPairsTable isOpenedVaults table={MyVaultsMintingPairsTable} />
      <MintingPairsTable table={AvailableMintingPairsTable} />
    </div>
  )
}

const ChainPairsTable: React.FC<{
  chainId?: number
  index: number
  table: TTable<IDetailedCollateral>
  isOpenedVaults?: boolean
}> = ({ chainId, index, table, isOpenedVaults }) => {
  const { availableCollaterals, openedCollaterals } = useCollaterals()
  const collaterals = isOpenedVaults ? openedCollaterals : availableCollaterals

  const chainCollerals = collaterals.find((c) => c.chainId === chainId)
  const hideHeaderChainName = useMemo(
    () => chainCollerals?.isSuccess && !chainCollerals?.collaterals.length,
    [chainCollerals?.collaterals.length, chainCollerals?.isSuccess]
  )

  const rows = useMemo(() => {
    if (!chainCollerals?.collaterals.length) {
      return null
    }

    return chainCollerals?.collaterals.map((collateral) => (
      <MintingPairTableRow
        key={collateral.collateralId}
        table={table}
        isOpened={collateral.isOpenVault}
        collateral={collateral}
      />
    ))
  }, [chainCollerals?.collaterals, table])

  return (
    <Table
      className={cn(
        'w-full overflow-hidden font-ibmr text-xs',
        index !== 0 && !isOpenedVaults && 'border-t border-white/10'
      )}>
      <TableHeader className="[&_tr]:mb-0">
        <TableRow className="border-none [&_th]:w-[120px] [&_th]:pb-3 [&_th]:font-normal">
          {(index !== 0
            ? table.filter((t) => t.key === 'pairName')
            : table
          ).map(({ key, title, message, titleClassName, formatTitle }) => (
            <TableHead key={key} className={titleClassName}>
              {title ||
                formatTitle?.(
                  hideHeaderChainName ? undefined : chainCollerals?.chain?.id
                )}{' '}
              <InfoIndicator message={message} />
            </TableHead>
          ))}
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {chainCollerals?.isFetching ? (
          <TableRow className="my-6">
            <TableCell
              width="100%"
              align="center"
              className="text-sm text-white/70">
              we are fetching more on-chain data...
            </TableCell>
          </TableRow>
        ) : chainCollerals?.isError ? (
          <TableRow className="my-6">
            <TableCell
              width="100%"
              align="center"
              className="text-sm text-white/70">
              {chainCollerals?.chain?.name} network is currently unreachable.
              All data will be accessible once connected.
            </TableCell>
          </TableRow>
        ) : (
          rows
        )}
      </TableBody>
    </Table>
  )
}

const MintingPairsTable: React.FC<{
  isOpenedVaults?: boolean
  table: TTable<IDetailedCollateral>
}> = ({ isOpenedVaults, table }) => {
  const { availableCollaterals, openedCollaterals } = useCollaterals()

  const collaterals = isOpenedVaults ? openedCollaterals : availableCollaterals

  return (
    <>
      {collaterals.length > 0 && (
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
              {collaterals.map((c, index) => (
                <ChainPairsTable
                  isOpenedVaults={isOpenedVaults}
                  key={c.chainId}
                  index={index}
                  table={table}
                  chainId={c.chainId}
                />
              ))}
              <RightAngleVaultIcon className="absolute bottom-1.5 left-1.5 text-grey9" />
              <RightAngleVaultIcon className="absolute bottom-1.5 right-1.5 -rotate-90 text-grey9" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const MintingPairTableRow: React.FC<{
  isOpened?: boolean
  collateral: IDetailedCollateral
  table: TTable<IDetailedCollateral>
}> = ({ collateral, table, isOpened }) => {
  const navigate = useNavigate()
  const { evmChainId, isConnected, isConnectedWithAA } = useUserInfo()
  const { switchChain } = useSwitchChain()

  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false)

  const enterButtonDisabled = useMemo(
    () =>
      isConnectedWithAA && !aaSupportedChainIds.includes(collateral.chainId),
    [collateral.chainId, isConnectedWithAA]
  )

  const handleEnterVault = () => {
    if (
      !enterButtonDisabled &&
      evmChainId &&
      isConnected &&
      collateral.chainId !== evmChainId
    ) {
      switchChain(
        { chainId: collateral.chainId },
        {
          onSuccess: (newChain) => {
            console.log('Switched to: ', newChain.id)
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
    !isOpened || !collateral?.healthFactor ? 0 : Number(collateral.healthFactor)

  const isInLiquidationRisk = useMemo(
    //TODO: confirm when to show this message
    () => isOpened && !!healthFactor && healthFactor < 120,
    [healthFactor, isOpened]
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
        hideParticle={chainsNotSupportedByParticle.includes(collateral.chainId)} //TODO: CHECKING FOR MAINNET WHEN IT'S AVAILABLE
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
          <ActionButton
            onClick={() => handleEnterVault()}
            disabled={enterButtonDisabled}>
            <span className="flex items-center gap-x-2">
              Enter
              {enterButtonDisabled ? (
                <InfoIndicator
                  message={`AA wallet is not currently supported on ${customChains.find(
                    (c) => c.id === collateral.chainId
                  )?.name}`}
                />
              ) : (
                <ArrowRightDoubleIcon />
              )}
            </span>
          </ActionButton>
        </TableCell>
      </TableRow>

      {isOpened && (
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
