import { DotIcon } from '@/assets/icons'
import Typewriter from '@/components/Typewriter'
import { CanvasFrames } from '@/components/CanvasFrames'
import { getFrameUrl } from '@/utils/getAssetsUrl'

export const Promotion: React.FC = () => {
  return (
    <>
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
                <Typewriter
                  seq={2}
                  renderNodes={() => 'SMILEY EXPRESS BITDISC'}
                />
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
          wrapperClassName="font-bold text-green"
          seq={12}
          renderNodes={() => [
            <DotIcon className="mr-1.5" />,
            'MINTING COMING SOON...'
          ]}
        />
      </div>
    </>
  )
}
