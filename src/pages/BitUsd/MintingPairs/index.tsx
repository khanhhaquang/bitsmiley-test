import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSwitchChain } from 'wagmi'

import {
  ArrowDownDoubleIcon,
  ArrowRightDoubleIcon,
  ReturnUpIcon,
  RightAngleVaultIcon
} from '@/assets/icons'
import { SelectWalletModal } from '@/components/ConnectWallet'
import { InfoIndicator } from '@/components/InfoIndicator'
import { OnChainLoader } from '@/components/OnchainLoader'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader
} from '@/components/ui/table'
import { bobTestnet } from '@/config/wagmi'
import { useDisconnectAccount } from '@/hooks/useDisconnectAccount'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserMintingPairs } from '@/hooks/useUserMintingPairs'
import { IMintingPair } from '@/services/user'
import { cn } from '@/utils/cn'

import { ActionButton } from '../components/ActionButton'
import { VaultTitleBlue, VaultTitleWhite } from '../components/VaultTitle'
import { getHealthFactorTextColor } from '../display'
import {
  AvailableMintingPairsTable,
  MyVaultOverviewTable,
  MyVaultsMintingPairsTable,
  TTable
} from '../tables'

const MintingPairs: React.FC = () => {
  const { availableMintingPairs, openedMintingPairs, isLoading } =
    useUserMintingPairs()

  return (
    <div className="flex size-full flex-col items-center justify-center gap-y-12">
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
  mintingPairs?: IMintingPair[]
  table: TTable<IMintingPair>
  isOpenedVaults?: boolean
}> = ({ mintingPairs, isOpenedVaults, table }) => {
  if (!mintingPairs?.length) return null

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
        <div
          className={cn(
            'relative w-full border border-white/20 px-7 pb-6 pt-4',
            isOpenedVaults && 'border-blue/50'
          )}>
          <Table className="w-full overflow-hidden font-ibmr">
            <TableHeader className="border-b border-b-white/20 text-sm text-white/70 [&_tr]:mb-0">
              <TableRow className="border-none [&_th]:w-[120px] [&_th]:pb-3 [&_th]:font-normal">
                {table.map(({ key, title, message, titleClassName }) => (
                  <TableHead
                    key={key}
                    className={cn('text-nowrap', titleClassName)}>
                    {title} <InfoIndicator message={message} />
                  </TableHead>
                ))}
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mintingPairs.map((mintingPair) => (
                <MintingPairTableRow
                  table={table}
                  key={mintingPair.chainId}
                  isOpenedVaults={isOpenedVaults}
                  mintingPair={mintingPair}
                />
              ))}
            </TableBody>
          </Table>

          <RightAngleVaultIcon
            className={cn(
              'absolute bottom-1.5 left-1.5',
              isOpenedVaults ? 'text-blue' : 'text-grey9'
            )}
          />
          <RightAngleVaultIcon
            className={cn(
              'absolute bottom-1.5 right-1.5 -rotate-90',
              isOpenedVaults ? 'text-blue' : 'text-grey9'
            )}
          />
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
  const disconnect = useDisconnectAccount()
  const { evmChainId, isConnected } = useUserInfo()
  const { switchChain } = useSwitchChain()

  const [isOpen, setIsOpen] = useState(false)
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
            disconnect()
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
        {table.map(({ key, format }) => (
          <TableCell key={key} className="text-nowrap">
            {format(mintingPair)}
          </TableCell>
        ))}
        <TableCell className="flex w-[150px] items-center justify-end gap-x-2">
          <ActionButton onClick={() => handleEnterVault()}>
            <span className="flex items-center gap-x-2">
              {isOpenedVaults ? 'Manage' : 'Enter'}
              {(!isOpenedVaults || isInLiquidationRisk) && (
                <ArrowRightDoubleIcon />
              )}
            </span>
          </ActionButton>
          {!isInLiquidationRisk && isOpenedVaults && (
            <button className="group cursor-pointer hover:bg-white/10 active:bg-white/5">
              <ArrowDownDoubleIcon
                onClick={() => setIsOpen((v) => !v)}
                className={cn(
                  'text-white/70 group-hover:text-white group-active:text-white/70',
                  isOpen && 'rotate-180 transition-all'
                )}
              />
            </button>
          )}
        </TableCell>
      </TableRow>

      {liquidationMessage && (
        <TableRow className="-mt-1.5">
          <TableCell
            className={cn(
              'font-ibmr text-sm',
              getHealthFactorTextColor(healthFactor),
              liquidated && 'text-warning'
            )}>
            <span className="flex items-center gap-x-1">
              <ReturnUpIcon />
              {liquidationMessage}
            </span>
          </TableCell>
        </TableRow>
      )}

      {!isInLiquidationRisk && isOpenedVaults && (
        <TableRow className="mt-1 w-full">
          <TableCell className="w-full">
            <Collapsible className="w-full" open={isOpen} asChild>
              <CollapsibleContent>
                <div className="size-full border border-blue/50 bg-white/5 px-1.5 pb-1.5 pt-2 font-ibmb">
                  <div className="grid grid-cols-3 text-blue">
                    {MyVaultOverviewTable.map(({ key, title }) => (
                      <div
                        key={key}
                        className="border-r-2 border-blue px-2 pb-2 last:border-none">
                        {title}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 bg-blue text-black">
                    {MyVaultOverviewTable.map(({ key, format }) => (
                      <div
                        key={key}
                        className="border-r-2 border-black px-2 py-1 last:border-none">
                        {format(mintingPair)}
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

export default MintingPairs
