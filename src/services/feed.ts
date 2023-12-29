import axios from 'axios'

const MEDIUM_URL =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@bitsmiley_labs'

interface MediumArticle {
  author: string
  categories: string[]
  content: string
  description: string
  enclosure: object
  guid: string
  link: string
  pubDate: string
  thumbnail: string
  title: string
  img?: string
}

export const FeedService = {
  getFeeds: {
    key: 'feed.getMediumArticlas',
    call: () => axios.get<{ items: MediumArticle[] }>(MEDIUM_URL)
  }
}
