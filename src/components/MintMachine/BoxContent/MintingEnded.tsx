import { AsteriskIcon } from '@/assets/icons'
import { MEDIA } from '@/config/links'
import { useStoreActions } from '@/hooks/useStoreActions'
import { useUserInfo } from '@/hooks/useUserInfo'
import { getUserNfts } from '@/store/account/reducer'
import { cn } from '@/utils/cn'
import { openUrl } from '@/utils/getAssetsUrl'
import { useSelector } from 'react-redux'

export const MintingEnded: React.FC = () => {
  const userNfts = useSelector(getUserNfts)
  const { isConnected } = useUserInfo()
  const { setIsOpenHistory } = useStoreActions()

  const connectedAndHasHistory = userNfts.length && isConnected

  const renderConnectedAndHasHistory = () => {
    return (
      <div className="absolute left-[565px] top-[525px]">
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
      <div className="absolute left-[509px] top-[521px] w-[375px] text-center font-psm text-sm">
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
      <div className="absolute left-[520px] top-[338px] flex items-center gap-x-[5px]">
        <AsteriskIcon />
        <span className="font-smb text-sm">--- Dear BitSmiler ---</span>
        <AsteriskIcon />
      </div>

      <div className="absolute left-[531px] top-[436px] text-sm">
        bitDisc minting session has finished.
      </div>

      {connectedAndHasHistory
        ? renderConnectedAndHasHistory()
        : renderNotConnected()}
    </>
  )
}
