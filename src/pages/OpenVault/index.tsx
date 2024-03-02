import React, { useState, useEffect, SetStateAction } from 'react'
import isMobile from 'ismobilejs'
import { Image } from '@/components/Image'
// import { NetworkErrorPage } from '@/pages/Main/NetworkErrorPage'
// import { useSelector } from 'react-redux'
// import { getNetworkError } from '@/store/common/reducer'
import { MobilePage } from '@/pages/Main/MobilePage'
import { Header } from '@/components/Header'
// import { CopyRightAndLinks } from '@/components/CopyRightAndLinks'
import { TitleBox } from '@/components/Title'
import { getLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS, commonParam } from '@/config/settings'
import './index.scss'
import { getOpenUrl, openUrl } from '@/utils/getAssetsUrl'
import { useNavigate } from 'react-router-dom'
import { ProjectService } from '@/services/project'
import { bitSmileyABI, bitUSDABI, oraclesABI, vaultManagerABI } from '@/abi/abi'
import {
  utilsGetNetwork,
  utilsParseEther,
  getChainId,
  getGasPrice,
  utilsFormatEther,
  connectWallet,
  getWalletAddress,
  creatContract,
  networkChange
} from '@/ethersConnect'
// import { useUserInfo } from '@/hooks/useUserInfo'
import { SCANTXHASH } from '@/config/links'
import { formatDecimal, formatMoney } from '@/utils/formatter'
import LoadingAnimation from '@/components/LoadingAnimation'
import { displayAddress } from '@/utils/formatter'

interface overviewBoxObject {
  availableToMint?: number
  debtBitUSD?: number
  collateralRate?: number
  lockedCollateral?: number
  liquidationPrice?: number
  availableToWithdraw?: number
}

// interface OracleContract {
//   getPrice: (param: string) => Promise<number>;
// }

