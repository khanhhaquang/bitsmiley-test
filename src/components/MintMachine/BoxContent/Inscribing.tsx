import { getIsCreatingOrder, getTxId } from '@/store/account/reducer'
import { getBtcScanUrl } from '@/utils/formatter'
import { openUrl } from '@/utils/getAssetsUrl'
import { useSelector } from 'react-redux'
import { PlayerInfo } from './Common'

export const Inscribing: React.FC = () => {
  const txid = useSelector(getTxId)
  const isCreatingOrder = useSelector(getIsCreatingOrder)

  return (
    <>
      <PlayerInfo />

      <div className="absolute left-[468px] top-[444px] z-[100] text-sm">
        Your minting is getting processed on-chain...
        {!isCreatingOrder && txid && (
          <>
            (
            <span
              className="cursor-pointer text-green hover:underline"
              onClick={() => openUrl(getBtcScanUrl(txid))}>
              BTCScan
            </span>
            )
          </>
        )}
      </div>
    </>
  )
}
