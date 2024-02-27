import { useQuery } from '@tanstack/react-query'
import { ProjectService } from '@/services/project'
import { useMemo } from 'react'

export const useProjectInfo = () => {
  const { data, ...rest } = useQuery({
    queryKey: [ProjectService.getProjectInfo.key],
    queryFn: ProjectService.getProjectInfo.call,
    select: (rest) => rest.data
  })

  const projectInfo = useMemo(() => data, [data])

  return {
    projectInfo,
    ...rest
  }
}