const OpenVault: React.FC = () => {
  const navigate = useNavigate()
  // const isNetworkError = useSelector(getNetworkError)
  // const [isEntered, setIsEntered] = useState(false)
  const [inputValue, setInputValue] = useState(0)
  const [isLoding, setIsLodingValue] = useState(false)
  //1=>Start ; 2=>mint bitUSD; 3=>mint bitUSD ing;4=> Minting Completed;5=>Changes Failed
  const [isState, setIsStateValue] = useState(3)

  // const { address, isConnected } = useUserInfo()

  const [bitSmileyAddrees, setBitSmileyAddrees] = useState('')
  const [walletInfo, setWalletInfo] = useState<Array<string>>([])

  const [contractToken, setContractToken] = useState('')
  const [TokenContract, setTokenContract] = useState<Record<string, object>>({})
  const [balanceWBTC, setBalanceWBTC] = useState('')
  const [isApprove, setIsApprove] = useState(false)
  const [gasPrice, setGasPrice] = useState<string>('')
  const [transactionHash, setTransactionHash] = useState('')
  const [listInfo, setListInfo] = useState({
    borrowRate: 0,
    liquidity: 0,
    minSize: 0,
    maxLTV: 0,
    chainId: 0
  })
  // const [oracle, setOracle] = useState('')
  const [oracleContract, setOracleContract] = useState<Record<string, object>>(
    {}
  )
  // const [priceUSD, setPriceOracle] = useState(0)
  const [oraclePrice, setOraclePriceOracle] = useState(0)
  // const [vaultManagerAddress, setVaultManagerAddress] = useState('')
  const [vaultManagerContract, setVaultManagerContract] = useState<
    Record<string, object>
  >({})
  const [bitSmileyContract, setBitSmileyContract] = useState<
    Record<string, object>
  >({})
  const [vault1, setVault1] = useState('')
  const [AvailableBitUSD, setAvailableBitUSD] = useState(0)
  const [currentNetwork, setCurrentNetwork] = useState({ chainId: 0 })

  const [overviewDataInit, setOverviewDataInit] = useState({
    liquidationPrice: 0,
    collateralRate: 0,
    debtBitUSD: 0,
    lockedCollateral: 0,
    availableToWithdraw: 0,
    availableToMint: 0
  })
  const [overviewAfterDataInit, setOverviewAfterDataInit] = useState({
    liquidationPrice: 0,
    collateralRate: 0,
    debtBitUSD: 0,
    lockedCollateral: 0,
    availableToWithdraw: 0,
    availableToMint: 0
  })

  const isGlobalStatus = async () => {
    let flag = true
    if (walletInfo.length == 0) {
      flag = false
      connectWallet()
    } else if (currentNetwork.chainId != listInfo.chainId) {
      flag = false
      const id = await utilsGetNetwork(listInfo.chainId)
      networkChange(Number(id))
    }
    return flag
  }

  const projectFun = async () => {
    try {
      const info = JSON.parse(
        getLocalStorage(LOCAL_STORAGE_KEYS.NETWORKINFO) || '0'
      )
      console.log(info)
      setListInfo(info)

      const { data } = await ProjectService.getProjectInfo.call()
      console.log(data)

      const targetItem = data.web3Info.find(
        (item) => item.chainId === info.chainId
      )
      if (targetItem) {
        const contractNetworkNew = targetItem.contract
        setContractToken(contractNetworkNew.WBTC)
        setBitSmileyAddrees(contractNetworkNew.BitSmiley)
        // setVaultManagerAddress(contractNetworkNew.VaultManager)
        // setOracle(contractNetworkNew.oracle)

        const gas = await getGasPrice()
        setGasPrice(gas.toString())
        const a = await getWalletAddress()
        setWalletInfo(a)
        if (a.length == 0) {
          connectWallet()
        }

        const network = await getChainId()
        setCurrentNetwork(network)
        console.log(info.chainId)
        if (info.chainId != network.chainId) {
          const id = await utilsGetNetwork(info.chainId)
          networkChange(Number(id))
        }

        const vaultManager = await creatContract(
          contractNetworkNew.VaultManager,
          vaultManagerABI
        )
        console.log(vaultManager)
        setVaultManagerContract(vaultManager)

        const oracleCon = await creatContract(
          contractNetworkNew.oracle,
          oraclesABI
        )
        const price = await oracleCon.getPrice(commonParam.BTC)
        console.log(price, Number(utilsFormatEther(price)))
        setOracleContract(oracleCon)
        setOraclePriceOracle(Number(utilsFormatEther(price)))

        const contract = await creatContract(contractNetworkNew.WBTC, bitUSDABI)
        setTokenContract(contract)
        console.log(contract, walletInfo[0])

        const smileyContract = await creatContract(
          contractNetworkNew.BitSmiley,
          bitSmileyABI
        )
        setBitSmileyContract(smileyContract)
        const vault = await smileyContract.owners(a[0])
        console.log('vault==>', vault)
        setVault1(vault)

        const balance = await contract.balanceOf(a[0])
        const b = utilsFormatEther(balance)
        setBalanceWBTC(b)
        console.log(
          '--balance',
          balance,
          b,
          balance.toString(),
          'bitSmileyAddrees==',
          contractNetworkNew.BitSmiley
        )

        const isAllowance = await contract.allowance(
          a[0],
          contractNetworkNew.BitSmiley
        )
        console.log(
          '--Allowance number--',
          isAllowance,
          Number(utilsFormatEther(isAllowance))
        )
        const allowanceNum = Number(utilsFormatEther(isAllowance))
        if (allowanceNum >= inputValue) {
          setIsApprove(true)
        } else {
          setIsApprove(false)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  const initData = async () => {
    const overviewInit: object = await overviewData(0)
    console.log('====>---', overviewInit)
    setOverviewDataInit(
      overviewInit as SetStateAction<{
        liquidationPrice: number
        collateralRate: number
        debtBitUSD: number
        lockedCollateral: number
        availableToWithdraw: number
        availableToMint: number
      }>
    )
  }

  const getRealTimeOracle = async () => {
    const price: string = await (
      oracleContract as { getPrice: (asset: string) => Promise<string> }
    )?.getPrice(commonParam.BTC)

    setOraclePriceOracle(Number(utilsFormatEther(price)))
  }

  useEffect(() => {
    if (!oracleContract) return
    const timer = setInterval(() => [getRealTimeOracle()], 3000)
    return () => {
      clearInterval(timer)
    }
  }, [oracleContract])

  useEffect(() => {
    console.log('vault1-------', vault1)
    if (vault1) {
      if (vault1 != '0x0000000000000000000000000000000000000000') {
        setIsStateValue(3)
        setIsApprove(true)
      }
    }
  }, [vault1])
  useEffect(() => {
    console.log('vaultManagerContract', vaultManagerContract)
    if (vaultManagerContract && vault1) {
      console.log('vaultManagerContract==1', vaultManagerContract)
      initData()
    }
  }, [vaultManagerContract, vault1])

  useEffect(() => {
    projectFun()
  }, [])
  useEffect(() => {
    if (vaultManagerContract) {
      getAvailableBitUSD()
    }
  }, [vaultManagerContract, oraclePrice])

  const getAvailableBitUSD = async () => {
    console.log(vaultManagerContract)
    // const bitUSDAmount = utilsParseEther(inputValue.toString());
    // const price = utilsParseEther(oraclePrice.toString());
    console.log('commonParam.BTC=', commonParam.BTC)
    // const collateral = await vaultManagerContract?.collateralTypes(
    //   commonParam.BTC
    // )
    /* eslint-disable */
    const collateral = await (
      vaultManagerContract as { collateralTypes: (arg1: any) => Promise<any> }
    )?.collateralTypes(commonParam.BTC)
    /* eslint-enable */
    const safetyFactor = collateral.safetyFactor / 10 ** 9
    const rate = collateral.rate / 10 ** 27

    const collateralEvaluation =
      (inputValue * oraclePrice * safetyFactor) / rate
    console.log(collateralEvaluation)
    setAvailableBitUSD(collateralEvaluation)

    // const collateralEvaluation2 = await vaultManagerContract.evaluateCollateral(commonParam.BTC, bitUSDAmount);
    // let avail = utilsFormatEther(collateralEvaluation2)
    // console.log(avail)
    // setAvailableBitUSD(avail)
  }

  const blurSetupVault = async () => {
    getAvailableBitUSD()
  }

  const handApproveFun = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    console.log('approve start--->', inputValue, TokenContract)
    // const isAllowance = await TokenContract?.approve(
    //   bitSmileyAddrees,
    //   utilsParseEther(inputValue.toString())
    // )
/* eslint-disable */
    const isAllowance = await (
      TokenContract as { approve: (arg1: any, arg2: any) => Promise<any> }
    )?.approve(bitSmileyAddrees, utilsParseEther(inputValue.toString()))
    /* eslint-enable */
    console.log(isAllowance)
    if (isAllowance.hash) {
      setTransactionHash(isAllowance.hash)
      setIsLodingValue(true)
    }
    const receipt = await isAllowance.wait()
    console.log('Transaction confirmed:', receipt.transactionHash)
    console.log('Gas used:', receipt.gasUsed.toString())
    if (receipt) {
      setIsLodingValue(false)
      setIsStateValue(1)
      setIsApprove(true)
    }
  }
  const StartFun = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    console.log('contractToken--', contractToken)
    console.log('setVlu-->', inputValue, gasPrice)
    console.log(walletInfo, bitSmileyAddrees)
    try {
      const collateral = utilsParseEther(inputValue.toString())
      const contract = await creatContract(bitSmileyAddrees, bitSmileyABI)
      console.log(contract, collateral.toString())
      const gasLimit = await contract.estimateGas.openVaultAndMintFromBTC(
        0,
        collateral,
        {
          gasPrice: gasPrice
        }
      )
      console.log('Estimated Gas Limit:', gasLimit)
      const transactionResponse = await contract.openVaultAndMintFromBTC(
        0,
        collateral,
        {
          gasPrice: gasPrice,
          gasLimit: gasLimit
        }
      )
      console.log(transactionResponse)
      if (transactionResponse) {
        setTransactionHash(transactionResponse.hash)
        setIsLodingValue(true)
      }
      const receipt = await transactionResponse.wait()
      console.log('Transaction confirmed:', receipt.transactionHash)
      console.log('Gas used:', receipt.gasUsed.toString())
      if (receipt) {
        /* eslint-disable */
        const vault = await (
          bitSmileyContract as { owners: (arg1: any) => Promise<any> }
        )?.owners(walletInfo[0])
        /* eslint-enable */
        console.log('vault==>', vault)
        setVault1(vault)
        setIsLodingValue(false)
        setIsStateValue(2)
        setIsApprove(true)
      }
    } catch (err) {
      setIsStateValue(5)
      console.log(err)
    }
  }

  const overviewData = async (val: number) => {
    // bitSmileyContract
    console.log(vaultManagerContract)
    const safeRate = commonParam.safeRate // 50%
    const bitUSDAmount = utilsParseEther(val.toString())
    console.log(
      'commonParam.BTC=',
      commonParam.BTC,
      'vault1=',
      vault1,
      'bitUSDAmount=',
      Number(bitUSDAmount)
    )
    // BTC, vault1, collateral, bitUSDAmount
    // var vaultManager = await creatContract(vaultManagerAddress,vaultManagerABI)
    const param = [
      commonParam.BTC,
      vault1,
      0,
      bitUSDAmount,
      safeRate * 10000000
    ]
    /* eslint-disable */
    const result = await (
      vaultManagerContract as {
        getVaultChange: (...arg1: any[]) => Promise<any>
      }
    )?.getVaultChange(...param)
    /* eslint-enable */
    console.log(result)
    console.log(result.liquidationPrice)
    const arr = {
      liquidationPrice: Number(
        utilsFormatEther(result.liquidationPrice.toString())
      ),
      // collateralRate: Number(utilsFormatEther(result.collateralRate.toString())),
      collateralRate: (result.collateralRate / 1000) * 100,
      debtBitUSD: Number(utilsFormatEther(result.debtBitUSD)),
      lockedCollateral: Number(
        utilsFormatEther(result.lockedCollateral.toString())
      ),
      availableToWithdraw: Number(
        utilsFormatEther(result.availableToWithdraw.toString())
      ),
      availableToMint: Number(
        utilsFormatEther(result.availableToMint.toString())
      )
    }
    console.log(arr)
    return arr
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^\d*\.?\d*$/
    const newValue = event.target.value
    if (regex.test(newValue)) {
      setInputValue(Number(newValue))
    }
  }

  const handleInputBlurMint = async () => {
    console.log(inputValue)
    if (inputValue <= 0) return
    if (inputValue > overviewDataInit.availableToMint) {
      setInputValue(Number(formatDecimal(overviewDataInit.availableToMint, 4)))
    }
    const overviewInit = await overviewData(inputValue)
    console.log('====>---', overviewInit)
    setOverviewAfterDataInit(overviewInit)
  }

  const onClickMintBitUsd = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    console.log(inputValue, bitSmileyContract)
    if (inputValue <= 0) return
    try {
      const USDAmount = utilsParseEther(inputValue.toString())
      console.log('vault1===', vault1, 'bitUSDAmount', USDAmount.toString())
      const parameter = [
        vault1,
        USDAmount,
        0, //btc
        { value: 0, gasPrice: gasPrice }
      ]
      /* eslint-disable */
      const gasLimit = await (
        bitSmileyContract as {
          estimateGas: { mintFromBTC: (...args: any[]) => Promise<any> }
        }
      )?.estimateGas.mintFromBTC(...parameter)

      const result = await (
        bitSmileyContract as { mintFromBTC: (...args: any[]) => Promise<any> }
      )?.mintFromBTC(
        vault1,
        USDAmount,
        0, //btc
        {
          gasPrice: gasPrice,
          gasLimit: gasLimit
        }
      )
      /* eslint-enable */
      if (result) {
        setTransactionHash(result.hash)
        setIsLodingValue(true)
        // setIsStateValue(2)
      }
      const receipt = await result.wait()
      console.log('Transaction confirmed:', receipt.transactionHash)
      console.log('Gas used:', receipt.gasUsed.toString())
      if (receipt) {
        setIsLodingValue(false)
        setIsStateValue(4)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const handClickFild = () => {
    setIsStateValue(1)
  }
  const okClick = () => {
    navigate('/mainNet')
  }
  if (isMobile(window.navigator).any) return <MobilePage />

  // if (isNetworkError) return <NetworkErrorPage />

  return (
    <div>
      <Header wallet />
      <div>
        <div className=" mx-auto mt-[164px] max-w-[1434px]">
          <TitleBox
            message={
              isState == 1 || isState == 5
                ? 'Open a wBTC1 Vault'
                : isState == 2
                  ? 'wBTC1 Vault'
                  : `wBTC1 Vault: ${displayAddress(vault1)}`
            }
            isWhite={true}
          />
        </div>
        <div className=" container mx-auto">
          <dl className="mx-auto mt-[9px] max-w-[1220px] ">
            <dt className="mb-[16px]">
              <ul className="table_title_color flex justify-center font-ibmb">
                <li className="mr-[50px] text-center">
                  Borrow rate : {listInfo.borrowRate * 100}% ⓘ{' '}
                </li>
                <li className="mr-[50px] text-center">Liquidity fee: 50% ⓘ </li>
                <li className="mr-[50px] text-center">
                  Min Size: {listInfo.minSize} $ ⓘ
                </li>
                <li className="mr-[50px] text-center">
                  Max LTV: {listInfo.maxLTV * 100}% ⓘ
                </li>
              </ul>
              {/* <networkInfo list={listInfo}/> */}
            </dt>
          </dl>
          <div className="line_bottom mb-[31px]"></div>

          <div className="flex justify-center pb-[250px]">
            <div className="grid_bg relative mr-[99px] h-[528px] w-[629px] flex-none">
              <div className="blendMode t-0 l-0 absolute"></div>
              <div className="relative h-[528px]">
                <CornerPin></CornerPin>
                <TitleBlock titleValue="Overview"></TitleBlock>
                {isState == 3 || isState == 4 ? (
                  <MintBitUsdOverviewBox
                    listData={overviewDataInit}
                    afterDataInit={overviewAfterDataInit}
                  />
                ) : (
                  <OverviewBox />
                )}
              </div>
            </div>
            <div className="grid_bg relative flex-none">
              <div className="blendMode_blue t-0 l-0 absolute"></div>
              <div className="relative h-[528px] w-[629px] px-[53px] ">
                <CornerPin></CornerPin>
                {isState == 5 ? (
                  <FailedTitleBlock />
                ) : (
                  <TitleBlock
                    titleValue={`${
                      isState == 3
                        ? 'Mint bitUSd'
                        : isState == 4
                          ? 'Minting Completed'
                          : 'Setup Vault'
                    }`}></TitleBlock>
                )}

                <div>
                  {isLoding ? (
                    <LoadingBox
                      openUrlClick={() =>
                        openUrl(`${SCANTXHASH.test}${transactionHash}`)
                      }
                    />
                  ) : isState == 1 ? (
                    <SetupVault
                      balance={balanceWBTC}
                      AvailableBitUSD={AvailableBitUSD}
                      price={oraclePrice}
                      inputValue={inputValue}
                      isApprove={isApprove}
                      handleBlur={blurSetupVault}
                      handleInputChange={handleInputChange}
                      handApproveFun={handApproveFun}
                      handStartFun={StartFun}
                    />
                  ) : isState == 2 ? (
                    <MintBitUSDBox
                      isOk={false}
                      toastMsg="ly created a vault. You can find it in “My Vault”. Continue to mint bitUSD from this vault"
                      handleClick={() => {
                        setIsStateValue(3)
                      }}
                      handleOkClick={() => {}}
                    />
                  ) : isState == 3 ? (
                    <MintBitUSDIng
                      afterDataInit={overviewAfterDataInit}
                      listData={overviewDataInit}
                      inputValue={inputValue}
                      handOnClickMint={onClickMintBitUsd}
                      handleBlur={handleInputBlurMint}
                      handleInputChange={handleInputChange}
                    />
                  ) : isState == 4 ? (
                    <MintBitUSDBox
                      isOk={true}
                      handleClick={() => {}}
                      toastMsg="Your vault change is completed. You can find the changes in the Vault History below."
                      handleOkClick={okClick}
                    />
                  ) : isState == 5 ? (
                    <MintBitUSDBox
                      isOk={true}
                      handleClick={() => {}}
                      handleOkClick={handClickFild}
                      toastMsg="Your vault change has encountered an error ⓘ. Please try again"
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <CopyRightAndLinks /> */}
    </div>
  )
}

// const networkInfo: React.FC<{
//   list: titleListObject
// }> = ({ list }) => {
//   return (
//     <>
//       <ul className="table_title_color flex justify-center font-ibmb">
//         <li className="mr-[50px] text-center">
//           Borrow rate : {list.borrowRate * 100}% ⓘ{' '}
//         </li>
//         <li className="mr-[50px] text-center">
//           Liquidity fee: {list.liquidity * 100}% ⓘ{' '}
//         </li>
//         <li className="mr-[50px] text-center">
//           Min Size: {list.minSize} BTC ⓘ
//         </li>
//         <li className="mr-[50px] text-center">
//           Max LTV: {list.maxLTV * 100}% ⓘ
//         </li>
//       </ul>
//     </>
//   )
// }

const TitleBlock: React.FC<{
  titleValue: string
}> = ({ titleValue }) => {
  return (
    <>
      <h3 className="flex h-[46px] items-center justify-center text-center font-ppnb text-[36px] text-white">
        <span className="bg-black px-[24px]">{titleValue}</span>
      </h3>
    </>
  )
}

const CornerPin: React.FC = () => {
  return (
    <>
      <div className="union01 absolute left-0 top-[22px] h-[24px] w-[24px]"></div>
      <div className="union01 absolute right-0 top-[22px] h-[24px] w-[24px] rotate-90"></div>
      <div className="union01 absolute bottom-0 left-0 h-[24px] w-[24px] -rotate-90"></div>
      <div className="union01 absolute bottom-0 right-0 h-[24px] w-[24px] -rotate-180"></div>
    </>
  )
}

const SetupVault: React.FC<{
  inputValue: number
  balance: number | string
  isApprove: boolean
  price: number
  AvailableBitUSD: number | string
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handStartFun: () => void
  handApproveFun: () => void
  handleBlur: () => void
}> = ({
  inputValue,
  balance,
  handleBlur,
  AvailableBitUSD,
  price,
  isApprove = false,
  handleInputChange,
  handStartFun,
  handApproveFun
}) => {
  return (
    <>
      <div className="mb-[27px] mt-[84px] flex items-center justify-between font-ibmr text-[16px] text-white">
        <span>Deposit BTC</span>
        <span>{Number(balance)} available</span>
      </div>
      <div className="mb-[27px] bg-black/[.35] px-[20px] py-[10px]">
        <input
          type="number"
          min="1"
          className="input_style flex h-[47px] w-auto items-center font-ibmb
        text-[36px] leading-[47px] hover:border-none"
          onBlur={handleBlur}
          value={inputValue}
          onChange={handleInputChange}
        />
        <p className="mt-3 font-ibmr text-[16px] text-white/[.8]">
          ~
          {formatMoney(
            formatDecimal((price as number) * (inputValue as number), 4)
          )}{' '}
          USD
        </p>
      </div>

      <ul>
        {/* <li className="flex justify-between items-center font-ibmr text-white text-[16px] mb-[8px] h-[21px]">
          <span>Collateral locked</span>
          <p className="flex justify-between items-center font-ibmb">
            <span>0.00 BTC </span>
            <Image src={getOpenUrl('return')} className="w-[5px] mr-[9px] ml-2"/> 
            <span className="text-green"> 1.00 BTC</span></p>
        </li> */}
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span>Available to generate bitUSD</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>
              {formatMoney(formatDecimal(AvailableBitUSD || 0, 4))} ${' '}
            </span>
            {/* <Image src={getOpenUrl('return')} className="w-[5px] mr-[9px] ml-2"/> 
            <span className="text-green"> 1.00 BTC</span> */}
          </p>
        </li>
        {/* <li className="flex justify-between items-center font-ibmr text-white text-[16px] mb-[8px] h-[21px]">
          <span>Gas fee</span>
          <p className="flex justify-between items-center font-ibmb">
            <span className="text-green"> ~xxxx</span></p>
        </li> */}
      </ul>

      {/* <div className="flex justify-center mt-[28px]"> */}
      <div className="mt-[78px] flex justify-center">
        {!isApprove ? (
          <button
            className="relative flex h-[77px] w-[517px] items-center justify-center border-y-[3px]
          border-solid border-white bg-blue"
            onClick={handApproveFun}>
            <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
            <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
            <span className="ml-[21px] font-ppnb text-[48px] text-white">
              Give permission to use BTC
            </span>
            <Image
              src={getOpenUrl('Union02')}
              className="ml-2 mr-[21px] w-[22px]"
            />
          </button>
        ) : (
          <button
            className="relative flex h-[77px] w-[517px] items-center justify-between border-y-[3px]
          border-solid border-white bg-blue"
            onClick={handStartFun}>
            <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
            <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
            <span className="ml-[21px] font-ppnb text-[48px] text-white">
              Start
            </span>
            <Image
              src={getOpenUrl('union01')}
              className="ml-2 mr-[14px] w-[79px]"
            />
          </button>
        )}
      </div>
    </>
  )
}

const MintBitUSDIng: React.FC<{
  inputValue: number
  listData: overviewBoxObject
  afterDataInit: overviewBoxObject
  handleBlur: () => void
  handOnClickMint: () => void
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({
  inputValue,
  handleInputChange,
  handOnClickMint,
  afterDataInit,
  listData,
  handleBlur
}) => {
  return (
    <>
      <div className="mb-[27px] mt-[44px] flex items-center justify-between font-ibmr text-[16px] text-white">
        <span>Mint bitUSD</span>
        <span>
          Max: {formatMoney(formatDecimal(listData.availableToMint, 4))} $
        </span>
      </div>
      <div className="relative mb-[27px] bg-black/[.35] px-[20px] py-[10px]">
        <input
          type="number"
          min="1"
          className="input_style flex h-[47px] w-auto items-center font-ibmb
        text-[36px] leading-[47px] hover:border-none"
          placeholder="1"
          onBlur={handleBlur}
          value={inputValue}
          onChange={handleInputChange}
        />
        <p className="absolute -top-[17px] right-[20px] mt-3 font-ppnb text-[48px] text-blue/[.5]">
          bitUSD
        </p>
      </div>

      <ul>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Vault Debt</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>{formatMoney(formatDecimal(listData.debtBitUSD, 4))} $ </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatMoney(formatDecimal(afterDataInit.debtBitUSD, 4))} $
            </span>
          </p>
        </li>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Health factor</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>{formatDecimal(listData.collateralRate, 2)} % </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatDecimal(afterDataInit.collateralRate, 2)} %
            </span>
          </p>
        </li>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Available to mint bitUSD</span>
          <p className="flex items-center justify-between whitespace-nowrap font-ibmb">
            <span>
              {formatMoney(formatDecimal(listData.availableToMint, 4))} ${' '}
            </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatMoney(formatDecimal(afterDataInit.availableToMint, 4))} $
            </span>
          </p>
        </li>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Liquidation Price</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>
              {formatMoney(formatDecimal(listData.liquidationPrice, 4))} ${' '}
            </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatMoney(formatDecimal(afterDataInit.liquidationPrice, 4))} $
            </span>
          </p>
        </li>
      </ul>

      <div className="absolute bottom-[34px] mt-[28px] flex justify-center">
        <button
          className="relative flex h-[77px] w-[517px] items-center justify-between border-y-[3px]
        border-solid border-white bg-blue"
          onClick={handOnClickMint}>
          <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
          <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
          <span className="ml-[21px] font-ppnb text-[48px] text-white">
            Start
          </span>
          <Image
            src={getOpenUrl('union01')}
            className="ml-2 mr-[14px] w-[79px]"
          />
        </button>
      </div>
    </>
  )
}

const LoadingBox: React.FC<{
  openUrlClick: () => void
}> = ({ openUrlClick }) => {
  return (
    <>
      <div>
        <p className="m-auto my-[163px] max-w-[381px] text-center leading-[20px]">
          <span className=" font-ibmr text-white" onClick={openUrlClick}>
            Your transaction is getting processed on-chain{' '}
            <span className="text-green">[Check here]</span>
          </span>
        </p>
        <div className="absolute bottom-[34px] mt-[28px] flex justify-center">
          <button
            className="relative flex h-[77px] w-[517px] items-center justify-center border-y-[3px]
          border-solid border-white/[.5] bg-white/[.2]">
            <div className="button_bg2 absolute -left-[6px] -top-[3px]"></div>
            <div className="button_bg2 absolute -right-[6px] -top-[3px] rotate-180"></div>
            <span className="ml-[21px] font-ppnb text-[48px] text-white/[.5]">
              <LoadingAnimation text="Processing"></LoadingAnimation>
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

const MintBitUSDBox: React.FC<{
  toastMsg: string
  isOk: boolean
  handleClick: () => void
  handleOkClick: () => void
}> = ({ toastMsg, isOk = false, handleClick, handleOkClick }) => {
  return (
    <>
      <div>
        <p className="m-auto my-[163px] max-w-[381px] text-center font-ibmr leading-[20px] text-white">
          {toastMsg}
        </p>
        <div className="absolute bottom-[34px] mt-[28px] flex justify-center">
          {isOk ? (
            <button
              className="relative flex h-[77px] w-[517px] items-center justify-center border-y-[3px]
            border-solid border-white bg-blue"
              onClick={handleOkClick}>
              <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
              <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
              <span className="ml-[21px] font-ppnb text-[48px] text-white">
                Ok
              </span>
            </button>
          ) : (
            <button
              className="relative flex h-[77px] w-[517px] items-center justify-between border-y-[3px]
            border-solid border-white bg-blue"
              onClick={handleClick}>
              <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
              <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
              <span className="ml-[21px] font-ppnb text-[48px] text-white">
                Mint bitUSD
              </span>
              <Image
                src={getOpenUrl('union01')}
                className="mr-[14px] w-[79px]"
              />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

const OverviewBox: React.FC = () => {
  return (
    <>
      <div className="mt-[94px] flex items-center justify-center">
        <Image src={getOpenUrl('Untitled')} className="mr-[44px] w-[251px]" />
        {/* <div className={`text-white ${isOpacity?'opacity-50':''}`}>
        <div>
          <p className="text-base font-ibmr">Collateral locked</p>
          <h1 className="text-[72px] leading-[51px] font-ppnb mt-1 mb-3">$0.00</h1>
          <div className="relative font-ibmb bg-white w-[144px] h-[29px] text-black pl-[8px] flex items-center"> 
            <div className="button_white absolute -left-[4px] top-0 w-[4px] h-[29px]"></div>
            <div className="button_white rotate-180 absolute -right-[4px] top-0 w-[4px] h-[29px]"></div>
            40,000 After 
          </div>
        </div>
        <div className="mt-[34px]">
          <p className="text-base font-ibmr">Available to generate</p>
          <h1 className="text-[72px] leading-[51px] font-ppnb mt-1 mb-3">$0.00</h1>
          <div className="relative font-ibmb bg-white w-[144px] h-[29px] text-black pl-[8px] flex items-center"> 
            <div className="button_white absolute -left-[4px] top-0 w-[4px] h-[29px]"></div>
            <div className="button_white rotate-180 absolute -right-[4px] top-0 w-[4px] h-[29px]"></div>
            40,000 After 
          </div>
        </div>
      </div> */}
      </div>
    </>
  )
}

const MintBitUsdOverviewBox: React.FC<{
  listData: overviewBoxObject
  afterDataInit: overviewBoxObject
}> = ({ listData, afterDataInit }) => {
  return (
    <>
      <div className="mt-[10px]  px-[30px]">
        <div
          className={`flex flex-wrap items-center justify-between px-[30px] text-white`}>
          <div className="mt-[24px] w-[50%]">
            <p className="font-ibmr text-base">Liquidation Price</p>
            <h1 className="mb-4 mt-1 font-ppnb text-[72px] leading-[51px]">
              ${formatMoney(formatDecimal(listData.liquidationPrice || 0, 4))}
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center bg-black pl-[8px] font-ibmr text-white">
              ${' '}
              {formatMoney(
                formatDecimal(afterDataInit.liquidationPrice || 0, 4)
              )}{' '}
              after ⓘ{/* $ {afterDataInit.liquidationPrice} after ⓘ  */}
            </div>
          </div>
          <div className="mt-[24px] w-[50%] pl-[10px]">
            <p className="font-ibmr text-base">Health factor</p>
            <h1 className="mb-4 mt-1 font-ppnb text-[72px] leading-[51px]">
              {formatDecimal(listData.collateralRate || 0, 2)}%
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center bg-black pl-[8px] font-ibmr text-white">
              % {formatDecimal(afterDataInit.collateralRate || 0, 2)} after ⓘ
            </div>
          </div>
          <div className="mt-[24px] w-[50%]">
            <p className="font-ibmr text-base">Vault Debt</p>
            <h1 className="mb-4 mt-1 font-ppnb text-[72px] leading-[51px]">
              ${formatMoney(formatDecimal(listData.debtBitUSD || 0, 4))}
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center bg-black pl-[8px] font-ibmr text-white">
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
                formatDecimal(listData.lockedCollateral || 0, 4)
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
                formatDecimal(listData.availableToWithdraw || 0, 4)
              )}{' '}
              BTC
            </h1>
            <div className="relative flex h-[31px] min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatMoney(
                formatDecimal(afterDataInit.availableToWithdraw || 0, 4)
              )}{' '}
              after
            </div>
          </div>
          <div className="mt-[24px]">
            <p className="whitespace-nowrap font-ibmr text-[14px] ">
              Available to mint
            </p>
            <h1 className="mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]">
              {' '}
              {formatMoney(
                formatDecimal(listData.availableToMint || 0, 4)
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

const FailedTitleBlock: React.FC = () => {
  return (
    <>
      <h3 className="flex h-[46px] items-center justify-center text-center font-ppnb text-[36px] text-[#FF0000]">
        <span className=" bg-black px-[24px]">Changes Failed</span>
      </h3>
    </>
  )
}

export default OpenVault
