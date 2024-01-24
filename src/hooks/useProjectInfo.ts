import { useQuery } from 'react-query'
import { IProject, ProjectService } from '@/services/project'
import { useUserInfo } from './useUserInfo'
import { useCallback, useMemo } from 'react'
import { AxiosResponse } from 'axios'
import { IReseponse } from '@/types/common'

const FETCH_PROJECT_INFO_INTERVAL = 10000

export const useProjectInfo = () => {
  const { isWhitelist } = useUserInfo()

  const getNormalRemainBlock = useCallback(
    (res?: AxiosResponse<IReseponse<IProject>>) => {
      const nowBlockHeight = Number(res?.data?.data?.blockHeight || 0)
      const publicStartBlockHeight = Number(
        res?.data?.data?.publicStartBlockHeight || 0
      )
      const normalRemainBlock = Math.max(
        0,
        publicStartBlockHeight - nowBlockHeight - 1
      )
      return normalRemainBlock
    },
    []
  )

  const getWhitelistRemainBlock = useCallback(
    (res?: AxiosResponse<IReseponse<IProject>>) => {
      const nowBlockHeight = Number(res?.data?.data?.blockHeight || 0)
      const whitelistStartBlockHeight = Number(
        res?.data?.data?.whitelistStartBlockHeight || 0
      )
      const whitelistEndBlockHeight = Number(
        res?.data?.data?.whitelistEndBlockHeight || 0
      )
      const whitelistRemainBlock = Math.max(
        0,
        whitelistStartBlockHeight - nowBlockHeight - 1
      )

      const isWhitelistEnded = nowBlockHeight >= whitelistEndBlockHeight

      const normalRemainBlock = getNormalRemainBlock(res)

      return isWhitelistEnded ? normalRemainBlock : whitelistRemainBlock
    },
    [getNormalRemainBlock]
  )

  const getCanMint = useCallback(
    (res?: AxiosResponse<IReseponse<IProject>>) => {
      const whitelistRemainBlock = getWhitelistRemainBlock(res)
      const normalRemainBlock = getNormalRemainBlock(res)
      const remainBlock = isWhitelist ? whitelistRemainBlock : normalRemainBlock
      return remainBlock <= 0
    },
    [isWhitelist, getNormalRemainBlock, getWhitelistRemainBlock]
  )

  const isFetchedUserInfo = useMemo(
    () => typeof isWhitelist === 'boolean',
    [isWhitelist]
  )

  const { data, isLoading } = useQuery(
    [ProjectService.getProjectInfo.key, isFetchedUserInfo],
    ProjectService.getProjectInfo.call,
    {
      enabled: isFetchedUserInfo,
      refetchInterval: (res) =>
        getCanMint(res) ? false : FETCH_PROJECT_INFO_INTERVAL
    }
  )

  const isDuringWhitelist = useMemo(() => {
    const nowBlockHeight = Number(data?.data?.data?.blockHeight || 0)
    const whitelistStartBlockHeight = Number(
      data?.data?.data?.whitelistStartBlockHeight || 0
    )
    const whitelistEndBlockHeight = Number(
      data?.data?.data?.whitelistEndBlockHeight || 0
    )
    return (
      nowBlockHeight >= whitelistStartBlockHeight &&
      nowBlockHeight < whitelistEndBlockHeight
    )
  }, [data])

  const remainBlock = useMemo(() => {
    if (!data?.data.data) return 0

    const whitelistRemainBlock = getWhitelistRemainBlock(data)
    const normalRemainBlock = getNormalRemainBlock(data)
    const num = isWhitelist ? whitelistRemainBlock : normalRemainBlock
    return num
  }, [data, getNormalRemainBlock, getWhitelistRemainBlock, isWhitelist])

  const isReachedMaximum = useMemo(() => {
    if (!data?.data?.data) return false

    const currentNftCount = Number(data?.data?.data?.nftCount || 0)
    const publicMax = Number(data?.data?.data?.publicMax || 0)
    const whitelistMax = Number(data?.data?.data?.whitelistMax || 0)
    const totalMx = publicMax + whitelistMax
    if (isDuringWhitelist) {
      return currentNftCount >= whitelistMax
    }
    return currentNftCount >= totalMx
  }, [data, isDuringWhitelist])

  const isNotStarted = useMemo(() => remainBlock > 0, [remainBlock])
  const isLoadingRemainBlock = useMemo(() => remainBlock < 0, [remainBlock])

  return {
    getCanMint,
    isLoading,
    remainBlock,
    isNotStarted,
    isReachedMaximum,
    isDuringWhitelist,
    isLoadingRemainBlock
  }
}
