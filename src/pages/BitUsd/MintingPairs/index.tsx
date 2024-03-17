import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ArrowDownDoubleIcon,
  ArrowRightDoubleIcon,
  ReturnUpIcon,
  RightAngleVaultIcon
} from '@/assets/icons'
import { InfoIndicator } from '@/components/InfoIndicator'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader
} from '@/components/ui/table'
import { useUserMintingPairs } from '@/hooks/useUserMintingPairs'
import { useUserVault } from '@/hooks/useUserVault'
import { IMintingPair } from '@/services/user'
import { cn } from '@/utils/cn'

import { ActionButton } from '../components/ActionButton'
import { VaultTitleBlue, VaultTitleWhite } from '../components/VaultTitle'
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
        <div>loading..</div>
      ) : (
        <>
          <MintingPairsTable
            isOpened
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
  isOpened?: boolean
}> = ({ mintingPairs, isOpened, table }) => {
  if (!mintingPairs?.length) return null

  return (
    <div className="w-full">
      <div className="mb-6">
        {isOpened ? (
          <VaultTitleBlue>My Vaults</VaultTitleBlue>
        ) : (
          <VaultTitleWhite>Available minting pairs</VaultTitleWhite>
        )}
      </div>
      <div className="w-full px-5">
        <div
          className={cn(
            'relative w-full border border-white/20 px-7 pb-6 pt-4',
            isOpened && 'border-blue/50'
          )}>
          <Table className="w-full overflow-hidden font-ibmr">
            <TableHeader className="border-b border-b-white/20 text-sm text-white/70 [&_tr]:mb-0">
              <TableRow className="border-none [&_th]:w-[120px] [&_th]:pb-3 [&_th]:font-normal">
                {table.map(({ key, title, message }) => (
                  <TableHead key={key} className="text-nowrap">
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
                  isOpenedVaults={isOpened}
                  mintingPair={mintingPair}
                />
              ))}
            </TableBody>
          </Table>

          <RightAngleVaultIcon
            className={cn(
              'absolute bottom-1.5 left-1.5',
              isOpened ? 'text-blue' : 'text-grey9'
            )}
          />
          <RightAngleVaultIcon
            className={cn(
              'absolute bottom-1.5 right-1.5 -rotate-90',
              isOpened ? 'text-blue' : 'text-grey9'
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
  const [isOpen, setIsOpen] = useState(false)
  const { vault } = useUserVault()

  const isInLiquidation =
    isOpenedVaults && !!vault?.healthFactor && Number(vault.healthFactor) <= 100

  return (
    <>
      <TableRow
        key={mintingPair.chainId}
        className="py-3 [&_td]:w-[120px] [&_td]:p-0">
        {table.map(({ key, format }) => (
          <TableCell key={key} className="text-nowrap">
            {format(mintingPair)}
          </TableCell>
        ))}
        <TableCell className="flex w-[150px] items-center justify-end">
          <ActionButton
            onClick={() => navigate(`./vault/${mintingPair.chainId}`)}>
            <span className="flex items-center gap-x-2">
              {isOpenedVaults ? 'Manage' : 'Enter'}
              {(!isOpenedVaults || isInLiquidation) && <ArrowRightDoubleIcon />}
            </span>
          </ActionButton>
          {!isInLiquidation && isOpenedVaults && (
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

      {isInLiquidation && (
        <TableRow className="-mt-1.5">
          <TableCell className="font-ibmr text-sm text-warning">
            <span className="flex items-center gap-x-1">
              <ReturnUpIcon />
              This wallet is in the process of liquidation! Repay bitUSD or
              deposit BTC to avoid liquidation
            </span>
          </TableCell>
        </TableRow>
      )}

      {!isInLiquidation && isOpenedVaults && (
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
                        {format(vault)}
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
