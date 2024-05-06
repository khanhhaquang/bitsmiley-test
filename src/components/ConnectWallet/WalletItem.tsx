import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

const WalletItem: React.FC<{
  connect: () => void
  name: string
  iconName: string
}> = ({ connect, name, iconName }) => {
  return (
    <div className="relative h-[58px] w-full px-2">
      <button
        className="flex size-full items-center gap-x-3 border-y-2  border-white bg-black py-2.5 pl-5"
        onClick={connect}>
        <Image
          src={getIllustrationUrl(iconName)}
          className="aspect-square size-7"
        />
        <svg
          className="absolute left-0"
          width="10"
          height="56"
          viewBox="0 0 10 58"
          fill="none">
          <path d="M5 0H10V58H5V53H0V5H5V0Z" fill="currentColor" />
        </svg>
        <svg
          className="absolute right-0"
          width="10"
          height="56"
          viewBox="0 0 10 58"
          fill="none">
          <path
            d="M10 53V5H5.00037V0H0V58H5.00037V53H10Z"
            fill="currentColor"
          />
        </svg>
        <span className="font-psm text-2xl">{name}</span>
      </button>
    </div>
  )
}

export default WalletItem
