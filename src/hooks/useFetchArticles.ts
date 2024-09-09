// import { useQuery } from '@tanstack/react-query'
// import { FeedService } from '@/services/feed'

// const imgUrlReg = /https:\/\/.*?(gif|png|jpg)/gi

export const useFetchArticles = () => {
  const isLoading = false
  const items = [
    {
      link: 'https://medium.com/@bitsmiley/bitsmiley-monthly-report-august-2024-508808dccad8',
      img: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vFmKpNIi-ypGXhLRJNXwWA.png',
      title: 'bitSmiley Monthly Report — August 2024'
    },
    {
      link: 'https://medium.com/@bitsmiley/babylon-x-bitsmiley-transforming-btc-liquidity-in-the-blockchain-space-6fa21b63e1db',
      img: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4avDKAQM-ldfcq7gVQCGTA.png',
      title:
        'Babylon X bitSmiley: Transforming BTC Liquidity in the Blockchain Space'
    },
    {
      link: 'https://medium.com/@bitsmiley/from-1-to-infinity-bitsmileys-multi-chain-stablecoin-plan-65bb13526845',
      img: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/0*Op1KRgVWqcBN15Ad',
      title: 'From 1 to Infinity: bitSmiley’s Multi-Chain Stablecoin Plan'
    },
    {
      link: 'https://medium.com/@bitsmiley/looking-back-with-a-smile-celebrating-our-growth-and-achievements-a6968c50219d',
      img: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/0*CMzYhCGkbRmWjyy_',
      title: 'Looking Back with a Smile: Recapping Our Growth and Achievements!'
    }
  ]

  return { items, isLoading }
}
