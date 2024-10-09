import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import YourBitsmileyJourney from './components/YourBitsmileyJourney'

const Airdrop = () => {
  return (
    <div className="mt-[200px] flex w-screen flex-col gap-y-[100px] bg-cover bg-center bg-no-repeat text-white sm:px-2">
      <YourBitsmileyJourney />
      <div
        className="h-[136px] w-full bg-contain bg-repeat px-3"
        style={{
          backgroundImage: `url(${getIllustrationUrl('harvesting', 'gif')})`
        }}
      />
    </div>
  )
}

export default Airdrop
