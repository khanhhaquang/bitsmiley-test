import { ArrowDownIcon } from '@/assets/icons'
import { CanvasFrames } from '@/components/CanvasFrames'
import { Image } from '@/components/Image'
import { Marquee } from '@/components/Marquee'
import { cn } from '@/utils/cn'
import { getFrameUrl, getIllustrationUrl } from '@/utils/getAssetsUrl'
import { BoxContent } from './BoxContent'
import { MintButton } from './MintButton'

export const MintMachine: React.FC<{ hideScrollDown: boolean }> = ({
  hideScrollDown
}) => {
  return (
    <div className="relative mt-[19px] flex h-[995px] w-[1423px] shrink-0 items-center justify-center">
      <StaticMachine />
      <Lights />
      <MarqueeText />
      <BoxContent />
      <NumberPad />
      <MintButton />
      <ArrowDown hideScrollDown={hideScrollDown} />
    </div>
  )
}

const MarqueeText: React.FC = () => {
  return (
    <div className="absolute bottom-[139px] left-[205px] h-[104px] w-[660px]">
      <Marquee
        speed={75}
        className="relative flex size-full cursor-default items-center justify-center overflow-hidden whitespace-nowrap border p-5 font-sdm text-[80px] text-yellow2">
        <span className="mr-6">bitSmiley Grand minting is here!</span>
        <span className="mr-6">bitSmiley Grand minting is here!</span>
        <span className="mr-6">bitSmiley Grand minting is here!</span>
        <span className="mr-6">bitSmiley Grand minting is here!</span>
      </Marquee>
    </div>
  )
}

const NumberPad: React.FC = () => {
  return (
    <div className="absolute left-[515px] top-[648px] z-[100] h-[69px] w-[133px]">
      <Image src={getIllustrationUrl('numberpad-default')} />
    </div>
  )
}

const StaticMachine: React.FC = () => {
  return (
    <Image
      className="absolute h-[995px] w-[1423px] shrink-0"
      src={getIllustrationUrl('machine-static')}
    />
  )
}

const ArrowDown: React.FC<{ hideScrollDown: boolean }> = ({
  hideScrollDown
}) => {
  return (
    <ArrowDownIcon
      className={cn(
        'absolute left-1/2 top-[895px] -translate-x-1/2 animate-bounce',
        hideScrollDown && 'invisible'
      )}
    />
  )
}

const Lights: React.FC = () => {
  return (
    <div className="absolute inset-x-0 size-full">
      <CanvasFrames
        fps={1}
        width={1423}
        height={995}
        imgLocalPaths={[
          getFrameUrl('lights', 'light-1'),
          getFrameUrl('lights', 'light-2')
        ]}
      />
    </div>
  )
}
