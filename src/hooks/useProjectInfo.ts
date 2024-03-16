import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { ProjectService } from '@/services/project'
import { getProjectInfo } from '@/store/common/reducer'

import { useStoreActions } from './useStoreActions'

export const useProjectInfo = () => {
  const { setProjectInfo } = useStoreActions()
  const [isLoadingProjectInfo, setIsLoadingProjectInfo] = useState(true)
  const [isError, setIsError] = useState(false)

  const projectInfo = useSelector(getProjectInfo)

  useEffect(() => {
    if (projectInfo) return
    setIsLoadingProjectInfo(true)
    ProjectService.getProjectInfo
      .call()
      .then((v) => setProjectInfo(v.data))
      .catch(() => setIsError(true))
      .finally(() => setIsLoadingProjectInfo(false))
  }, [projectInfo, setProjectInfo])

  const isLoading = isLoadingProjectInfo

  return {
    projectInfo,
    isLoading,
    isError
  }
}
