import { CanvasFrames } from '@/components/CanvasFrames'
import { Image } from '@/components/Image'
import { Marquee } from '@/components/Marquee'
import { LINKS } from '@/config/links'
import {
  getFrameUrl,
  getIconUrl,
  getIllustrationUrl
} from '@/utils/getImageUrl'
export const MintMachine: React.FC = () => {
  const questionMarkRotateMiniImgUrls = Array(49)
    .fill(1)
    .map((_, idx) => getFrameUrl('question-mark-rotate-mini', idx + 1))

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex h-[1200px] w-[1716px] shrink-0 items-center justify-center">
        <Image
          className="absolute h-[1200px] w-[1716px] shrink-0"
          src={getIllustrationUrl('machine-static')}
        />

        <Image
          className="absolute h-[1200px] w-[1716px] shrink-0"
          src={getIllustrationUrl('screen-strips')}
        />

        <div className="absolute bottom-[43%] left-[25.8%] z-10">
          <CanvasFrames
            fps={24}
            width={301}
            height={286}
            imgLocalPaths={questionMarkRotateMiniImgUrls}
          />
        </div>

        <div className="absolute inset-x-0 h-full w-full">
          <CanvasFrames
            fps={0.5}
            width={1716}
            height={1200}
            imgLocalPaths={[
              getFrameUrl('lights', 'light-1'),
              getFrameUrl('lights', 'light-2')
            ]}
          />
        </div>

        <div className="absolute bottom-[168px] left-[254px] h-[126px] w-[784px]">
          <Marquee
            speed={75}
            className="relative flex h-full w-full cursor-default items-center justify-center overflow-hidden whitespace-nowrap p-5 font-sdm text-[80px] text-yellow2">
            bitSmiley grand minting coming soon !!! bitSmiley grand minting
            coming soon !!!
          </Marquee>
        </div>

        <div className="absolute bottom-[248px] left-3 flex items-center gap-x-1.5 font-bold">
          <span>
            <Image src={getIconUrl('copyright')} />
          </span>
          <span className="cursor-default mix-blend-difference">
            bitSmiley team 2023
          </span>
        </div>

        <div className="absolute bottom-[248px] right-[34px] flex items-center gap-x-6 font-bold">
          <span
            className="cursor-pointer mix-blend-difference"
            onClick={() => window.open(LINKS.whitePaper, '__blank')}>
            [Whitepaper]
          </span>
          <span
            className="cursor-pointer text-green mix-blend-difference"
            onClick={() => window.open(LINKS.twitter, '__blank')}>
            [Twitter]
          </span>
          <span
            className="cursor-pointer text-green mix-blend-difference"
            onClick={() => window.open(LINKS.discord, '__blank')}>
            [Discord]
          </span>
        </div>

        <div className="absolute left-[834px] top-[380px] flex w-[398px] flex-col gap-y-6">
          <div className="flex flex-col gap-y-3">
            <div className="overflow-hidden whitespace-nowrap text-lg font-bold text-green">
              OVERVIEW------------------------------------------
            </div>
            <div className="flex items-center justify-between text-lg">
              <span>[NAME]</span>
              <span>SMILEY EXPRESS NERO</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span>[ISSUE]</span>
              <span>bitSmiley</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span>[AMOUNT]</span>
              <span>6000</span>
            </div>
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="overflow-hidden whitespace-nowrap text-lg font-bold text-green">
              STATS---------------------------------------------
            </div>
            <div className="flex items-center justify-between text-lg">
              <span>[NAME]</span>
              <span>????</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span>[UTILITY]</span>
              <span>????</span>
            </div>
          </div>
          <div className="flex items-center gap-x-2 text-lg font-bold text-green">
            <span>
              <Image src={getIconUrl('dot')} />
            </span>
            <span>MINING COMING SOON...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
