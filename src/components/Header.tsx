import { HeaderIcon } from '@/assets/icons'
import { useWindowSize } from '@/hooks/useWindowSize'
import { ConnectWallet } from './ConnectWallet'

export const Header: React.FC<{ wallet?: boolean }> = ({ wallet }) => {
  const { width } = useWindowSize()
  return (
    <div
      className="absolute left-0 top-[50px] z-50 flex w-screen origin-top items-start justify-between text-white"
      style={{
        padding: `0 ${width >= 1920 ? 136 : (136 / 1920) * width}px`
      }}>
      <HeaderIcon
        onClick={() => window.location.reload()}
        className="origin-top-left cursor-pointer"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}
      />

      {!!wallet && (
        <ConnectWallet
          className="origin-top-right"
          style={{
            scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
          }}
        />
      )}
    </div>
  )
}
