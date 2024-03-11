import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { DearBitSmiler } from '../Common'

export const NotConnected: React.FC = () => {
  return (
    <div className="flex flex-col gap-y-9 pt-8">
      <DearBitSmiler />
      <div className="flex items-center justify-center gap-x-14">
        <Image src={getIllustrationUrl('disccoins')} />
        <div className="w-[384px] text-sm">
          <p>
            Now, you can stake your M-bitDisc-Black til TGE to earn bitJade.
            bitJade will bring you privileges like no others ^_^
          </p>
          <br />
          <p>Connect your wallet to find out more...</p>
        </div>
      </div>
    </div>
  )
}
