import { useQuery } from 'react-query'
import { IProject, ProjectService } from '@/services/project'
import { useUserInfo } from './useUserInfo'
import { useCallback, useEffect, useMemo } from 'react'
import { useStoreActions } from './useStoreActions'
import { AxiosResponse } from 'axios'
import { IReseponse } from '@/types/common'

export const useProjectInfo = () => {
  const { setRemainBlock } = useStoreActions()
  const { isWhitelist } = useUserInfo()

  const getWhitelistRemainBlock = useCallback(
    (res?: AxiosResponse<IReseponse<IProject>>) => {
      const nowBlockHeight = Number(res?.data?.data?.blockHeight || 0)
      const whitelistStartBlockHeight = Number(
        res?.data?.data?.whitelistStartBlockHeight || 0
      )
      const whitelistEndBlockHeight = Number(
        res?.data?.data?.whitelistEndBlockHeight || 0
      )
      const publicStartBlockHeight = Number(
        res?.data?.data?.publicStartBlockHeight || 0
      )
      const whitelistRemainBlock = Math.max(
        0,
        whitelistStartBlockHeight - nowBlockHeight - 1
      )

      const isWhitelistEnded = nowBlockHeight >= whitelistEndBlockHeight

      const normalRemainBlock = Math.max(
        0,
        publicStartBlockHeight - nowBlockHeight - 1
      )

      return isWhitelistEnded ? normalRemainBlock : whitelistRemainBlock
    },
    []
  )

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

  const getCanMint = useCallback(
    (res?: AxiosResponse<IReseponse<IProject>>) => {
      const whitelistRemainBlock = getWhitelistRemainBlock(res)
      const normalRemainBlock = getNormalRemainBlock(res)
      const remainBlock = isWhitelist ? whitelistRemainBlock : normalRemainBlock
      return remainBlock <= 0
    },
    [getNormalRemainBlock, getWhitelistRemainBlock, isWhitelist]
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
      refetchInterval: (res) => (getCanMint(res) ? false : 10 * 1000)
    }
  )

  useEffect(() => {
    const whitelistRemainBlock = getWhitelistRemainBlock(data)
    const normalRemainBlock = getNormalRemainBlock(data)
    const remainBlock = isWhitelist ? whitelistRemainBlock : normalRemainBlock
    setRemainBlock(remainBlock)
  }, [
    data,
    isWhitelist,
    setRemainBlock,
    getNormalRemainBlock,
    getWhitelistRemainBlock
  ])

  return { isLoading, getCanMint }
}
