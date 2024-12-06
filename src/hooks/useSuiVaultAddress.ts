import { bcs } from '@mysten/sui/bcs'
import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { useSuiClient } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

import { useContractAddresses } from './useContractAddresses'
import { useUserInfo } from './useUserInfo'

export const useSuiVaultAddress = () => {
  const suiClient = useSuiClient() as SuiClient
  const { suiChainIdAsNumber, suiWalletAddress } = useUserInfo()
  const { suiContractAddresses } = useContractAddresses(suiChainIdAsNumber)

  const getVaultAddress = async (
    bitSmileyPackageId?: Address,
    bitSmileyObjectId?: Address
  ) => {
    if (!bitSmileyPackageId || !bitSmileyObjectId || !suiWalletAddress) return
    const tx = new Transaction()
    tx.moveCall({
      target: `${bitSmileyPackageId}::bitsmiley::get_vault`,
      arguments: [
        tx.object(bitSmileyObjectId),
        tx.pure.address(suiWalletAddress)
      ]
    })

    const res = await suiClient.devInspectTransactionBlock({
      sender: suiWalletAddress,
      transactionBlock: tx
    })

    if (res.error) {
      throw new Error(res.error)
    }

    const bytes = res.results?.[0].returnValues?.[0]?.[0] || []
    if (bytes.length === 0) return ''
    return bcs.option(bcs.Address).parse(new Uint8Array(bytes))
  }

  const { data: vaultAddress, ...rest } = useQuery({
    queryKey: [
      'sui-vault-address',
      suiContractAddresses?.bitSmileyPackageId,
      suiContractAddresses?.bitSmileyObjectId,
      suiWalletAddress
    ],
    queryFn: () =>
      getVaultAddress(
        suiContractAddresses?.bitSmileyPackageId,
        suiContractAddresses?.bitSmileyObjectId
      ),
    enabled: Boolean(
      suiContractAddresses?.bitSmileyPackageId &&
        suiContractAddresses?.bitSmileyObjectId &&
        suiWalletAddress &&
        suiClient
    )
  })

  return {
    vaultAddress: vaultAddress as Address,
    ...rest
  }
}
