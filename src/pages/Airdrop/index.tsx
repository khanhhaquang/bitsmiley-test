import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import YourBitsmileyJourney from './components/YourBitsmileyJourney'

const Airdrop = () => {
  return (
    <div className="flex w-full flex-col items-center">
      <img
        src={getIllustrationUrl('airdrop-harvesting-season', 'webp')}
        width={1148}
        height={186}
        className="origin-top pr-12 sm:px-4 md:scale-[60%] lg:scale-75 2xl:scale-100"
      />
      <div className="mt-[200px] flex w-screen flex-col gap-y-[100px] bg-cover bg-center bg-no-repeat text-white sm:px-2">
        <YourBitsmileyJourney />
        <div
          className="h-[136px] w-full bg-contain bg-repeat px-3"
          style={{
            backgroundImage: `url(${getIllustrationUrl('harvesting', 'gif')})`
          }}
        />
      </div>
    </div>
  )
}

export default Airdrop
