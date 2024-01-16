import { useMemo, useState } from 'react'
import { ArrowDownIcon } from '@/assets/icons'
import { CanvasFrames } from '@/components/CanvasFrames'
import { Image } from '@/components/Image'
import { Marquee } from '@/components/Marquee'
import { cn } from '@/utils/cn'
import { getFrameUrl, getIllustrationUrl } from '@/utils/getAssetsUrl'
import { BoxContent } from './BoxContent'
import { NumberPad } from './NumberPad'
import { CardComingOut } from './CardComingOut'
import { MintButton } from './MintButton'
import { AccountStatus } from '@/types/status'
import { useSelector } from 'react-redux'
import { getIsConnected } from '@/store/account/reducer'
import { getLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'

const isInscribed = false

const enableInscribe = getLocalStorage(LOCAL_STORAGE_KEYS.ENABLE_INSCRIBE)
const isPartyStarted = enableInscribe === 'true'

export const MintMachine: React.FC<{ hideScrollDown: boolean }> = ({
  hideScrollDown
}) => {
  const isConnected = useSelector(getIsConnected)

  const [isInscribing, setIsInscribing] = useState(false)
  const [isNotInscribed, setIsNotInscribed] = useState(true)
  const [isPlayingCardComingout, setIsPlayingCardComingout] = useState(false)

  const status = useMemo(() => {
    if (!isPartyStarted) return AccountStatus.PartyNotStarted
    if (!isConnected) return AccountStatus.PartyStartedNotConnected
    if (isNotInscribed) return AccountStatus.NotInscribed
    if (isInscribing) return AccountStatus.Inscribing
    if (isInscribed) return AccountStatus.Inscribed
    return AccountStatus.PartyNotStarted
  }, [isConnected, isInscribing, isNotInscribed])

  const isMintButtonEnabled = status === AccountStatus.NotInscribed

  const onMintButtonSuccess = () => {
    setIsNotInscribed(false)
    setIsInscribing(true)
    setIsPlayingCardComingout(true)
  }

  return (
    <div className="relative mt-[19px] flex h-[995px] w-[1423px] shrink-0 items-center justify-center">
      <StaticMachine />
      <Lights />
      <MarqueeText />
      <NumberPad onClick={() => setIsPlayingCardComingout(true)} />
      <BoxContent status={status} />
      <CardComingOut playing={isPlayingCardComingout} />
      <MintButton
        enabled={isMintButtonEnabled}
        onInscribe={onMintButtonSuccess}
      />
      <ArrowDown hideScrollDown={hideScrollDown} />
    </div>
  )
}

const MarqueeText: React.FC = () => {
  return (
    <div className="absolute bottom-[139px] left-[205px] h-[104px] w-[660px]">
      <Marquee
        speed={75}
        className="relative flex size-full cursor-default items-center justify-center overflow-hidden whitespace-nowrap p-5 font-sdm text-[80px] text-yellow2">
        bitSmiley grand minting coming soon !!! bitSmiley grand minting coming
        soon !!!
      </Marquee>
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
