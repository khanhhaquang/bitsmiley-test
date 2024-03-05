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
            Now, you can stake your bitDisc to mine bitJade. BitJade will be
            converted to the corresponding token quotas that can be purchased
            during TGE.
          </p>
          <br />
          <p>Connect wallet to find more...</p>
        </div>
      </div>
    </div>
  )
}
