import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import isMobile from 'ismobilejs'
import { MobilePage } from '@/pages/Main/MobilePage'
import { Header } from '@/components/Header'
import { TitleBox } from '@/components/Title'
import { setLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { AkarIconslinkOutIcon } from '@/assets/icons'
import { useUserInfo } from '@/hooks/useUserInfo'
import {
  utilsGetNetwork,
  networkChange,
  getChainId,
  connectWallet,
  getWalletAddress
} from '@/ethersConnect'
import { vaultsInfoService } from '@/services/vaultsInfo'
import Tooltip from '@/components/Tooltip'
import './index.scss'

interface Vault {
  isOpenVault: boolean
  network: string
  maxLTV: number
  borrowRate: number
  minSize: number
  liquidity: number
  chainId: number
  collateralRatio: number
  collateralLocked: number
  totalDebt: number
}

const MainNet: React.FC = () => {
  const { address, isConnected } = useUserInfo()
  console.log(address, isConnected)
  const navigate = useNavigate()

  const [mintingPairsInfo, setMintingPairsInfo] = useState<Array<Vault>>([])
  const [myVaultsList, setmyVaultsList] = useState<Array<Vault>>([])
  setLocalStorage(LOCAL_STORAGE_KEYS.PLAY_MUSIC, 'false')

  // const queryClient = useQueryClient()
  // const handleAccountChanged = useCallback(
  //   (newAccountInfo: IAccountInfo | null, loginType: LoginTypeEnum) => {
  //     if (!newAccountInfo) {
  //       resetStorage()
  //       clearLoginType()
  //       // clearConfirmedMinted()
  //       return
  //     }

  //     resetStorage()
  //     queryClient.clear()
  //     setAccountInfo(newAccountInfo)
  //     setLoginType(loginType)
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [resetStorage, setAccountInfo, setLoginType]
  // )

  const projectFun = async () => {
    try {
      const a = await getWalletAddress()
      console.log('---->', a)
      if (a.length == 0) {
        connectWallet()
      }
      const { data } = await vaultsInfoService.getMintingPairsInfo.call(a[0])
      console.log(data.data)
      const array1: Array<Vault> = [],
        array2: Array<Vault> = []
      data.data.forEach((v: Vault) => {
        v.isOpenVault ? array1.push(v) : array2.push(v)
      })
      setmyVaultsList(array1)
      setMintingPairsInfo(array2)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    projectFun()
  }, [])

  const navigateowernPage = async (item: Vault) => {
    console.log(item)
    setLocalStorage(LOCAL_STORAGE_KEYS.NETWORKINFO, JSON.stringify(item))
    const network = await getChainId()
    if (item.chainId != network.chainId) {
      const id = await utilsGetNetwork(item.chainId)
      networkChange(parseInt(id))
    } else {
      navigate('/my-vault')
    }
  }
  const navigatePage = async (item: Vault) => {
    console.log(item)
    setLocalStorage(LOCAL_STORAGE_KEYS.NETWORKINFO, JSON.stringify(item))
    const network = await getChainId()
    console.log(network.chainId)
    if (item?.chainId != network?.chainId) {
      const id = await utilsGetNetwork(item?.chainId)
      console.log(id)
      networkChange(Number(id))
    } else {
      navigate('/OpenVault')
    }
  }
  if (isMobile(window.navigator).any) return <MobilePage />
  return (
    <div>
      <Header wallet />
      <div>
        {myVaultsList.length > 0 && (
          <>
            <div className=" mx-auto mt-[164px] max-w-[1434px]">
              <TitleBox message="My Vaults" isWhite={true} />
            </div>
            <MyVaults
              list={myVaultsList}
              handleClick={(item: Vault) => navigateowernPage(item)}
            />
          </>
        )}
        {mintingPairsInfo.length > 0 && (
          <>
            <div className=" mx-auto mt-[164px] max-w-[1434px]">
              <TitleBox message="Available Minting Pairs" />
            </div>
            <AvailableMintingPairs
              list={mintingPairsInfo}
              handleClick={(item: Vault) => navigatePage(item)}
            />
          </>
        )}
        <p className="mb-[177px] mt-[194px] flex justify-center text-[rgba(255,255,255,.5)]">
          More assets coming soon...
        </p>
      </div>
    </div>
  )
}

const AvailableMintingPairs: React.FC<{
  list: Array<Vault>
  handleClick: (item: Vault) => void
}> = ({ list, handleClick }) => {
  const renderedItems = list.map((item: Vault, index: number) =>
    !item.isOpenVault ? (
      <dd className="border-b-2 border-dashed border-white/50" key={index}>
        <ul className=" flex items-center px-[12px] py-[24px] font-ibmr text-white">
          <li className=" w-[140px] whitespace-nowrap">
            {item.network == 'Merlin'
              ? 'wBTC1 - bitUSD'
              : index == 0
                ? 'wBTC2 - bitUSD'
                : `wBTC${index + 1} - bitUSD`}
          </li>
          <li className="flex flex-1 items-center justify-end text-right">
            {item.network} <AkarIconslinkOutIcon />
          </li>
          <li className="flex-1 text-right">{item.maxLTV * 100}%</li>
          <li className="flex-1 text-right">{item.borrowRate * 100}%</li>
          <li className="flex-1 text-right ">{item.minSize} $</li>
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
    ) : (
      <></>
    )
  )

  return (
    <>
      <div className="">
        <dl className="mx-auto mt-[50px] max-w-[1220px]">
          <dt className="border-b-2 border-dashed border-white/50 pb-[24px]">
            <ul className="table_title_color flex justify-between font-ibmb">
              <li className="w-[140px]"></li>
              <li className="flex-1 text-right">Network</li>
              <li className="flex-1 text-right">
                <Tooltip text="MAX LTV">
                  <span>Max LTV ⓘ</span>
                </Tooltip>
              </li>
              <li className="flex-1 text-right">Borrow rate ⓘ</li>
              <li className="flex-1 text-right">Min Size ⓘ </li>
              <li className="flex-1 text-right">Liquidity ⓘ </li>
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
  const renderedItems = list.map((item: Vault, index: number) =>
    item.isOpenVault ? (
      <dd className="border-b-2 border-dashed border-white/50" key={index}>
        <ul className=" flex items-center px-[12px] py-[24px] font-ibmr text-white">
          <li className="flex-1">
            {item.network == 'Merlin'
              ? 'wBTC1 - bitUSD'
              : index == 0
                ? 'wBTC2 - bitUSD'
                : `wBTC${index + 1} - bitUSD`}
          </li>
          <li className="flex flex-1 items-center justify-center text-center">
            {item.network} <AkarIconslinkOutIcon />
          </li>
          <li className="mr-[10px] flex-1 text-right">
            {item.collateralRatio * 100}%
          </li>
          <li className="mr-[10px] flex-1 text-right">
            {item.collateralLocked} BTC
          </li>
          <li className="mr-[10px] flex-1 text-right">{item.totalDebt} $</li>
          {/* <li className="flex-none w-[165px] text-right">{item.liquidity}</li> */}
          <li className="flex-1 text-right">
            <button
              className="h-[34px] w-[133px] bg-white font-ibmb text-gray-950"
              onClick={() => handleClick(item)}>
              Enter Vault
            </button>
          </li>
        </ul>
      </dd>
    ) : (
      <></>
    )
  )
  return (
    <>
      <div className="">
        <dl className="mx-auto mt-[50px] max-w-[1220px] ">
          <dt className="border-b-2 border-dashed border-white/50 pb-[24px]">
            <ul className="table_title_color flex justify-between font-ibmb">
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
    </>
  )
}

export default MainNet
