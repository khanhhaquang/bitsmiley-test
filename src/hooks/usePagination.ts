import {
  keepPreviousData,
  useQueryClient,
  useQuery
} from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'

import { useDebounce } from '@/hooks/useDebounce'
import { IPageParams, IRank } from '@/services/team'
import { IResponse } from '@/types/common'

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_DELAY = 500

export const usePagination = <T>({
  queryKey,
  queryFn,
  pageSize = PAGE_SIZE
}: {
  queryKey: string[]
  queryFn?: (params: IPageParams) => Promise<AxiosResponse<IResponse<IRank<T>>>>
  pageSize?: number
}) => {
  const queryClient = useQueryClient()
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, SEARCH_DEBOUNCE_DELAY)
  const [currentPageNum, setCurrentPageNum] = useState(1)

  const {
    data: rank,
    isFetching,
    isPlaceholderData,
    isLoading
  } = useQuery({
    queryKey: [
      ...queryKey,
      { size: pageSize, page: currentPageNum, searchBy: debouncedSearchValue }
    ],
    queryFn: () =>
      queryFn?.({
        page: currentPageNum,
        size: pageSize,
        search: debouncedSearchValue
      }),
    placeholderData: keepPreviousData,
    enabled: !!queryFn,
    select: (res) => res?.data?.data
  })

  // prefetch the next page
  useEffect(() => {
    if (!isPlaceholderData && !!queryFn && !rank?.last) {
      queryClient.prefetchQuery({
        queryKey: [...queryKey, currentPageNum + 1, debouncedSearchValue],
        queryFn: () =>
          queryFn({
            page: currentPageNum + 1,
            size: pageSize,
            search: debouncedSearchValue
          })
      })
    }
  }, [
    rank,
    queryFn,
    pageSize,
    queryKey,
    queryClient,
    currentPageNum,
    isPlaceholderData,
    debouncedSearchValue
  ])

  useEffect(() => {
    if (searchValue) {
      setCurrentPageNum(1)
    }
  }, [searchValue])

  const totalPagesNum = rank?.totalPages
  const currentPageData = rank?.content

  const hasPreviousPage = currentPageNum > 1
  const hasNextPage = !!totalPagesNum && currentPageNum < totalPagesNum

  const fetchNextPage = () => hasNextPage && setCurrentPageNum((v) => v + 1)
  const fetchPreviousPage = () =>
    hasPreviousPage && setCurrentPageNum((v) => v - 1)

  return {
    currentPageData,
    currentPageNum,
    totalPagesNum,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    isLoading,
    setCurrentPageNum,
    setSearchValue
  }
}
