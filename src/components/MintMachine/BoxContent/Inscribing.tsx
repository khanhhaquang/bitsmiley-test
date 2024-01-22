import { AsteriskIcon } from '@/assets/icons'
import { getIsCreatingOrder, getTxId } from '@/store/account/reducer'
import { getBtcScanUrl } from '@/utils/formatter'
import { openUrl } from '@/utils/getAssetsUrl'
import { useSelector } from 'react-redux'

export const Inscribing: React.FC = () => {
  const txid = useSelector(getTxId)
  const isCreatingOrder = useSelector(getIsCreatingOrder)

  return (
    <>
      <div className="absolute left-[485px] top-[321px] flex items-center gap-x-[5px]">
        <AsteriskIcon />
        <span className="font-smb text-sm">------ Dear BitSmiler ------</span>
        <AsteriskIcon />
      </div>

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
