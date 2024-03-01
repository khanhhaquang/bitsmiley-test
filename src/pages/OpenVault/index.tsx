import React, { useState, useEffect } from 'react'
import isMobile from 'ismobilejs'
import { Image } from '@/components/Image'
// import { NetworkErrorPage } from '@/pages/Main/NetworkErrorPage'
import { useSelector } from 'react-redux'
import { getNetworkError } from '@/store/common/reducer'
import { MobilePage } from '@/pages/Main/MobilePage'
import { Header } from '@/components/Header'
import { CopyRightAndLinks } from '@/components/CopyRightAndLinks'
import { TitleBox } from '@/components/Title'
import { getLocalStorage, setLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS, commonParam } from '@/config/settings'
import { AkarIconslinkOutIcon } from '@/assets/icons'
import './index.scss'
import { getFrameUrl, getOpenUrl, openUrl } from '@/utils/getAssetsUrl'
import { Link, useNavigate } from 'react-router-dom'
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
  getBalance,
  creatContract,
  networkChange
} from '@/ethersConnect'
import { useUserInfo } from '@/hooks/useUserInfo'
import { SCANTXHASH } from '@/config/links'
import { formatDecimal, formatMoney } from '@/utils/formatter'
import LoadingAnimation from '@/components/LoadingAnimation'
import { displayAddress } from '@/utils/formatter'

