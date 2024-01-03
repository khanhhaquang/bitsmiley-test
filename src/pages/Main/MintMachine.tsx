import { CanvasFrames } from '@/components/CanvasFrames'
import { Image } from '@/components/Image'
import { Marquee } from '@/components/Marquee'
import Typewriter from '@/components/Typewriter'
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
    <div className="relative -mt-9 flex h-[1200px] items-center justify-center">
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
            fps={1}
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

        <div className="absolute left-[834px] top-[380px] flex w-[398px] flex-col gap-y-6">
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center whitespace-nowrap text-lg font-bold text-green">
              <Typewriter
                seq={0}
                nodes="OVERVIEW-----------------------------"
              />
            </div>
            <div className="flex items-center justify-between text-lg">
              <Typewriter seq={1} nodes="[NAME]" />
              <Typewriter seq={2} nodes="SMILEY EXPRESS NERO" />
            </div>
            <div className="flex items-center justify-between text-lg">
              <Typewriter seq={3} nodes="[ISSUE]" />
              <Typewriter seq={4} nodes="bitSmiley" />
            </div>
            <div className="flex items-center justify-between text-lg">
              <Typewriter seq={5} nodes="[AMOUNT]" />
              <Typewriter seq={6} nodes="6000" />
            </div>
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center whitespace-nowrap text-lg font-bold text-green">
              <Typewriter
                seq={7}
                nodes="STATS--------------------------------"
              />
            </div>
            <div className="flex items-center justify-between text-lg">
              <Typewriter seq={8} nodes="[NAME]" />
              <Typewriter seq={9} nodes="????" />
            </div>
            <div className="flex items-center justify-between text-lg">
              <Typewriter seq={10} nodes="[UTILITY]" />
              <Typewriter seq={11} nodes="????" />
            </div>
          </div>
          <div className="flex items-center text-lg font-bold text-green">
            <Typewriter
              seq={12}
              nodes={[
                <Image
                  src={getIconUrl('dot')}
                  className="mr-1.5 inline-block"
                />,
                'MINING COMING SOON...'
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
