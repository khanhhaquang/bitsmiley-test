import { useQuery } from '@tanstack/react-query'

import { AirdropService } from '@/services/airdrop'

import { useUserInfo } from './useUserInfo'

export const useGetMyBitsmileyJourney = () => {
  const { address } = useUserInfo()

  const data = useQuery({
    queryKey: [AirdropService.getMyBitsmileyJourney.key, address],
    queryFn: () =>
      address ? AirdropService.getMyBitsmileyJourney.call(address) : undefined,
    select: (res) => (!res ? undefined : res.data)
  })

  return data
}
