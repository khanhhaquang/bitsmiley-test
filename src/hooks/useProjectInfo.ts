import { useQuery } from 'react-query'
import { ProjectService } from '@/services/project'

export const useProjectInfo = () => {
  const { data, isLoading } = useQuery(
    ProjectService.getProjectInfo.key,
    ProjectService.getProjectInfo.call
  )

  const nowTime = Number(data?.data?.data?.nowTime || 0)
  const startTime = Number(data?.data?.data?.startTime || 0)
  const remainTime = startTime - nowTime

  return { info: data?.data?.data, remainTime, isLoading }
}
