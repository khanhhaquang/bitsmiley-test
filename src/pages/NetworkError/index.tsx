import { Link } from 'react-router-dom'

import { HeaderIcon } from '@/assets/icons'
import { CanvasFrames } from '@/components/CanvasFrames'
import { CopyRightAndLinks } from '@/components/CopyRightAndLinks'
import { getFrameUrl } from '@/utils/getAssetsUrl'

const NetworkError: React.FC = () => {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black bg-loading bg-cover bg-center bg-no-repeat">
      <div className="absolute left-0 top-[50px] z-50 flex w-full  items-center justify-between px-12 text-white sm:justify-center">
        <Link to="/">
          <HeaderIcon />
        </Link>
      </div>
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
