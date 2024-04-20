import { Address, formatEther } from 'viem'

import { useReadAirdropAirdrop } from '@/contracts/Airdrop'

export const useAirdrop = (airdropAddress?: Address) => {
  const { data: airdropInfo, isLoading: isLoadingAirdropInfo } =
    useReadAirdropAirdrop({
      address: airdropAddress,
      query: {
        select: (res) => ({
          receivedUsers: res[0],
          createdBy: res[1],
          token: res[2],
          startTime: res[3].toString(),
          endTime: res[4].toString(),
          merkleTreeRoot: res[5],
          totalAllocation: formatEther(res[6]),
          totalReceived: formatEther(res[7])
        })
      }
    })

  return { airdropInfo, isLoadingAirdropInfo }
}
