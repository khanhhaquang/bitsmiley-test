import { useQuery } from 'react-query'
import { ProjectService } from '@/services/project'
import { useUserInfo } from './useUserInfo'
import { useCallback } from 'react'

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

  const getCanMint = useCallback(
    (currentBlockHeight?: number) => {
      const whitelistStartBlockHeight = Number(
        data?.data?.data?.whitelistStartBlockHeight || 0
      )
      const publicStartBlockHeight = Number(
        data?.data?.data?.publicStartBlockHeight || 0
      )
      const whitelistEndBlockHeight = Number(
        data?.data?.data?.whitelistEndBlockHeight || 0
      )

      if (
        !whitelistEndBlockHeight ||
        !publicStartBlockHeight ||
        !whitelistEndBlockHeight ||
        !currentBlockHeight
      )
        return false

      if (isWhitelist) {
        return (
          (currentBlockHeight >= whitelistStartBlockHeight &&
            currentBlockHeight <= whitelistEndBlockHeight) ||
          currentBlockHeight >= publicStartBlockHeight
        )
      } else {
        return currentBlockHeight >= publicStartBlockHeight
      }
    },
    [data, isWhitelist]
  )

  return {
    info: data?.data?.data,
    remainTime,
    isLoading,
    getCanMint
  }
}
