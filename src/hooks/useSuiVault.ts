import { bcs } from '@mysten/sui/bcs'
import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { useSuiClient, useWallet } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

import { getSuiChainConfig } from '@/utils/chain'

import { useContractAddresses } from './useContractAddresses'

export const useSuiVault = () => {
  const suiClient = useSuiClient() as SuiClient
  const { account, chain } = useWallet()
  const contractAddresses = useContractAddresses(
    getSuiChainConfig(chain?.id)?.id
  )

  const getVaultAddress = async (
    owner?: Address,
    packageId?: Address,
    bitSmileyObjectId?: Address
  ) => {
    if (!packageId || !bitSmileyObjectId || !owner) return
    try {
      const tx = new Transaction()
      tx.moveCall({
        target: `${packageId}::bitsmiley::get_vault`,
        arguments: [tx.object(bitSmileyObjectId), tx.pure.address(owner)]
      })

      const res = await suiClient.devInspectTransactionBlock({
        sender: owner,
        transactionBlock: tx
      })

      const bytes = res.results?.[0].returnValues?.[0]?.[0] || []
      return bcs.Address.parse(new Uint8Array(bytes))
    } catch {
      return ''
    }
  }

  const { data: vaultAddress } = useQuery({
    queryKey: [
      'btc-balance',
      contractAddresses?.bitSmileyPackageId,
      contractAddresses?.bitSmileyObjectId,
      account?.address
    ],
    queryFn: () =>
      getVaultAddress(
        account?.address as Address,
        contractAddresses?.bitSmileyPackageId,
        contractAddresses?.bitSmileyObjectId
      ),
    enabled: Boolean(
      contractAddresses?.bitSmileyPackageId &&
        contractAddresses?.bitSmileyObjectId &&
        account?.address &&
        suiClient
    )
  })

  return {
    vaultAddress
  }
}
