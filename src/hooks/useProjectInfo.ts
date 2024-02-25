import { useQuery } from '@tanstack/react-query'
import { ProjectService } from '@/services/project'
import { useMemo } from 'react'

export const useProjectInfo = () => {
  const { data, isLoading } = useQuery({
    queryKey: [ProjectService.getProjectInfo.key],
    queryFn: ProjectService.getProjectInfo.call
  })

  const projectInfo = useMemo(() => data?.data?.data, [data])

  return {
    projectInfo,
    isLoading
  }
}
