import { useQuery } from '@tanstack/react-query'
import { ProjectService } from '@/services/project'

export const useCheckInsctiption = (inscriptionId: string) => {
  const id = inscriptionId.trim().toLowerCase()
  const { data, refetch, isFetching } = useQuery({
    queryKey: [ProjectService.checkInscription.key, id],
    queryFn: () => ProjectService.checkInscription.call(id),
    enabled: false
  })

  const result = data?.data

  return { result, check: refetch, isChecking: isFetching }
}
