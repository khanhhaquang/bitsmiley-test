import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { DearBitSmiler } from '../Common'

export const NotConnected: React.FC = () => {
  return (
    <>
      <DearBitSmiler />
      <div className="absolute left-1/2 top-[366px] flex -translate-x-1/2 items-center justify-center gap-x-14">
        <Image src={getIllustrationUrl('disccoins')} />
        <div className="w-[384px] text-sm">
          <p>
            Now, you can stake your bitDisc to mine bitGem. The bitGem earned be
            converted to respective whitelist token amount available to purchase
            at TGE.
          </p>
          <br />
          <p>Connect wallet to find more...</p>
        </div>
      </div>
    </>
  )
}
