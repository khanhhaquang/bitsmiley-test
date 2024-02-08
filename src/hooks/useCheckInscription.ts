import { useQuery } from 'react-query'
import { ProjectService } from '@/services/project'

export const useCheckInsctiption = (inscriptionId: string) => {
  const id = inscriptionId.trim().toLowerCase()
  const { data, refetch, isFetching } = useQuery(
    [ProjectService.checkInscription.key, id],
    () => ProjectService.checkInscription.call(id),
    {
      enabled: false
    }
  )

  const result = data?.data

  return { result, check: refetch, isChecking: isFetching }
}
