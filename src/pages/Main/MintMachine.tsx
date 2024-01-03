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
    <div className="relative mt-[19px] flex h-[995px] w-[1423px] items-center justify-center">
      <div className="relative flex h-[995px] w-[1423px] shrink-0 items-center justify-center">
        <Image
          className="absolute h-[995px] w-[1423px] shrink-0"
          src={getIllustrationUrl('machine-static')}
        />

        <div className="absolute bottom-[428px] left-[367px] z-10">
          <CanvasFrames
            fps={24}
            width={250}
            height={237}
            imgLocalPaths={questionMarkRotateMiniImgUrls}
          />
        </div>

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

        <div className="absolute bottom-[428px] left-[692px] flex h-[237px] flex-col gap-y-5 text-sm">
          <div className="flex flex-col gap-y-2.5">
            <div className="flex items-center whitespace-nowrap font-bold text-green">
              <Typewriter
                seq={0}
                nodes="OVERVIEW---------------------------"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-2.5">
                <div className="h-5">
                  <Typewriter seq={1} nodes="[NAME]" />
                </div>
                <div className="h-5">
                  <Typewriter seq={3} nodes="[ISSUE]" />
                </div>
                <div className="h-5">
                  <Typewriter seq={5} nodes="[AMOUNT]" />
                </div>
              </div>

              <div className="flex flex-col gap-y-2.5">
                <div className="h-5 w-40">
                  <Typewriter seq={2} nodes="SMILEY EXPRESS NERO" />
                </div>
                <div className="h-5 w-40">
                  <Typewriter seq={4} nodes="bitSmiley" />
                </div>
                <div className="h-5 w-40">
                  <Typewriter seq={6} nodes="6000" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-2.5">
            <div className="flex items-center whitespace-nowrap font-bold text-green">
              <Typewriter
                seq={7}
                nodes="STATS------------------------------"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-2.5">
                <div className="h-5">
                  <Typewriter seq={8} nodes="[NAME]" />
                </div>
                <div className="h-5">
                  <Typewriter seq={10} nodes="[UTILITY]" />
                </div>
              </div>

              <div className="flex flex-col gap-y-2.5">
                <span className="h-5 w-40">
                  <Typewriter seq={9} nodes="????" />
                </span>
                <span className="h-5 w-40">
                  <Typewriter seq={11} nodes="????" />
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center font-bold text-green">
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

        <div className="absolute bottom-[139px] left-[205px] h-[104px] w-[660px]">
          <Marquee
            speed={75}
            className="relative flex h-full w-full cursor-default items-center justify-center overflow-hidden whitespace-nowrap p-5 font-sdm text-[80px] text-yellow2">
            bitSmiley grand minting coming soon !!! bitSmiley grand minting
            coming soon !!!
          </Marquee>
        </div>
      </div>
    </div>
  )
}
