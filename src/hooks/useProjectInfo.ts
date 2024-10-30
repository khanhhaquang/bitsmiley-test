import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { ProjectService } from '@/services/project'
import { getProjectInfo } from '@/store/common/reducer'

import { useStoreActions } from './useStoreActions'

let IS_FETCHING_PROJECT_INFO = false

export const useProjectInfo = () => {
  const { setProjectInfo } = useStoreActions()
  const [isLoadingProjectInfo, setIsLoadingProjectInfo] = useState(true)
  const [isError, setIsError] = useState(false)

  const projectInfo = useSelector(getProjectInfo)

  useEffect(() => {
    if (projectInfo || IS_FETCHING_PROJECT_INFO) return
    IS_FETCHING_PROJECT_INFO = true

    ProjectService.getProjectInfo
      .call()
      .then((v) => setProjectInfo(v.data))
      .catch(() => setIsError(true))
      .finally(() => setIsLoadingProjectInfo(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    projectInfo,
    isLoading: isLoadingProjectInfo,
    isError
  }
}
