import { useQuery } from 'react-query'
import { ProjectService } from '@/services/project'
import { useUserInfo } from './useUserInfo'

export const useProjectInfo = () => {
  const { isWhitelist } = useUserInfo()
  const { data, isLoading } = useQuery(
    ProjectService.getProjectInfo.key,
    ProjectService.getProjectInfo.call
  )

  const nowTime = Number(data?.data?.data?.nowTime || 0)
  const startTime = Number(data?.data?.data?.startTime || 0)
  const mintEndTime = Number(data?.data?.data?.mintEndTime || 0)
  const whitelistRemainTime = Math.max(
    0,
    Math.floor((startTime - nowTime) / 1000)
  )
  const normalRemainTime = Math.max(
    0,
    Math.floor((mintEndTime - nowTime) / 1000)
  )
  const remainTime = isWhitelist ? whitelistRemainTime : normalRemainTime

  return {
    info: data?.data?.data,
    remainTime,
    isLoading
  }
}
