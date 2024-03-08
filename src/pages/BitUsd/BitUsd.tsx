import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TitleBox } from '@/components/Title'
import { LinkOutIcon } from '@/assets/icons'
import { useUserInfo } from '@/hooks/useUserInfo'
import { vaultsInfoService } from '@/services/vaultsInfo'
import { useChainId } from 'wagmi'
import { WEBSITE } from '@/config/links'
import { openUrl, getOpenUrl } from '@/utils/getAssetsUrl'
import { cn } from '@/utils/cn'
import { formatDecimal } from '@/utils/formatter'
import { Image } from '@/components/Image'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface Vault {
  isOpenVault: boolean
  network: string
  maxLTV: number
  borrowRate: number
  vaultFloor: number
  liquidity: number
  chainId: number
  collateralRatio: number
  collateralLocked: number
  totalDebt: number
}

const BitUsd: React.FC = () => {
  const navigate = useNavigate()
  const { address, isConnected } = useUserInfo()
  const chainId = useChainId()
  const [mintingPairs, setMintingPairs] = useState<Vault[]>([])
  const [myVaults, setMyVaults] = useState<Vault[]>([])

  const getMintingPairs = async () => {
    if (address && isConnected) {
      try {
        const data =
          await vaultsInfoService.getMintingPairsRequest.call(address)
        const array1: Array<Vault> = [],
          array2: Array<Vault> = []
        data.data.forEach((v: Vault) => {
          v.isOpenVault ? array1.push(v) : array2.push(v)
        })
        setMyVaults(array1)
        setMintingPairs(array2)
      } catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    getMintingPairs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goToMyVaults = async (item: Vault) => {
    if (item.chainId === chainId) {
      navigate(`./my-vault/${chainId}`)
    }
  }
  const goToOpenVault = async (item: Vault) => {
    if (item.chainId === chainId) {
      navigate(`./vault/${chainId}`)
    }
  }

  return (
    <div>
      <div>
        {myVaults.length > 0 && (
          <>
            <div className="mx-auto mt-[164px] max-w-[1434px]">
              <TitleBox message="My Vaults" isWhite={true} />
            </div>
            <MyVaults
              list={myVaults}
              handleClick={(item: Vault) => goToMyVaults(item)}
            />
          </>
        )}
        {mintingPairs.length > 0 && (
          <>
            <div className=" mx-auto mt-[164px] max-w-[1434px]">
              <TitleBox message="Available Minting Pairs" />
            </div>
            <AvailableMintingPairs
              list={mintingPairs}
              handleClick={(item: Vault) => goToOpenVault(item)}
            />
          </>
        )}
        <p className="mb-[177px] mt-[194px] flex justify-center text-white/5">
          More assets coming soon...
        </p>
      </div>
    </div>
  )
}

const AvailableMintingPairs: React.FC<{
  list: Vault[]
  handleClick: (item: Vault) => void
}> = ({ list, handleClick }) => {
  const renderedItems = list.map(
    (item: Vault, index: number) =>
      !item.isOpenVault && (
        <dd className="border-b-2 border-dashed border-white/50" key={index}>
          <ul
            className={cn('flex items-center px-3 py-6 font-ibmr text-white')}>
            <li className="w-[140px] whitespace-nowrap">
              {item.network == 'Merlin'
                ? 'wBTC1 - bitUSD'
                : index == 0
                  ? 'wBTC2 - bitUSD'
                  : `wBTC${index + 1} - bitUSD`}
            </li>
            <li
              className={cn(
                'flex flex-1 items-center justify-end gap-x-1.5 text-right cursor-pointer'
              )}
              onClick={() =>
                item.network == 'Merlin' && openUrl(WEBSITE.merlinchain)
              }>
              {item.network} <LinkOutIcon />
            </li>
            <li className="flex-1 text-right">{item.maxLTV * 100}%</li>
            <li className="flex-1 text-right">{item.borrowRate * 100}%</li>
            <li className="flex-1 text-right ">{item.vaultFloor} $</li>
            <li className="flex-1 text-right">{item.liquidity} BTC</li>
            <li className="ml-[50] flex-1 text-right">
              <button
                className="h-[34px] w-[133px] bg-white font-ibmb text-gray-950"
                onClick={() => handleClick(item)}>
                Mint BitUSD
              </button>
            </li>
          </ul>
        </dd>
      )
  )

  return (
    <>
      <div className="">
        <dl className="mx-auto mt-[50px] max-w-[1220px]">
          <dt className="border-b-2 border-dashed border-white/50 pb-[24px]">
            <ul className="flex justify-between font-ibmb [&>li]:text-white/70">
              <li className="w-[140px]"></li>
              <li className="flex-1 text-right">Network</li>
              <li className="flex-1 text-right">
                <Tooltip>
                  <TooltipTrigger>
                    <span>Max LTV ⓘ</span>
                  </TooltipTrigger>
                  <TooltipContent>Max Loan to Value Ratio</TooltipContent>
                </Tooltip>
              </li>
              <li className="flex-1 text-right">
                <Tooltip>
                  <TooltipTrigger>
                    <span>Borrow rate ⓘ</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    The annual borrow rate for vaults, calculated based on your
                    outstanding vault debt.
                  </TooltipContent>
                </Tooltip>
              </li>
              <li className="flex-1 text-right">Vault floor ⓘ</li>
              <li className="flex-1 text-right">
                <Tooltip>
                  <TooltipTrigger>
                    <span>Liquidity ⓘ</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Amount of bitUSD available to be generated from BTC
                    according the global protocol debt ceiling
                  </TooltipContent>
                </Tooltip>
              </li>
              <li className="ml-[50] flex-1 text-center"></li>
            </ul>
          </dt>
          {renderedItems}
        </dl>
      </div>
    </>
  )
}

const MyVaults: React.FC<{
  list: Array<Vault>
  handleClick: (item: Vault) => void
}> = ({ list, handleClick }) => {
  const renderedItems = list.map(
    (item: Vault, index: number) =>
      item.isOpenVault && (
        <dd
          className="relative border-b-2 border-dashed border-white/50"
          key={index}>
          <ul className="flex items-center px-[12px] py-[24px] font-ibmr text-white">
            <li className="flex-1">
              {item.network == 'Merlin'
                ? 'wBTC1 - bitUSD'
                : index == 0
                  ? 'wBTC2 - bitUSD'
                  : `wBTC${index + 1} - bitUSD`}
            </li>
            <li
              className={cn(
                'flex flex-1 items-center justify-center text-center cursor-pointer'
              )}
              onClick={() =>
                item.network == 'Merlin' && openUrl(WEBSITE.merlinchain)
              }>
              {item.network} <LinkOutIcon />
            </li>
            <li className="mr-[10px] flex-1 text-right">
              {item.collateralRatio * 100}%
            </li>
            <li className="mr-[10px] flex-1 text-right">
              {formatDecimal(item.collateralLocked, 4)} BTC
            </li>
            <li className="mr-[10px] flex-1 text-right">{item.totalDebt} $</li>
            <li className="flex-1 text-right">
              <button
                className="h-[34px] w-[133px] bg-white font-ibmb text-gray-950"
                onClick={() => handleClick(item)}>
                Enter Vault
              </button>
            </li>
          </ul>
          {item.collateralRatio <= 1 && item.collateralRatio > 0 && (
            <div className="absolute bottom-1 flex items-center font-ibmr text-[14px]">
              <Image
                src={getOpenUrl('warning')}
                className="mr-[8px] w-[24px]"
              />
              <span className="text-red1">
                This wallet is in the process of liquidation. Repay or deposit
                BTC to avoid liquidation
              </span>
            </div>
          )}
        </dd>
      )
  )

  return (
    <div>
      <dl className="mx-auto mt-[50px] max-w-[1220px] ">
        <dt className="border-b-2 border-dashed border-white/50 pb-[24px]">
          <ul className="flex justify-between font-ibmb [&>li]:text-white/70">
            <li className="flex-1"></li>
            <li className="flex-1 text-center">Network</li>
            <li className="mr-[10px] flex-1 text-right">Health Factor ⓘ</li>
            <li className="mr-[10px] flex-1 text-right">Collateral Locked</li>
            <li className="mr-[10px] flex-1 text-right">Total Debt ⓘ </li>
            <li className="w-64 flex-1 text-center"></li>
          </ul>
        </dt>
        {renderedItems}
      </dl>
    </div>
  )
}

export default BitUsd