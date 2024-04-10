// import { useQuery } from '@tanstack/react-query'
// import { FeedService } from '@/services/feed'

// const imgUrlReg = /https:\/\/.*?(gif|png|jpg)/gi

export const useFetchArticles = () => {
  const isLoading = false
  const items = [
    {
      link: 'https://medium.com/@bitsmiley/the-trumeme-show-bitcow-x-bitsmiley-joint-public-testnet-event-37347ecfb2ce',
      img: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2mcj9rDaXamuyYnwAhtiXA.png'
    },
    {
      link: 'https://medium.com/@bitsmiley/btc-leading-protocol-introduces-og-nft-bitdisc-f876ccae5a56',
      img: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/0*AzspLFwctgHyJkEt.png'
    },
    {
      link: 'https://medium.com/@bitsmiley/bitbook-the-btc-pilots-handbook-part-1-0ce464b06139',
      img: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*liG1gNKP5HHPhnWuFbvsbw.png'
    }
  ]

  return { items, isLoading }
}
