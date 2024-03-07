import './index.scss'
import { formatAmountThousands, formatDecimal } from '@/utils/formatter'

interface OverviewBoxObject {
  availableToMint?: number
  debtBitUSD?: number
  healthFactor?: number
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
              $
              {listData?.liquidationPrice == 0
                ? ' -'
                : formatAmountThousands(
                    (listData?.liquidationPrice || 0).toString(),
                    2
                  )}
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center whitespace-nowrap bg-black pl-[8px] font-ibmr text-white">
              ${' '}
              {afterDataInit.liquidationPrice == 0
                ? ' - '
                : formatAmountThousands(
                    (afterDataInit.liquidationPrice || 0).toString(),
                    2
                  )}
              after ⓘ
            </div>
          </div>
          <div className="mt-[24px] w-[50%] pl-[10px]">
            <p className="font-ibmr text-base">Health factor</p>
            <h1 className="mb-4 mt-1 whitespace-nowrap font-ppnb text-[72px] leading-[51px]">
              {formatDecimal((listData?.healthFactor || 0).toString(), 1)}%
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center whitespace-nowrap bg-black pl-[8px] font-ibmr text-white">
              {formatDecimal((afterDataInit.healthFactor || 0).toString(), 1)} %
              afterⓘ
            </div>
          </div>
          <div className="mt-[24px] w-[50%]">
            <p className="font-ibmr text-base">Vault Debt</p>
            <h1 className="mb-4 mt-1 whitespace-nowrap font-ppnb text-[72px] leading-[51px]">
              $
              {formatAmountThousands((listData?.debtBitUSD || 0).toString(), 4)}
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center whitespace-nowrap bg-black pl-[8px] font-ibmr text-white">
              ${' '}
              {formatAmountThousands(
                (afterDataInit?.debtBitUSD || 0).toString(),
                4
              )}
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
              {formatAmountThousands(
                (listData?.lockedCollateral || 0).toString(),
                4
              )}
              BTC
            </h1>
            <div className="relative flex h-[31px] min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatAmountThousands(
                (afterDataInit.lockedCollateral || 0).toString(),
                4
              )}
              after
            </div>
          </div>
          <div className="mt-[24px] pl-[18px] pr-[18px]">
            <p className="whitespace-nowrap font-ibmr text-[14px]">
              Available to withdraw
            </p>
            <h1 className="mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]">
              {formatAmountThousands(
                (listData?.availableToWithdraw || 0).toString(),
                4
              )}
              BTC
            </h1>
            <div className="relative flex h-[31px] w-auto min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatAmountThousands(
                (afterDataInit.availableToWithdraw || 0).toString(),
                4
              )}
              after
            </div>
          </div>
          <div className="mt-[24px]">
            <p className="whitespace-nowrap font-ibmr text-[14px]">
              Available to mint
            </p>
            <h1 className="mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]">
              {formatAmountThousands(
                (listData?.availableToMint || 0).toString(),
                2
              )}
              bitUSD
            </h1>
            <div className="relative flex h-[31px] min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatAmountThousands(
                (afterDataInit.availableToMint || '0').toString(),
                2
              )}
              after
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
