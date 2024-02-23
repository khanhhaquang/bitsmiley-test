// import { useQuery } from '@tanstack/react-query'
// import { FeedService } from '@/services/feed'

// const imgUrlReg = /https:\/\/.*?(gif|png|jpg)/gi

export const useFetchArticles = () => {
  const isLoading = false
  const items = [
    {
      link: 'https://medium.com/@bitsmiley_labs/bitsmiley-discord-wl-all-for-the-horde-83705019801f?source=rss-51d7f98a9f01------2',
      img: 'https://cdn-images-1.medium.com/max/1024/1*ddTaWCrkNMe3tr6IMMSmlw.png'
    },
    {
      link: 'https://medium.com/@bitsmiley_labs/btc-leading-protocol-introduces-og-nft-bitdisc-6b3684a59615?source=rss-51d7f98a9f01------2',
      img: 'https://cdn-images-1.medium.com/max/1024/1*q0bHv6V9734rbIacriiAXA.png'
    },
    {
      link: 'https://medium.com/@bitsmiley_labs/fund-protection-bitinsurance-1c008885567a?source=rss-51d7f98a9f01------2',
      img: 'https://cdn-images-1.medium.com/max/1024/1*Iq78WeFuM5H64dh92uPrmw.png'
    }
  ]

  return { items, isLoading }
}
