import { FeedService } from '@/services/feed'
import { useQuery } from 'react-query'

const imgUrlReg = /https:\/\/.*?(gif|png|jpg)/gi

export const useFetchArticles = () => {
  const { data, isLoading } = useQuery(FeedService.getFeeds.key, () =>
    FeedService.getFeeds.call()
  )
  const items = data?.data?.items?.map((i) => ({
    ...i,
    img: i?.content?.match(imgUrlReg)?.[0]
  }))

  return { items, isLoading }
}
