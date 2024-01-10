import { CanvasFrames } from '@/components/CanvasFrames'
import { Image } from '@/components/Image'
import { Marquee } from '@/components/Marquee'
import Typewriter from '@/components/Typewriter'
import { cn } from '@/utils/cn'
import {
  getFrameUrl,
  getIconUrl,
  getIllustrationUrl
} from '@/utils/getImageUrl'

export const MintMachine: React.FC<{ hideScrollDown: boolean }> = ({
  hideScrollDown
}) => {
  return (
    <div className="relative mt-[19px] flex h-[995px] w-[1423px] shrink-0 items-center justify-center">
      <StaticMachine />
      <MintButton />
      <QuestionMark />
      <Lights />
      <BoxContent />
      <MarqueeText />
      <ArrowDown hideScrollDown={hideScrollDown} />
    </div>
  )
}

const MintButton: React.FC = () => {
  return (
    <div className="absolute left-[740px] top-[624px] z-10">
      <Image src={getIllustrationUrl('mintbutton-disabled')} />
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
    <Image
      className={cn(
        'absolute left-1/2 top-[895px] -translate-x-1/2 animate-bounce',
        hideScrollDown && 'invisible'
      )}
      src={getIconUrl('arrow-down', 'svg')}
    />
  )
}

const QuestionMark: React.FC = () => {
  return (
    <div className="absolute bottom-[428px] left-[367px] z-10">
      <CanvasFrames
        fps={24}
        width={250}
        height={237}
        imgLocalPaths={Array(49)
          .fill(1)
          .map((_, idx) => getFrameUrl('question-mark-rotate-mini', idx + 1))}
      />
    </div>
  )
}

const Lights: React.FC = () => {
  return (
    <div className="absolute inset-x-0 h-full w-full">
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

const BoxContent: React.FC = () => {
  return (
    <div className="absolute bottom-[428px] left-[692px] flex h-[237px] flex-col gap-y-5 text-sm">
      <div className="flex flex-col gap-y-2.5">
        <div className="flex items-center whitespace-nowrap font-bold text-green">
          <Typewriter
            seq={0}
            renderNodes={() => 'OVERVIEW---------------------------'}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2.5">
            <div className="h-5">
              <Typewriter seq={1} renderNodes={() => '[NAME]'} />
            </div>
            <div className="h-5">
              <Typewriter seq={3} renderNodes={() => '[ISSUER]'} />
            </div>
            <div className="h-5">
              <Typewriter seq={5} renderNodes={() => '[AMOUNT]'} />
            </div>
          </div>

          <div className="flex flex-col gap-y-2.5">
            <div className="h-5 w-40">
              <Typewriter seq={2} renderNodes={() => 'SMILEY EXPRESS CARD'} />
            </div>
            <div className="h-5 w-40">
              <Typewriter seq={4} renderNodes={() => 'bitSmiley'} />
            </div>
            <div className="h-5 w-40">
              <Typewriter seq={6} renderNodes={() => '????'} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-2.5">
        <div className="flex items-center whitespace-nowrap font-bold text-green">
          <Typewriter
            seq={7}
            renderNodes={() => 'STATS------------------------------'}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2.5">
            <div className="h-5">
              <Typewriter seq={8} renderNodes={() => '[VALUE]'} />
            </div>
            <div className="h-5">
              <Typewriter seq={10} renderNodes={() => '[UTILITY]'} />
            </div>
          </div>

          <div className="flex flex-col gap-y-2.5">
            <span className="h-5 w-40">
              <Typewriter seq={9} renderNodes={() => '????'} />
            </span>
            <span className="h-5 w-40">
              <Typewriter seq={11} renderNodes={() => '????'} />
            </span>
          </div>
        </div>
      </div>

      <Typewriter
        wrapperClassName="flex items-center font-bold text-green"
        seq={12}
        renderNodes={() => [
          <div className="mr-1.5 h-4">
            <Image src={getIconUrl('dot', 'svg')} />
          </div>,
          'MINTING COMING SOON...'
        ]}
      />
    </div>
  )
}

const MarqueeText: React.FC = () => {
  return (
    <div className="absolute bottom-[139px] left-[205px] h-[104px] w-[660px]">
      <Marquee
        speed={75}
        className="relative flex h-full w-full cursor-default items-center justify-center overflow-hidden whitespace-nowrap p-5 font-sdm text-[80px] text-yellow2">
        bitSmiley grand minting coming soon !!! bitSmiley grand minting coming
        soon !!!
      </Marquee>
    </div>
  )
}
