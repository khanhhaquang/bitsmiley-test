import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import YourBitsmileyJourney from './components/YourBitsmileyJourney'

const Airdrop = () => {
  return (
    <div className="flex min-h-svh w-full flex-col items-center overflow-x-hidden">
      <img
        src={getIllustrationUrl('airdrop-harvesting-season', 'webp')}
        width={1148}
        height={186}
        className="fixed z-10 origin-top sm:px-4 md:scale-[60%] lg:scale-75 2xl:scale-100"
      />
      <div className="mt-[200px] flex w-screen flex-col gap-y-[100px] bg-cover bg-center bg-no-repeat pb-[200px] text-white sm:px-2">
        <YourBitsmileyJourney />
      </div>

      <div
        className="fixed bottom-0 h-[136px] w-full bg-contain bg-repeat px-3"
        style={{
          backgroundImage: `url(${getIllustrationUrl('harvesting', 'gif')})`
        }}
      />
    </div>
  )
}

export default Airdrop
