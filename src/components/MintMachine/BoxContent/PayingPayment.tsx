import { AsteriskIcon } from '@/assets/icons'

export const PayingPayment: React.FC = () => {
  return (
    <>
      <div className="absolute left-[484px] top-[320px] flex items-center justify-between gap-x-[5px] whitespace-nowrap">
        <AsteriskIcon className="shrink-0" />
        <div className="font-smb text-sm">------ Dear BitSmiler ------</div>
        <AsteriskIcon className="shrink-0" />
      </div>

      <div className="absolute left-[468px] top-[444px] text-sm">
        Your payment is getting processed on-chain...[
        <span className="cursor-pointer text-green hover:underline">
          BTCScan
        </span>
        ]
      </div>
    </>
  )
}