const OpenVault: React.FC = () => {
  const navigate = useNavigate()
  const isNetworkError = useSelector(getNetworkError)
  const [isEntered, setIsEntered] = useState(false)
  const [inputValue, setInputValue] = useState(0)
  const [isLoding, setIsLodingValue] = useState(false)
  //1=>Start ; 2=>mint bitUSD; 3=>mint bitUSD ing;4=> Minting Completed;5=>Changes Failed
  const [isState, setIsStateValue] = useState(1)

  // const { address, isConnected } = useUserInfo()

  const [bitSmileyAddrees, setBitSmileyAddrees] = useState('')
  const [walletInfo, setWalletInfo] = useState([])

  const [contractToken, setContractToken] = useState('')
  const [TokenContract, setTokenContract] = useState('')
  const [balanceWBTC, setBalanceWBTC] = useState(0)
  const [isApprove, setIsApprove] = useState(false)
  const [gasPrice, setGasPrice] = useState(0)
  const [transactionHash, setTransactionHash] = useState('')
  const [listInfo, setListInfo] = useState({
    borrowRate: '',
    liquidity: '',
    minSize: '',
    maxLTV: ''
  })
  const [oracle, setOracle] = useState('')
  const [oracleContract, setOracleContract] = useState(0)
  const [priceUSD, setPriceOracle] = useState(0)
  const [oraclePrice, setOraclePriceOracle] = useState(0)
  const [vaultManagerAddress, setVaultManagerAddress] = useState('')
  const [vaultManagerContract, setVaultManagerContract] = useState('')
  const [bitSmileyContract, setBitSmileyContract] = useState('')
  const [vault1, setVault1] = useState('')
  const [AvailableBitUSD, setAvailableBitUSD] = useState(0)
  const [currentNetwork, setCurrentNetwork] = useState(0)

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
      networkChange(id)
    }
    return flag
  }

  const projectFun = async () => {
    try {
      const info = JSON.parse(getLocalStorage(LOCAL_STORAGE_KEYS.NETWORKINFO))
      console.log(info)
      setListInfo(info)

      const { data } = await ProjectService.getProjectInfo.call()
      console.log(data.data.web3Info[0].contract, gasPrice)
      const contractNetworkNew = data.data.web3Info[0].contract
      setContractToken(contractNetworkNew.WBTC)
      setBitSmileyAddrees(contractNetworkNew.BitSmiley)
      setVaultManagerAddress(contractNetworkNew.VaultManager)
      setOracle(contractNetworkNew.oracle)

      const gas = await getGasPrice()
      setGasPrice(gas)
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
        networkChange(id)
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
    } catch (err) {
      console.log(err)
    }
  }
  const initData = async () => {
    const overviewInit = await overviewData(0)
    console.log('====>---', overviewInit)
    setOverviewDataInit(overviewInit)
  }

  const getRealTimeOracle = async () => {
    const price = await oracleContract.getPrice(commonParam.BTC)
    // console.log(price,Number(utilsFormatEther(price)))
    setOraclePriceOracle(Number(utilsFormatEther(price)))
  }

  useEffect(() => {
    if (!oracleContract) return
    let timer
    timer = setInterval(() => [getRealTimeOracle()], 3000)
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
    // const collateral = await vaultManager.collateralTypes(BTC);
    // collateralEvaluation = _collateral_Input
    //             * 价格
    //             * collateral.safetyFactor
    //             / collateral.rate;
    const collateral = await vaultManagerContract.collateralTypes(
      commonParam.BTC
    )
    const safetyFactor = collateral.safetyFactor / 10 ** 9
    const rate = collateral.rate / 10 ** 27

    console.log(
      'Input=',
      inputValue,
      'oraclePrice=',
      Number(oraclePrice),
      'safetyFactor=',
      safetyFactor,
      'rate=',
      rate
    )

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
    const isAllowance = await TokenContract.approve(
      bitSmileyAddrees,
      utilsParseEther(inputValue.toString())
    )
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
    console.log('setVlu-->', inputValue, gasPrice * (1.2).toString())
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
        const vault = await bitSmileyContract.owners(walletInfo[0])
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

  const overviewData = async (val) => {
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
    const result = await vaultManagerContract.getVaultChange(
      commonParam.BTC,
      vault1,
      0,
      bitUSDAmount,
      safeRate * 10000000
    )
    console.log(result)
    console.log(result.liquidationPrice)
    const arr = {}
    arr.liquidationPrice = Number(
      utilsFormatEther(result.liquidationPrice.toString())
    )
    arr.collateralRate = (result.collateralRate / 1000) * 100
    arr.debtBitUSD = Number(utilsFormatEther(result.debtBitUSD))
    arr.lockedCollateral = Number(
      utilsFormatEther(result.lockedCollateral.toString())
    )
    arr.availableToWithdraw = Number(
      utilsFormatEther(result.availableToWithdraw.toString())
    )
    arr.availableToMint = Number(
      utilsFormatEther(result.availableToMint.toString())
    )
    console.log(arr)
    return arr
  }

  const handleInputChange = (event) => {
    const regex = /^\d*\.?\d*$/
    const newValue = event.target.value
    if (regex.test(newValue)) {
      setInputValue(newValue)
    }
  }

  const handleInputBlurMint = async (event) => {
    console.log(inputValue)
    if (inputValue <= 0) return
    if (inputValue > overviewDataInit.availableToMint) {
      setInputValue(formatDecimal(String(overviewDataInit.availableToMint), 4))
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

      const gasLimit = await bitSmileyContract.estimateGas.mintFromBTC(
        vault1,
        USDAmount,
        0, //btc
        { value: 0, gasPrice: gasPrice }
      )
      const result = await bitSmileyContract.mintFromBTC(
        vault1,
        USDAmount,
        0, //btc
        {
          gasPrice: gasPrice,
          gasLimit: gasLimit
        }
      )
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
            isWhite="true"
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
                  <OverviewBox isOpacity={true} />
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
                      toastMsg="ly created a vault. You can find it in “My Vault”. Continue to mint bitUSD from this vault"
                      handleClick={() => {
                        setIsStateValue(3)
                      }}
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
                      isOk="true"
                      toastMsg="Your vault change is completed. You can find the changes in the Vault History below."
                      handleOkClick={okClick}
                    />
                  ) : isState == 5 ? (
                    <MintBitUSDBox
                      isOk="true"
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
const networkInfo: React.FC<{
  list: Object
}> = ({ list }) => {
  return (
    <>
      <ul className="table_title_color flex justify-center font-ibmb">
        <li className="mr-[50px] text-center">
          Borrow rate : {list.borrowRate * 100}% ⓘ{' '}
        </li>
        <li className="mr-[50px] text-center">
          Liquidity fee: {list.liquidity * 100}% ⓘ{' '}
        </li>
        <li className="mr-[50px] text-center">
          Min Size: {list.minSize} BTC ⓘ
        </li>
        <li className="mr-[50px] text-center">
          Max LTV: {list.maxLTV * 100}% ⓘ
        </li>
      </ul>
    </>
  )
}

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

const CornerPin: React.FC<{}> = ({}) => {
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
  balance: any
  isApprove: boolean
  price: number
  AvailableBitUSD: any
  handleInputChange: () => void
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
        <p className="mt-3 font-ibmr text-[16px] text-white text-white/[.8]">
          ~{formatMoney(formatDecimal(String(price * inputValue), 4))} USD
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
            <span>{formatMoney(formatDecimal(AvailableBitUSD), 4)} $ </span>
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
  listData: Array
  afterDataInit: Object
  handleBlur: () => void
  handOnClickMint: () => void
  handleInputChange: () => void
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
          Max: {formatMoney(formatDecimal(String(listData.availableToMint), 4))}{' '}
          $
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
            <span>
              {formatMoney(formatDecimal(String(listData.debtBitUSD), 4))} ${' '}
            </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatMoney(
                formatDecimal(String(afterDataInit.debtBitUSD), 4)
              )}{' '}
              $
            </span>
          </p>
        </li>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Health factor</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>{formatDecimal(String(listData.collateralRate), 2)} % </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatDecimal(String(afterDataInit.collateralRate), 2)} %
            </span>
          </p>
        </li>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Available to mint bitUSD</span>
          <p className="flex items-center justify-between whitespace-nowrap font-ibmb">
            <span>
              {formatMoney(formatDecimal(String(listData.availableToMint), 4))}{' '}
              ${' '}
            </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatMoney(
                formatDecimal(String(afterDataInit.availableToMint), 4)
              )}{' '}
              $
            </span>
          </p>
        </li>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Liquidation Price</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>
              {formatMoney(formatDecimal(String(listData.liquidationPrice), 4))}{' '}
              ${' '}
            </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatMoney(
                formatDecimal(String(afterDataInit.liquidationPrice), 4)
              )}{' '}
              $
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
  handleClick: () => void
  openUrlClick: () => void
}> = ({ handleClick, openUrlClick }) => {
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

const OverviewBox: React.FC<{
  isOpacity: boolean
  listData: Array
  handleClick: () => void
}> = ({ isOpacity, listData, handleClick }) => {
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
  isOpacity: boolean
  listData: Array
  afterDataInit: Array
  handleClick: () => void
}> = ({ isOpacity, listData, afterDataInit, handleClick }) => {
  return (
    <>
      <div className="mt-[10px]  px-[30px]">
        <div
          className={`flex flex-wrap items-center justify-between px-[30px] text-white ${
            isOpacity ? 'opacity-50' : ''
          }`}>
          <div className="mt-[24px] w-[50%]">
            <p className="font-ibmr text-base">Liquidation Price</p>
            <h1 className="mb-4 mt-1 font-ppnb text-[72px] leading-[51px]">
              $
              {formatMoney(formatDecimal(String(listData.liquidationPrice), 4))}
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center bg-black pl-[8px] font-ibmr text-white">
              ${' '}
              {formatMoney(
                formatDecimal(String(afterDataInit.liquidationPrice), 4)
              )}{' '}
              after ⓘ{/* $ {afterDataInit.liquidationPrice} after ⓘ  */}
            </div>
          </div>
          <div className="mt-[24px] w-[50%] pl-[10px]">
            <p className="font-ibmr text-base">Health factor</p>
            <h1 className="mb-4 mt-1 font-ppnb text-[72px] leading-[51px]">
              {formatDecimal(String(listData.collateralRate), 2)}%
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center bg-black pl-[8px] font-ibmr text-white">
              % {formatDecimal(String(afterDataInit.collateralRate), 2)} after ⓘ
            </div>
          </div>
          <div className="mt-[24px] w-[50%]">
            <p className="font-ibmr text-base">Vault Debt</p>
            <h1 className="mb-4 mt-1 font-ppnb text-[72px] leading-[51px]">
              ${formatMoney(formatDecimal(String(listData.debtBitUSD), 4))}
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center bg-black pl-[8px] font-ibmr text-white">
              ${' '}
              {formatMoney(formatDecimal(String(afterDataInit.debtBitUSD), 4))}{' '}
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
                formatDecimal(String(listData.lockedCollateral), 4)
              )}{' '}
              BTC
            </h1>
            <div className="relative flex h-[31px] min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatMoney(
                formatDecimal(String(afterDataInit.lockedCollateral), 4)
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
                formatDecimal(String(listData.availableToWithdraw), 4)
              )}{' '}
              BTC
            </h1>
            <div className="relative flex h-[31px] min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatMoney(
                formatDecimal(String(afterDataInit.availableToWithdraw), 4)
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
                formatDecimal(String(listData.availableToMint), 4)
              )}{' '}
              bitUSD
            </h1>
            <div className="relative flex h-[31px] min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatMoney(
                formatDecimal(String(afterDataInit.availableToMint), 4)
              )}{' '}
              after
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const FailedTitleBlock: React.FC<{
  titleValue: string
}> = ({ titleValue }) => {
  return (
    <>
      <h3 className="flex h-[46px] items-center justify-center text-center font-ppnb text-[36px] text-[#FF0000]">
        <span className=" bg-black px-[24px]">Changes Failed</span>
      </h3>
    </>
  )
}

export default OpenVault
