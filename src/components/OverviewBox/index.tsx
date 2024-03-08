import './index.scss'
import { cn } from '@/utils/cn'
import { formatAmountThousands, formatDecimal } from '@/utils/formatter'
import { WarningOutline } from '@/assets/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
interface OverviewBoxObject {
  availableToMint?: number
  debtBitUSD?: number
  healthFactor?: number
  lockedCollateral?: number
  liquidationPrice?: number
  availableToWithdraw?: number
}

export const OverviewBox: React.FC<{
  liquidationValues?: number
  listData?: OverviewBoxObject
  afterDataInit: OverviewBoxObject
}> = ({ listData, afterDataInit, liquidationValues = 100 }) => {
  // const [isLiquidation, setLsLiquidation] = useState(false)
  let isLiquidation: boolean = false
  if (
    listData?.healthFactor !== undefined &&
    listData?.healthFactor <= liquidationValues &&
    listData?.healthFactor > 0
  ) {
    isLiquidation = true
  }

  return (
    <>
      <div className="mt-[10px]  px-[30px]">
        <div
          className={`flex flex-wrap items-center justify-between px-[30px] text-white`}>
          <div className="mt-[24px] w-[50%]">
            <p className="font-ibmr text-base">Liquidation Price</p>
            <h1
              className={cn(
                'mb-4 mt-1 whitespace-nowrap font-ppnb text-[72px] leading-[51px]',
                isLiquidation && 'text-red1'
              )}>
              $
              {listData?.liquidationPrice == 0
                ? ' -'
                : formatAmountThousands(
                    (listData?.liquidationPrice || 0).toString(),
                    2
                  )}
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center whitespace-nowrap bg-black pl-[8px] font-ibmr text-white">
              <Tooltip>
                <TooltipTrigger>
                  <span>
                    ${' '}
                    {afterDataInit.liquidationPrice == 0
                      ? ' - '
                      : formatAmountThousands(
                          (afterDataInit.liquidationPrice || 0).toString(),
                          2
                        )}
                    after ⓘ
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>
                    Collateral price below which your position will face
                    liquidation
                  </span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="mt-[24px] w-[50%] pl-[10px]">
            <p className="font-ibmr text-base">Health factor</p>
            <h1
              className={cn(
                'mb-4 mt-1 whitespace-nowrap font-ppnb text-[72px] leading-[51px]',
                isLiquidation && 'text-red1'
              )}>
              {formatDecimal((listData?.healthFactor || 0).toString(), 1)}%
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center whitespace-nowrap bg-black pl-[8px] font-ibmr text-white">
              <Tooltip>
                <TooltipTrigger>
                  <span>
                    {formatDecimal(
                      (afterDataInit.healthFactor || 0).toString(),
                      1
                    )}{' '}
                    after ⓘ
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Indicates the health status of an account. Any vaults that
                  drop below 1 face liquidation.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="mt-[24px] w-[50%]">
            <p className="font-ibmr text-base">Vault Debt</p>
            <h1
              className={cn(
                'mb-4 mt-1 whitespace-nowrap font-ppnb text-[72px] leading-[51px]',
                isLiquidation && 'text-red1'
              )}>
              $
              {formatAmountThousands((listData?.debtBitUSD || 0).toString(), 4)}
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center whitespace-nowrap bg-black pl-[8px] font-ibmr text-white">
              <Tooltip>
                <TooltipTrigger>
                  <span>
                    ${' '}
                    {formatAmountThousands(
                      (afterDataInit?.debtBitUSD || 0).toString(),
                      4
                    )}
                    after ⓘ
                  </span>
                </TooltipTrigger>
                <TooltipContent>bitUSD debt + Stability Fee</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {isLiquidation && (
          <div className=" absolute bottom-[138px] left-[50%] flex w-[500px] translate-x-[-50%] rounded-[10px] bg-red1 px-[12px] py-[8px]">
            <WarningOutline className=" text-[42px]" />
            <span className="flex-1 text-center font-ibmb text-[16px] text-white">
              This wallet is in the process of liquidation. Repay or deposit BTC
              to avoid liquidation
            </span>
          </div>
        )}

        <div
          className={`mt-[20px] flex items-start justify-center text-white/[.7]`}>
          <div className="mt-[24px]">
            <p className="whitespace-nowrap font-ibmr text-[14px]">
              Collateral locked
            </p>
            <h1
              className={cn(
                'mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]',
                isLiquidation && 'text-red1'
              )}>
              {formatAmountThousands(
                (listData?.lockedCollateral || 0).toString(),
                4
              )}
              BTC
            </h1>
            <div
              className={cn(
                'relative flex h-[31px] min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white'
                //, listData?.healthFactor <= liquidationValues && 'text-red1'
              )}>
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
            <h1
              className={cn(
                'mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]',
                isLiquidation && 'text-red1'
              )}>
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
            <h1
              className={cn(
                'mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]',
                isLiquidation && 'text-red1'
              )}>
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
