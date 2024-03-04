import { ProjectService } from '@/services/project'
import { useEffect, useState } from 'react'
import { useStoreActions } from './useStoreActions'
import { useSelector } from 'react-redux'
import { getFeaturesEnabled, getProjectInfo } from '@/store/common/reducer'

export const useProjectInfo = () => {
  const { setProjectInfo, setFeaturesEnabled } = useStoreActions()
  const [isLoadingProjectInfo, setIsLoadingProjectInfo] = useState(true)
  const [isLoadingFeaturesEnabled, setIsLoadingFeaturesEnabled] = useState(true)
  const [isError, setIsError] = useState(false)

  const projectInfo = useSelector(getProjectInfo)
  const featuresEnabled = useSelector(getFeaturesEnabled)

  useEffect(() => {
    if (projectInfo) return
    setIsLoadingProjectInfo(true)
    ProjectService.getProjectInfo
      .call()
      .then((v) => setProjectInfo(v.data))
      .catch(() => setIsError(true))
      .finally(() => setIsLoadingProjectInfo(false))
  }, [projectInfo, setProjectInfo])

  useEffect(() => {
    if (featuresEnabled) return
    setIsLoadingFeaturesEnabled(true)
    ProjectService.getEnabledModules
      .call()
      .then((v) => setFeaturesEnabled(v.data.data))
      .catch(() => setIsError(true))
      .finally(() => setIsLoadingFeaturesEnabled(false))
  }, [featuresEnabled, setFeaturesEnabled])

  const isLoading = isLoadingFeaturesEnabled || isLoadingProjectInfo

  return {
    featuresEnabled,
    projectInfo,
    isLoading,
    isError
  }
}
