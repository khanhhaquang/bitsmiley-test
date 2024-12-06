import { useMemo } from 'react'

import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { chainsTitle } from '@/config/chain'
import { useSuiCollaterals } from '@/hooks/useSuiCollaterals'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IDetailedSuiCollateral } from '@/types/sui'

import SuiMintingPairTableRow from './SuiMintingPairTableRow'

import { TTable } from '../../tables'

const SuiPairsTable: React.FC<{
  table: TTable<IDetailedSuiCollateral>
  isOpenedVaults?: boolean
}> = ({ table, isOpenedVaults }) => {
  const { isSuiConnected, suiChainIdAsNumber } = useUserInfo()
  const { isFetching, availableCollaterals, openedCollaterals, isError } =
    useSuiCollaterals()

  const collaterals = isOpenedVaults ? openedCollaterals : availableCollaterals

  const rows = useMemo(() => {
    if (!collaterals.length) {
      return (
        <TableRow className="my-6">
          <TableCell
            width="100%"
            align="center"
            className="text-sm text-white/70">
            no available minting pairs
          </TableCell>
        </TableRow>
      )
    }

    return collaterals.map((collateral) => (
      <SuiMintingPairTableRow
        key={collateral.collateralId}
        table={table}
        isOpened={collateral.isOpenVault}
        collateral={collateral}
      />
    ))
  }, [collaterals, table])

  return (
    <>
      <TableBody>
        {!isSuiConnected ? (
          <TableRow className="my-6">
            <TableCell
              width="100%"
              align="center"
              className="text-sm text-white/70">
              Connect wallet first
            </TableCell>
          </TableRow>
        ) : isFetching ? (
          <TableRow className="my-6">
            <TableCell
              width="100%"
              align="center"
              className="text-sm text-white/70">
              we are fetching more on-chain data...
            </TableCell>
          </TableRow>
        ) : isError ? (
          <TableRow className="my-6">
            <TableCell
              width="100%"
              align="center"
              className="text-sm text-white/70">
              {chainsTitle[`${suiChainIdAsNumber}`]} network is currently
              unreachable. All data will be accessible once connected.
            </TableCell>
          </TableRow>
        ) : (
          rows
        )}
      </TableBody>
    </>
  )
}

export default SuiPairsTable
