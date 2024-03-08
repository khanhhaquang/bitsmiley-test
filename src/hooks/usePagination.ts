import { AxiosResponse } from 'axios'
import {
  keepPreviousData,
  useQueryClient,
  useQuery
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { IResponse } from '@/types/common'
import { IPageParams, IRank } from '@/services/team'

const PAGE_SIZE = 30
const SEARCH_DEBOUNCE_DELAY = 500

export const usePagination = <T>({
  queryKey,
  queryFn
}: {
  queryKey: string
  queryFn: (
    params: IPageParams
  ) => Promise<AxiosResponse<IResponse<IRank<[T, number]>>>>
}) => {
  const queryClient = useQueryClient()
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, SEARCH_DEBOUNCE_DELAY)
  const [currentPageNum, setCurrentPageNum] = useState(1)

  const { data, isFetching, isPlaceholderData, isLoading } = useQuery({
    queryKey: [queryKey, currentPageNum, debouncedSearchValue],
    queryFn: () =>
      queryFn({
        page: currentPageNum,
        size: PAGE_SIZE,
        search: debouncedSearchValue
      }),
    placeholderData: keepPreviousData
  })

  // prefetch the next page
  useEffect(() => {
    if (!isPlaceholderData && !data?.data?.data?.last) {
      queryClient.prefetchQuery({
        queryKey: [queryKey, currentPageNum + 1, debouncedSearchValue],
        queryFn: () =>
          queryFn({
            page: currentPageNum + 1,
            size: PAGE_SIZE,
            search: debouncedSearchValue
          })
      })
    }
  }, [
    data,
    isPlaceholderData,
    currentPageNum,
    queryClient,
    debouncedSearchValue,
    queryKey,
    queryFn
  ])

  useEffect(() => {
    if (searchValue) {
      setCurrentPageNum(1)
    }
  }, [searchValue])

  const totalPagesNum = data?.data?.data?.totalPages
  const currentPageData = data?.data?.data?.content?.map((item) => ({
    data: item?.[0],
    rank: item?.[1]
  }))

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
