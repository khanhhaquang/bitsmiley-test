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

      const normalRemainBlock = getNormalRemainBlock(res)

      const cfn = Number(res?.data?.data?.nftCount || 0)
      const wtmax = Number(res?.data?.data?.whitelistMax || 0)

      const isReachedWtMax = cfn >= wtmax
      const isWhitelistEnded = nowBlockHeight >= whitelistEndBlockHeight

      if (isWhitelistEnded || isReachedWtMax) {
        return normalRemainBlock
      }

      return whitelistRemainBlock
    },
    [getNormalRemainBlock]
  )

  const getIsStarted = useCallback(
    (res?: AxiosResponse<IReseponse<IProject>>) => {
      const whitelistRemainBlock = getWhitelistRemainBlock(res)
      const normalRemainBlock = getNormalRemainBlock(res)
      const remainBlock = isWhitelist ? whitelistRemainBlock : normalRemainBlock
      return remainBlock <= 0
    },
    [isWhitelist, getNormalRemainBlock, getWhitelistRemainBlock]
  )

  const { data, isLoading, refetch } = useQuery(
    [ProjectService.getProjectInfo.key],
    ProjectService.getProjectInfo.call,
    {
      refetchInterval: (res) => {
        const currentNc = Number(res?.data?.data.nftCount || 0)
        const pubcNc = Number(res?.data?.data?.publicMax || 0)
        const isRechedMx = currentNc >= pubcNc

        return getIsStarted(res) || isRechedMx
          ? false
          : FETCH_PROJECT_INFO_INTERVAL
      }
    }
  )

  const nowBlockHeight = useMemo(
    () => Number(data?.data?.data?.blockHeight || 0),
    [data]
  )
  const whitelistStartBlockHeight = useMemo(
    () => Number(data?.data?.data?.whitelistStartBlockHeight || 0),
    [data]
  )
  const whitelistEndBlockHeight = useMemo(
    () => Number(data?.data?.data?.whitelistEndBlockHeight || 0),
    [data]
  )
  const currentNftCount = useMemo(
    () => Number(data?.data?.data?.nftCount || 0),
    [data]
  )
  const publicMax = useMemo(
    () => Number(data?.data?.data?.publicMax || 0),
    [data]
  )
  const whitelistMax = useMemo(
    () => Number(data?.data?.data?.whitelistMax || 0),
    [data]
  )

  const isDuringWhitelist = useMemo(() => {
    return (
      nowBlockHeight >= whitelistStartBlockHeight - 1 &&
      nowBlockHeight < whitelistEndBlockHeight
    )
  }, [nowBlockHeight, whitelistEndBlockHeight, whitelistStartBlockHeight])

  const isWhitelistEnded = useMemo(
    () => nowBlockHeight >= whitelistEndBlockHeight,
    [whitelistEndBlockHeight, nowBlockHeight]
  )

  const remainBlock = useMemo(() => {
    if (!data?.data.data) return 0

    const whitelistRemainBlock = getWhitelistRemainBlock(data)
    const normalRemainBlock = getNormalRemainBlock(data)
    const num = isWhitelist ? whitelistRemainBlock : normalRemainBlock
    return num
  }, [data, getNormalRemainBlock, getWhitelistRemainBlock, isWhitelist])

  const isReachWhitelistMaximum = useMemo(
    () => currentNftCount >= whitelistMax,
    [currentNftCount, whitelistMax]
  )

  const isReachedTotalMax = useMemo(
    () => currentNftCount && currentNftCount >= publicMax,
    [currentNftCount, publicMax]
  )

  const isNotStarted = useMemo(() => remainBlock > 0, [remainBlock])
  const isLoadingRemainBlock = useMemo(() => remainBlock < 0, [remainBlock])

  const getCanMint = useCallback(
    (res?: AxiosResponse<IReseponse<IProject>>) => {
      if (!res?.data?.data) return false

      const isStarted = getIsStarted(res)
      if (!isStarted) return false

      const nct = Number(res?.data?.data?.nftCount || 0)
      const pmx = Number(res?.data?.data?.publicMax || 0)
      const wmx = Number(res?.data?.data?.whitelistMax || 0)

      return isWhitelist && !isWhitelistEnded ? nct < wmx : nct < pmx
    },
    [getIsStarted, isWhitelist, isWhitelistEnded]
  )

  return {
    getCanMint,
    refetch,
    isLoading,
    remainBlock,
    isNotStarted,
    isReachedTotalMax,
    isWhitelistEnded,
    isReachWhitelistMaximum,
    isDuringWhitelist,
    isLoadingRemainBlock
  }
}
