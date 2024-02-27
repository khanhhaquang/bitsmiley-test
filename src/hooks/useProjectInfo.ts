import { ProjectService } from '@/services/project'
import { useEffect, useState } from 'react'
import { useStoreActions } from './useStoreActions'
import { useSelector } from 'react-redux'
import { getProjectInfo } from '@/store/common/reducer'

export const useProjectInfo = () => {
  const { setProjectInfo } = useStoreActions()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const projectInfo = useSelector(getProjectInfo)

  useEffect(() => {
    if (projectInfo) return
    setIsLoading(true)
    ProjectService.getProjectInfo
      .call()
      .then((v) => setProjectInfo(v.data))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false))
  }, [projectInfo, setProjectInfo])

  return {
    projectInfo,
    isLoading,
    isError
  }
}
