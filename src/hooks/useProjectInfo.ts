import { useQuery } from 'react-query'
import { ProjectService } from '@/services/project'

export const useProjectInfo = () => {
  const { data, isLoading } = useQuery(
    ProjectService.getProjectInfo.key,
    ProjectService.getProjectInfo.call
  )

  const nowTime = Number(data?.data?.data?.nowTime || 0)
  const startTime = Number(data?.data?.data?.startTime || 0)
  const mintEndTime = Number(data?.data?.data?.mintEndTime || 0)
  const whitelistRemainTime = Math.floor((startTime - nowTime) / 1000)
  const normalRemainTime = Math.floor((mintEndTime - nowTime) / 1000)

  return {
    info: data?.data?.data,
    whitelistRemainTime,
    normalRemainTime,
    isLoading
  }
}
