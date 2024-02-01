import { MEDIA } from '@/config/links'
import { useStoreActions } from '@/hooks/useStoreActions'
import { useUserInfo } from '@/hooks/useUserInfo'
import { getUserNfts } from '@/store/account/reducer'
import { cn } from '@/utils/cn'
import { openUrl } from '@/utils/getAssetsUrl'
import { useSelector } from 'react-redux'
import { DearBitSmiler } from './Common'

export const MintingEnded: React.FC = () => {
  const userNfts = useSelector(getUserNfts)
  const { isConnected } = useUserInfo()
  const { setIsOpenHistory } = useStoreActions()

  const connectedAndHasHistory = userNfts.length && isConnected

  const renderConnectedAndHasHistory = () => {
    return (
      <div className="absolute left-1/2 top-[525px] -translate-x-1/2">
        <div
          onClick={() => setIsOpenHistory(true)}
          className={cn(
            'relative inline-block bg-white cursor-pointer text-black px-3 py-1 font-bold whitespace-nowrap text-[15px] hover:bg-blue3',
            'shadow-take-bitdisc-button hover:shadow-take-bitdisc-button-hover active:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:bg-blue'
          )}>
          CHECK INSCRIPTION HISTORY
        </div>
      </div>
    )
  }

  const renderNotConnected = () => {
    return (
      <div className="absolute left-1/2 top-[521px] w-[375px] -translate-x-1/2 text-center font-psm text-sm">
        You were a bit late this time.Stay tuned for more exciting things
        incoming!
        <div>
          <span className="text-green" onClick={() => openUrl(MEDIA.twitter)}>
            [<span className="cursor-pointer hover:underline">Twitter</span>
            <span />]
          </span>{' '}
          <span className="text-green" onClick={() => openUrl(MEDIA.discord)}>
            [<span className="cursor-pointer hover:underline">Discord</span>
            <span />]
          </span>
        </div>
      </div>
    )
  }

  return (
    <>
      <DearBitSmiler />

      <div className="absolute left-1/2 top-[436px] -translate-x-1/2 text-sm">
        bitDisc minting session has finished.
      </div>

      {connectedAndHasHistory
        ? renderConnectedAndHasHistory()
        : renderNotConnected()}
    </>
  )
}
