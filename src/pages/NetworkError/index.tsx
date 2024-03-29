import { CanvasFrames } from '@/components/CanvasFrames'
import { CopyRightAndLinks } from '@/components/CopyRightAndLinks'
import { Header } from '@/components/Header'
import { getFrameUrl } from '@/utils/getAssetsUrl'

const NetworkError: React.FC = () => {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black bg-loading bg-cover bg-center bg-no-repeat">
      <Header />
      <CopyRightAndLinks musicControl={false} />
      <div className="flex flex-col items-center justify-center">
        <div className="mb-5">
          <CanvasFrames
            fps={3}
            width={189}
            height={192}
            imgLocalPaths={Array(3)
              .fill(1)
              .map((_, idx) =>
                getFrameUrl('network-error', `network-error-${idx + 1}`)
              )}
          />
        </div>
        <div className="text-2xl uppercase text-green">system busy...</div>
        <div className="mt-[30px] max-w-[398px] text-center text-sm leading-tight text-white">
          We are handling too many request, come back shortly or refresh the
          page in a moment.
        </div>
      </div>
    </div>
  )
}

export default NetworkError
