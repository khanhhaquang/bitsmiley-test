import { useQuery } from 'react-query'
import { ProjectService } from '@/services/project'

export const useCheckInsctiption = (inscriptionId: string) => {
  const { data, refetch, isFetching } = useQuery(
    [ProjectService.checkInscription.key, inscriptionId],
    () => ProjectService.checkInscription.call(inscriptionId),
    {
      enabled: false
    }
  )

  const result = data?.data

  return { result, check: refetch, isChecking: isFetching }
}
