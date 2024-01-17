import { AsteriskIcon } from '@/assets/icons'
import { getTxId } from '@/store/account/reducer'
import { getBtcScanUrl } from '@/utils/formatter'
import { useSelector } from 'react-redux'

export const Inscribing: React.FC = () => {
  const txid = useSelector(getTxId)

  return (
    <>
      <div className="absolute left-[485px] top-[321px] flex items-center gap-x-[5px]">
        <AsteriskIcon />
        <span className="font-smb text-sm">------ Dear BitSmiler ------</span>
        <AsteriskIcon />
      </div>

      <div className="absolute left-[468px] top-[444px] z-[100] text-sm">
        Your payment is getting processed on-chain...(
        <span
          className="cursor-pointer text-green hover:underline"
          onClick={() => window.open(getBtcScanUrl(txid), '__blank')}>
          BTCScan
        </span>
        )
      </div>
    </>
  )
}
