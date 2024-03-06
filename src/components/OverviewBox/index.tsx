import './index.scss'
import { formatDecimal, formatMoney } from '@/utils/formatter'

interface OverviewBoxObject {
  availableToMint?: number
  debtBitUSD?: number
  collateralRate?: number
  lockedCollateral?: number
  liquidationPrice?: number
  availableToWithdraw?: number
}

export const OverviewBox: React.FC<{
  listData?: OverviewBoxObject
  afterDataInit: OverviewBoxObject
}> = ({ listData, afterDataInit }) => {
  return (
    <>
      <div className="mt-[10px]  px-[30px]">
        <div
          className={`flex flex-wrap items-center justify-between px-[30px] text-white`}>
          <div className="mt-[24px] w-[50%]">
            <p className="font-ibmr text-base">Liquidation Price</p>
            <h1 className="mb-4 mt-1 whitespace-nowrap font-ppnb text-[72px] leading-[51px]">
              ${formatMoney(formatDecimal(listData?.liquidationPrice || 0, 2))}
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center whitespace-nowrap bg-black pl-[8px] font-ibmr text-white">
              ${' '}
              {formatMoney(
                formatDecimal(afterDataInit.liquidationPrice || 0, 2)
              )}{' '}
              after ⓘ
            </div>
          </div>
          <div className="mt-[24px] w-[50%] pl-[10px]">
            <p className="font-ibmr text-base">Health factor</p>
            <h1 className="mb-4 mt-1 whitespace-nowrap font-ppnb text-[72px] leading-[51px]">
              {formatDecimal(listData?.collateralRate || 0, 2)} %
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center whitespace-nowrap bg-black pl-[8px] font-ibmr text-white">
              {formatDecimal(afterDataInit.collateralRate || 0, 2)}% after ⓘ
            </div>
          </div>
          <div className="mt-[24px] w-[50%]">
            <p className="font-ibmr text-base">Vault Debt</p>
            <h1 className="mb-4 mt-1 whitespace-nowrap font-ppnb text-[72px] leading-[51px]">
              ${formatMoney(formatDecimal(listData?.debtBitUSD || 0, 4))}
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center whitespace-nowrap bg-black pl-[8px] font-ibmr text-white">
              $ {formatMoney(formatDecimal(afterDataInit.debtBitUSD || 0, 4))}{' '}
              after ⓘ
            </div>
          </div>
        </div>

        <div
          className={`mt-[20px] flex items-start justify-center text-white/[.7]`}>
          <div className="mt-[24px]">
            <p className="whitespace-nowrap font-ibmr text-[14px]">
              Collateral locked
            </p>
            <h1 className="mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]">
              {' '}
              {formatMoney(
                formatDecimal(listData?.lockedCollateral || 0, 4)
              )}{' '}
              BTC
            </h1>
            <div className="relative flex h-[31px] min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatMoney(
                formatDecimal(afterDataInit.lockedCollateral || 0, 4)
              )}{' '}
              after
            </div>
          </div>
          <div className="mt-[24px] pl-[18px] pr-[18px]">
            <p className="whitespace-nowrap font-ibmr text-[14px]">
              Available to withdraw
            </p>
            <h1 className="mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]">
              {' '}
              {formatMoney(
                formatDecimal(listData?.availableToWithdraw || 0, 4)
              )}{' '}
              BTC
            </h1>
            <div className="relative flex h-[31px] w-auto min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatMoney(
                formatDecimal(afterDataInit.availableToWithdraw || 0, 4)
              )}{' '}
              after
            </div>
          </div>
          <div className="mt-[24px]">
            <p className="whitespace-nowrap font-ibmr text-[14px]">
              Available to mint
            </p>
            <h1 className="mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]">
              {' '}
              {formatMoney(
                formatDecimal(listData?.availableToMint || 0, 4)
              )}{' '}
              bitUSD
            </h1>
            <div className="relative flex h-[31px] min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatMoney(
                formatDecimal(afterDataInit.availableToMint || 0, 4)
              )}{' '}
              after
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
