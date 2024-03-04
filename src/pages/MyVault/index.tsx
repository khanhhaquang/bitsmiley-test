import React, { useState, useEffect } from 'react'
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
import {
  utilsParseEther,
  getGasPrice,
  utilsFormatEther,
  connectWallet,
  getWalletAddress,
  creatContract,
  networkChange,
  utilsGetNetwork,
  getChainId
} from '@/ethersConnect'
import { ProjectService } from '@/services/project'
import { SCANTXHASH } from '@/config/links'
import { formatDecimal, formatMoney } from '@/utils/formatter'
import {
  bitSmileyABI,
  bitUSDABI,
  oraclesABI,
  vaultManagerABI,
  bitUsdL2ABI
} from '@/abi/abi'
import LoadingAnimation from '@/components/LoadingAnimation'
import useContractAddresses from '@/hooks/useNetworkAddresses'
import { useWriteContract } from 'wagmi'
import { useUserInfo } from '@/hooks/useUserInfo'

// interface titleListObject {
//   borrowRate?: any
//   liquidity?: any
//   minSize?: any
//   maxLTV?: any
// }
interface overviewBoxObject {
  availableToMint?: number
  debtBitUSD?: number
  collateralRate?: number
  lockedCollateral?: number
  liquidationPrice?: number
  availableToWithdraw?: number
}

interface contractAddressInfo {
  BitUSDL2: string
  BitSmiley: string
  VaultManager: string
  oracle: string
  WBTC: string
}

interface networkInfo {
  chainId: number
  name: string
}

// interface OracleContractType {
//   getPrice(asset: string): Promise<number>;
// }

const MyVault: React.FC = () => {
  const [inputValue, setInputValue] = useState(0)
  const [withdrawValue, setWithdrawValue] = useState(0)
  const [isLoding, setIsLodingValue] = useState(false)
  const [gasPrice, setGasPrice] = useState<string>('')
  //1=>Make Changes-next  ; 2=>Vault Changes-Vault Changes ; 3=>Changes Completed=>ok ;4=>Changes Failed
  const [isState, setIsStateValue] = useState(1)
  //Deposit = true; withdraw/mint=false
  const [isDeposit, setIsDeposit] = useState(true)
  //0=>wBTC 1=>bitUSD
  const [coinType, setCoinType] = useState(0)
  const [bitSmileyAddrees, setBitSmileyAddrees] = useState('')
  // const [walletInfo, setWalletInfo] = useState<Array<string>>([])
  const [listInfo, setListInfo] = useState({
    borrowRate: 0,
    liquidity: 0,
    minSize: 0,
    maxLTV: 0,
    chainId: 0
  })
  // const [addressToken, setAddressToken] = useState('')
  const [TokenContract, setTokenContract] = useState<Record<string, object>>({})
  const [BitUSDL2Contract, setBitUSDL2Contract] = useState<
    Record<string, object>
  >({})
  const [balanceWBTC, setBalanceWBTC] = useState('')
  const [isApprove, setIsApprove] = useState(false)
  // const [oracle, setOracle] = useState('')
  // const [priceUSD, setPriceOracle] = useState(0)
  const [oraclePrice, setOraclePriceOracle] = useState<string>('0')
  const [oracleContract, setOracleContract] = useState<object>()
  // const [vaultManagerAddress, setVaultManagerAddress] = useState('')
  const [vaultManagerContract, setVaultManagerContract] = useState<object>()
  const [bitSmileyContract, setBitSmileyContract] = useState<object>()
  const [vault1, setVault1] = useState('')
  // const [AvailableBitUSD, setAvailableBitUSD] = useState(0)
  const [transactionHash, setTransactionHash] = useState('')
  const [bitUsdBalance, setBitUsdBalance] = useState('')
  const [currentNetwork, setCurrentNetwork] = useState<networkInfo>({
    chainId: 0,
    name: ''
  })
  const [contractNetworkNew, setContractNetworkNew] =
    useState<contractAddressInfo>({
      BitUSDL2: '',
      BitSmiley: '',
      VaultManager: '',
      oracle: '',
      WBTC: ''
    })
  const [overviewDataInit, setOverviewDataInit] = useState<overviewBoxObject>({
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

  const contractAddresses = useContractAddresses()
  const { writeContractAsync } = useWriteContract()
  const { address } = useUserInfo()

  console.log(address)

  const isGlobalStatus = async () => {
    let flag = true
    if (!address) {
      flag = false
      connectWallet()
    } else if (Number(currentNetwork.chainId) != listInfo.chainId) {
      flag = false
      const id = await utilsGetNetwork(listInfo.chainId)
      networkChange(Number(id))
    }
    return flag
  }

  useEffect(() => {
    projectFun()
  }, [])

  useEffect(() => {
    console.log(Object.keys(contractNetworkNew).length, address)
    if (Object.keys(contractNetworkNew).length > 0 || address) {
      contractInfo(contractNetworkNew, address)
    }
  }, [contractNetworkNew, address])

  const contractInfo = async (
    item: {
      BitUSDL2: string
      BitSmiley: string
      VaultManager: string
      oracle: string
      WBTC: string
    },
    a: Array<string>
  ) => {
    console.log(item, a)
    // if(item || a.length==0)return;
    // setAddressToken(item.WBTC)

    const bitUsdtContract = await creatContract(item.BitUSDL2, bitUsdL2ABI)
    console.log(bitUsdtContract)
    setBitUSDL2Contract(bitUsdtContract)
    setBitSmileyAddrees(item.BitSmiley)
    // setVaultManagerAddress(item.VaultManager)
    // setOracle(item.oracle)

    const bitUsdBalanceof = await bitUsdtContract.balanceOf(a[0])
    const usdAmount = utilsFormatEther(bitUsdBalanceof)
    console.log('bitUSD balance--', usdAmount)
    setBitUsdBalance(usdAmount)

    const vaultManager = await creatContract(item.VaultManager, vaultManagerABI)
    console.log(vaultManager)
    setVaultManagerContract(vaultManager)

    const oracleCon = await creatContract(item.oracle, oraclesABI)
    const price = await oracleCon.getPrice(commonParam.BTC)
    console.log(price, Number(utilsFormatEther(price)))
    setOracleContract(oracleCon)

    console.log(utilsFormatEther(price), typeof utilsFormatEther(price))
    setOraclePriceOracle(utilsFormatEther(price))

    const contract = await creatContract(item.WBTC, bitUSDABI)
    setTokenContract(contract)
    console.log(contract, a[0])

    const smileyContract = await creatContract(item.BitSmiley, bitSmileyABI)
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
      item.BitSmiley
    )
  }

  const projectFun = async () => {
    const info = JSON.parse(
      getLocalStorage(LOCAL_STORAGE_KEYS.NETWORKINFO) || ''
    )
    console.log(info)
    setListInfo(info)

    const gas = await getGasPrice()
    console.log(gas.toString(), typeof gas)
    setGasPrice(gas.toString())
    // const a = await getWalletAddress()
    // setWalletInfo(a)
    // console.log('----a', a)
    // if (a.length == 0) {
    //   connectWallet()
    // }

    const network = await getChainId()
    console.log(network)
    setCurrentNetwork(network)
    console.log(info.chainId)
    if (info.chainId != network.chainId) {
      const id = await utilsGetNetwork(info.chainId)
      networkChange(Number(id))
    }

    const { data } = await ProjectService.getProjectInfo.call()
    console.log(data)

    const targetItem = data.web3Info.find(
      (item) => item.chainId === info.chainId
    )
    if (targetItem) {
      setContractNetworkNew(targetItem.contract as contractAddressInfo)
      console.log(targetItem)
    }
  }

  const getRealTimeOracle = async () => {
    // const price = await oracleContract?.getPrice(commonParam.BTC)
    const price: string = await (
      oracleContract as { getPrice: (asset: string) => Promise<string> }
    )?.getPrice(commonParam.BTC)

    setOraclePriceOracle(utilsFormatEther(price))
  }

  useEffect(() => {
    if (!oracleContract) return
    const timer = setInterval(() => [getRealTimeOracle()], 3000)
    return () => {
      clearInterval(timer)
    }
  }, [oracleContract])

  const initData = async (val: number) => {
    const overviewInit = await overviewData(val, coinType)
    setOverviewDataInit(overviewInit)
  }

  const typeChangeFun = async (i: number) => {
    console.log(i)
    setInputValue(0)
    setWithdrawValue(0)
    setCoinType(i)
    const overviewInit = await overviewData(0, i)
    setOverviewDataInit(overviewInit)
  }

  useEffect(() => {
    if (vaultManagerContract && vault1) {
      console.log('vaultManagerContract==1', vaultManagerContract)
      initData(0)
    }
  }, [coinType, vaultManagerContract, vault1])

  const overviewData = async (val: number, type: number) => {
    console.log(coinType, vaultManagerContract)
    let amount: string = utilsParseEther(val.toString()).toString()
    let parameter = []
    const safeRate = commonParam.safeRate // 50%
    const Ctype = type === 0 ? 0 : type === 1 ? 1 : coinType

    if (Ctype == 1) {
      amount == '0'
        ? amount
        : isDeposit
          ? (amount = '-' + amount.toString())
          : amount.toString()
      parameter = [commonParam.BTC, vault1, 0, amount, safeRate * 10000000]
    } else {
      amount == '0'
        ? amount
        : !isDeposit
          ? (amount = '-' + amount.toString())
          : amount.toString()
      parameter = [commonParam.BTC, vault1, amount, 0, safeRate * 10000000]
    }
    console.log('amount', amount.toString())
    console.log('getVaultChange====', parameter)
    // BTC, vault1, collateral, bitUSDAmount
    /* eslint-disable */
    const result = await (
      vaultManagerContract as {
        getVaultChange: (...args: any[]) => Promise<any>
      }
    )?.getVaultChange(...parameter)
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
      setWithdrawValue(Number(newValue))
    }
  }

  const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^\d*\.?\d*$/
    const newValue = event.target.value
    if (regex.test(newValue)) {
      setInputValue(Number(newValue))
    }
  }

  const handOnFocusChange = () => {
    setIsDeposit(false)
  }

  const handOnFocusChange1 = () => {
    setIsDeposit(true)
  }

  const mintFromBTCFun = async (val: number, btcNum: number) => {
    console.log(val, bitSmileyContract)
    if (coinType == 1) {
      if (val <= 0) return
    } else {
      if (btcNum <= 0) return
    }
    try {
      const USDAmount = utilsParseEther(val.toString())
      const BTCAmount = utilsParseEther(btcNum.toString())
      console.log(
        'vault1===',
        vault1,
        'bitUSDAmount',
        USDAmount.toString(),
        BTCAmount.toString()
      )
      const parameter = [
        vault1,
        USDAmount,
        BTCAmount, //btc
        { value: 0, gasPrice: gasPrice }
      ]
      /* eslint-disable */
      const gasLimit = await (
        bitSmileyContract as {
          estimateGas: { mintFromBTC: (...args: any[]) => Promise<any> }
        }
      )?.estimateGas.mintFromBTC(...parameter)
      

      // const result = await bitSmileyContract?.mintFromBTC(
      //   vault1,
      //   USDAmount,
      //   BTCAmount, //btc
      //   {
      //     gasPrice: gasPrice,
      //     gasLimit: gasLimit
      //   }
      // )

      const result = await (
        bitSmileyContract as { mintFromBTC: (...args: any[]) => Promise<any> }
      )?.mintFromBTC(
        vault1,
        USDAmount,
        BTCAmount, //btc
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
        const overviewInit = await overviewData(0, coinType)
        console.log('====>---', overviewInit)
        contractInfo(contractNetworkNew, address)
        setInputValue(0)
        setWithdrawValue(0)
        setOverviewDataInit(overviewInit)
        setOverviewAfterDataInit(overviewInit)
        setIsLodingValue(false)
        setIsStateValue(3)
      }
    } catch (err) {
      console.log(err)
      setIsStateValue(1)
    }
  }

  const repayToBTCFun = async (val: number, btcNum: number) => {
    console.log(val, bitSmileyContract)
    if (coinType == 1) {
      if (val <= 0) return
    } else {
      if (btcNum <= 0) return
    }

    try {
      const USDAmount = utilsParseEther(val.toString())
      const BTCAmount = utilsParseEther(btcNum.toString())
      console.log(
        'vault1===',
        vault1,
        'bitUSDAmount-',
        USDAmount.toString(),
        'WBTC--',
        BTCAmount.toString()
      )
      /* eslint-disable */
      const parameter = [
        vault1,
        USDAmount,
        BTCAmount, //btc
        { value: 0, gasPrice: gasPrice }
      ]
      const gasLimit = await (
        bitSmileyContract as {
          estimateGas: { repayToBTC: (...args: any[]) => Promise<any> }
        }
      )?.estimateGas.repayToBTC(...parameter)

      // const gasLimit = await bitSmileyContract.estimateGas.repayToBTC(
      //   vault1,
      //   USDAmount,
      //   BTCAmount, //btc
      //   { value: 0, gasPrice: gasPrice }
      // )
      const result = await (
        bitSmileyContract as { repayToBTC: (...args: any[]) => Promise<any> }
      )?.repayToBTC(
        vault1,
        USDAmount,
        BTCAmount, //btc
        {
          gasPrice: gasPrice,
          gasLimit: gasLimit
        }
      )
      /* eslint-disable */

      // const result = await bitSmileyContract.repayToBTC(
      //   vault1,
      //   USDAmount,
      //   BTCAmount, //btc
      //   {
      //     gasPrice: gasPrice,
      //     gasLimit: gasLimit
      //   }
      // )
      if (result) {
        setTransactionHash(result.hash)
        setIsLodingValue(true)
      }
      const receipt = await result.wait()
      console.log('Transaction confirmed:', receipt.transactionHash)
      console.log('Gas used:', receipt.gasUsed.toString())
      if (receipt) {
        contractInfo(contractNetworkNew, address)
        const overviewInit = await overviewData(0, coinType)
        console.log('====>---', overviewInit)
        setInputValue(0)
        setWithdrawValue(0)
        setOverviewDataInit(overviewInit)
        setOverviewAfterDataInit(overviewInit)
        setIsLodingValue(false)
        setIsStateValue(3)
      }
    } catch (err) {
      console.log(err)
      setIsStateValue(1)
    }
  }
  /* eslint-disable */
  const checkAllowance = async (contract: object, address1: string) => {
    const isAllowance = await (
      contract as { allowance: (arg1: string, arg2: string) => Promise<any> }
    )?.allowance(address, address1)

    console.log(
      '--Allowance number--',
      isAllowance,
      Number(utilsFormatEther(isAllowance))
    )
    const allowanceNum = Number(utilsFormatEther(isAllowance))
    return allowanceNum
  }
  /* eslint-enable */
  const handleInputBlurMint1 = async () => {
    console.log('---', inputValue)
    let val = inputValue
    if (coinType == 1) {
      if (inputValue > Number(bitUsdBalance)) {
        setInputValue(Number(formatDecimal(bitUsdBalance, 4)))
        val = Number(formatDecimal(bitUsdBalance, 4))
      }
    } else {
      if (inputValue > Number(balanceWBTC)) {
        setInputValue(Number(formatDecimal(balanceWBTC, 4)))
        val = Number(formatDecimal(balanceWBTC, 4))
      }
    }
    const overviewInit = await overviewData(val, coinType)
    console.log('====>---', overviewInit)
    setOverviewAfterDataInit(overviewInit)
  }

  const handleInputBlurMint = async () => {
    console.log(withdrawValue, -withdrawValue)
    if (withdrawValue <= 0) return
    let val: number = withdrawValue
    if (coinType == 1) {
      const ava = overviewDataInit?.availableToMint
      if (ava !== undefined && withdrawValue > ava) {
        setWithdrawValue(Number(formatDecimal(ava, 2)))
        val = Number(formatDecimal(ava, 2))
      }
    } else {
      const ava = overviewDataInit?.availableToWithdraw
      if (ava !== undefined && withdrawValue > ava) {
        setWithdrawValue(Number(formatDecimal(ava, 2)))
        val = Number(formatDecimal(ava, 2))
      }
    }

    const overviewInit = await overviewData(val, coinType)
    console.log('====>---', overviewInit)
    setOverviewAfterDataInit(overviewInit)
  }
  /*
   * coinType=1=>bitusd;coinType=0=>wBTC
   */
  const handNextisDeposit = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    setIsApprove(true)
    console.log(isDeposit)
    if (coinType == 1) {
      if (!isDeposit) {
        //mint bitusd
      } else {
        //repay bitusd
        console.log('repay bitusd')
        const allowanceNum = await checkAllowance(
          BitUSDL2Contract,
          bitSmileyAddrees
        )
        allowanceNum >= inputValue ? setIsApprove(true) : setIsApprove(false)
      }
    } else {
      if (!isDeposit) {
        //withdraw
        console.log('withdraw')
      } else {
        //deposit wBTC
        console.log('deposit wBTC')
        const allowanceNum = await checkAllowance(
          TokenContract,
          bitSmileyAddrees
        )
        allowanceNum >= inputValue ? setIsApprove(true) : setIsApprove(false)
      }
    }
    setIsStateValue(2)
  }
  const handClickConfirm = async () => {
    if (coinType == 1) {
      if (!isDeposit) {
        mintFromBTCFun(withdrawValue, 0)
      } else {
        console.log('return bitUSD', inputValue)
        repayToBTCFun(inputValue, 0)
      }
    } else {
      console.log('WBTC', isDeposit)
      if (!isDeposit) {
        repayToBTCFun(0, withdrawValue)
      } else {
        console.log('return bitUSD', inputValue)
        mintFromBTCFun(0, inputValue)
      }
    }
  }

  const approveFun = async (contract: object, addrees: string) => {
    console.log('approve start--->', inputValue, contract)
    // const txId = await writeContractAsync({
    //   abi: erc721Abi,
    //   address: erc721Address,
    //   functionName: 'safeTransferFrom',
    //   args: [address, stakingAddress, BigInt(selectedTokenId), '0x']
    // })

    /* eslint-disable */
    const isAllowance = await (
      contract as { approve: (arg1: any, arg2: any) => Promise<any> }
    )?.approve(addrees, utilsParseEther(inputValue.toString()))
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
      setIsApprove(true)
    }
  }

  const handClickBack = () => {
    setIsStateValue(1)
  }

  const handApproveFun = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    if (coinType == 1) {
      approveFun(BitUSDL2Contract, bitSmileyAddrees)
    } else {
      approveFun(TokenContract, bitSmileyAddrees)
    }
  }

  const handClickOk = () => {
    setInputValue(0)
    setWithdrawValue(0)
    setIsStateValue(1)
  }
  if (isMobile(window.navigator).any) return <MobilePage />

  // if (isNetworkError) return <NetworkErrorPage />

  return (
    <div>
      <Header wallet />
      <div>
        <div className=" mx-auto mt-[164px] max-w-[1434px]">
          <TitleBox message="My Vaults" isWhite={true} />
        </div>
        <div className=" container mx-auto">
          <dl className="mx-auto mt-[9px] max-w-[1220px] ">
            <dt className="mb-[16px]">
              <ul className="table_title_color flex justify-center font-ibmb">
                {/* <li className="text-center mr-[50px]">Stability fee : 5.25% ⓘ</li>
                <li className="text-center mr-[50px]">Liquidity fee: 13% ⓘ</li>
                <li className="text-center mr-[50px]">Min Size: 0.5 BTC ⓘ</li>
                <li className="text-center mr-[50px]">Max LTV: 50% ⓘ</li> */}
                <li className="mr-[50px] text-center">
                  Stability fee: {listInfo.borrowRate * 100}% ⓘ{' '}
                </li>
                <li className="mr-[50px] text-center">Liquidity fee: 50% ⓘ </li>
                <li className="mr-[50px] text-center">
                  Min Size: {listInfo.minSize} $ ⓘ
                </li>
                <li className="mr-[50px] text-center">
                  Max LTV: {listInfo.maxLTV * 100}% ⓘ
                </li>
              </ul>
            </dt>
          </dl>
          <div className="line_bottom mb-[31px]"></div>

          <div className="flex justify-center pb-[250px]">
            <div className="grid_bg relative mr-[99px] h-[528px] w-[629px] flex-none">
              <div className="blendMode t-0 l-0 absolute"></div>
              <div className="relative h-[528px]">
                <CornerPin></CornerPin>
                <TitleBlock titleValue="Overview"></TitleBlock>
                <MintBitUsdOverviewBox
                  listData={overviewDataInit}
                  afterDataInit={overviewAfterDataInit}
                />
              </div>
            </div>
            <div className="grid_bg relative flex-none">
              <div className="blendMode_blue t-0 l-0 absolute"></div>
              <div className="relative h-[528px] w-[629px] px-[53px] ">
                <CornerPin></CornerPin>
                {isState == 4 ? (
                  <FailedTitleBlock />
                ) : (
                  <TitleBlock
                    titleValue={`${
                      isState == 2
                        ? 'Vault Changes'
                        : isState == 3
                          ? 'Changes Completed'
                          : 'Make Changes'
                    }`}></TitleBlock>
                )}

                {isState == 1 ? (
                  <TabBar
                    type={coinType}
                    handClickTypeChange={(i) => typeChangeFun(i)}
                  />
                ) : (
                  ''
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
                      type={coinType}
                      listData={overviewDataInit}
                      isDeposit={isDeposit}
                      bitUsdBalance={bitUsdBalance}
                      price={oraclePrice}
                      inputValue={inputValue}
                      withdrawValue={withdrawValue}
                      handNextisDeposit={handNextisDeposit}
                      handleInputChange1={handleInputChange1}
                      handOnFocusChange1={handOnFocusChange1}
                      handleBlur1={handleInputBlurMint1}
                      handleBlur={handleInputBlurMint}
                      handleInputChange={handleInputChange}
                      handOnFocusChange={handOnFocusChange}
                    />
                  ) : isState == 2 ? (
                    <ConfirmBox
                      type={coinType}
                      isApprove={isApprove}
                      afterDataInit={overviewAfterDataInit}
                      listData={overviewDataInit}
                      handApproveFun={handApproveFun}
                      handClickBack={handClickBack}
                      handClickConfirm={handClickConfirm}
                    />
                  ) : // <MintBitUSDBox toastMsg="ly created a vault. You can find it in “My Vault”. Continue to mint bitUSD from this vault"/>:
                  isState == 3 ? (
                    <MintBitUSDBox
                      isOk={true}
                      handleClick={() => {}}
                      handClickOk={handClickOk}
                      toastMsg="Your vault change is completed. You can find the changes in the Vault History below."
                    />
                  ) : (
                    <MintBitUSDBox
                      isOk={true}
                      handleClick={() => {}}
                      handClickOk={handClickOk}
                      toastMsg="Your vault change has encountered an error ⓘ. Please try again"
                    />
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

const TabBar: React.FC<{
  type: number
  handClickTypeChange: (i: number) => void
}> = ({ type, handClickTypeChange }) => {
  const items = [
    { id: 1, name: 'wBTC' },
    { id: 2, name: 'bitUSD' }
  ]
  const renderedItems = items.map((item, index) => (
    <span
      key={index}
      className={`${
        type == index
          ? 'bg-blue text-black transition duration-200 ease-in'
          : 'text-white transition duration-200 ease-in'
      } inline-block 
        cursor-pointer px-[12px] py-[2px] active:bg-blue`}
      onClick={() => handClickTypeChange(index)}>
      {item.name}
    </span>
  ))
  return (
    <>
      <div className="mt-[5px] border-b-[1px] border-blue font-ibmr">
        {renderedItems}
        {/* <span className="inline-block px-[12px] py-[2px] active:bg-blue text-white cursor-pointer">bitUSD</span> */}
      </div>
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
const FailedTitleBlock: React.FC = () => {
  return (
    <>
      <h3 className="flex h-[46px] items-center justify-center text-center font-ppnb text-[36px] text-[#FF0000]">
        <span className=" bg-black px-[24px]">Changes Failed</span>
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
  isDeposit: boolean
  inputValue: number
  withdrawValue: number
  type: number
  listData: overviewBoxObject
  bitUsdBalance: string | number
  price: string | number
  handOnFocusChange1: () => void
  handOnFocusChange: () => void
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handNextisDeposit: () => void
  handleInputChange1: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur1: () => void
  handleBlur: () => void
}> = ({
  price,
  handleBlur1,
  handleBlur,
  bitUsdBalance,
  handleInputChange1,
  handNextisDeposit,
  inputValue,
  isDeposit,
  handOnFocusChange1,
  withdrawValue,
  handOnFocusChange,
  type,
  listData,
  handleInputChange
}) => {
  return (
    <>
      {type == 0 ? (
        <div className="mb-[14px] mt-[15px] flex items-center justify-between font-ibmr text-[14px] text-white">
          <span>Deposit wBTC</span>
        </div>
      ) : type == 1 ? (
        <div className="mb-[14px] mt-[25px] flex items-center justify-between font-ibmr text-[14px] text-white">
          <span>Return bitUSD</span>
          <span>
            Total Debt: {formatMoney(formatDecimal(Number(bitUsdBalance)))}
          </span>
        </div>
      ) : (
        <></>
      )}
      <div className="mb-[15px] bg-black/[.35] px-[20px] py-[10px]">
        <input
          type="number"
          min="1"
          className={`input_style flex h-[47px] w-auto items-center font-ibmb
        text-[36px] leading-[47px] hover:border-none ${
          !isDeposit ? 'text-white/[.5] opacity-50' : ''
        }`}
          readOnly={!isDeposit}
          onFocus={handOnFocusChange1}
          onBlur={handleBlur1}
          value={inputValue}
          onChange={handleInputChange1}
        />
        {type == 0 ? (
          <p className="mt-3 font-ibmr text-[16px] text-white/[.8]">
            ~
            {formatMoney(
              formatDecimal((price as number) * (inputValue as number), 4)
            )}{' '}
            USD
          </p>
        ) : (
          <></>
        )}
      </div>
      <p className="h-[20px] text-center font-ibmr text-white">or</p>

      {type == 0 ? (
        <div className="-mt-[5px] mb-[7px] flex items-center justify-between font-ibmr text-[14px] text-white">
          <span>Withdraw</span>
          <span>
            Max:{' '}
            {formatMoney(formatDecimal(listData.availableToWithdraw || 0, 4))}
          </span>
        </div>
      ) : type == 1 ? (
        <div className="mb-[14px] mt-[26px] flex items-center justify-between font-ibmr text-[14px] text-white">
          <span>Mint</span>
          <span>
            Max: {formatMoney(formatDecimal(listData.availableToMint || 0, 4))}
          </span>
        </div>
      ) : (
        <></>
      )}

      {/* readOnly text-white/[.5] opacity-50*/}
      <div className="mb-[15px] bg-black/[.35] px-[20px] py-[10px]">
        <input
          type="number"
          min="1"
          className={`input_style  flex h-[47px] w-auto items-center font-ibmb
        text-[36px] leading-[47px] hover:border-none ${
          isDeposit ? 'text-white/[.5] opacity-50' : ''
        }`}
          readOnly={isDeposit}
          onFocus={handOnFocusChange}
          onBlur={handleBlur}
          value={withdrawValue}
          onChange={handleInputChange}
        />
        {type == 0 ? (
          <p className="mt-3 font-ibmr text-[16px] text-white/[.8]">
            ~
            {formatMoney(
              formatDecimal((price as number) * (withdrawValue as number), 4)
            )}{' '}
            USD
          </p>
        ) : (
          <></>
        )}
      </div>
      <div
        className={`flex justify-center ${
          type == 1 ? 'mt-[50px]' : 'mt-[28px]'
        } `}>
        <button
          className="relative flex h-[77px] w-[517px] items-center justify-between border-y-[3px]
          border-solid border-white bg-blue"
          onClick={handNextisDeposit}>
          <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
          <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
          <span className="ml-[21px] font-ppnb text-[48px] text-white">
            Next
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

const ConfirmBox: React.FC<{
  isApprove: boolean
  listData: overviewBoxObject
  afterDataInit: overviewBoxObject
  type: number
  handApproveFun: () => void
  handClickBack: () => void
  handClickConfirm: () => void
}> = ({
  type = 0,
  isApprove,
  listData,
  afterDataInit,
  handClickConfirm,
  handClickBack,
  handApproveFun
}) => {
  const items = [
    {
      id: 1,
      name: 'Collateral locked',
      num1:
        formatMoney(formatDecimal(listData.availableToWithdraw || 0, 4)) +
        ' BTC',
      num2:
        formatMoney(formatDecimal(afterDataInit.availableToWithdraw || 0, 4)) +
        ' wBTC'
    },
    {
      id: 2,
      name: 'Health factor',
      num1: formatMoney(formatDecimal(listData.collateralRate || 0, 2)) + '%',
      num2:
        formatMoney(formatDecimal(afterDataInit.collateralRate || 0, 2)) + '%'
    },
    {
      id: 3,
      name: 'Liquidation price',
      num1:
        '$ ' + formatMoney(formatDecimal(listData.liquidationPrice || 0, 4)),
      num2:
        '$ ' +
        formatMoney(formatDecimal(afterDataInit.liquidationPrice || 0, 4))
    },
    {
      id: 4,
      name: 'Available to mint',
      num1: '$ ' + formatMoney(formatDecimal(listData.availableToMint || 0, 4)),
      num2:
        '$ ' + formatMoney(formatDecimal(afterDataInit.availableToMint || 0, 4))
    },
    {
      id: 5,
      name: 'Available to withdraw',
      num1:
        formatMoney(formatDecimal(listData.availableToWithdraw || 0, 4)) +
        ' wBTC',
      num2:
        formatMoney(formatDecimal(afterDataInit.availableToWithdraw || 0, 4)) +
        ' wBTC'
    }
  ]
  const items2 = [
    {
      id: 1,
      name: 'Total debt',
      num1: '$ ' + formatMoney(formatDecimal(listData.debtBitUSD || 0, 4)),
      num2: '$ ' + formatMoney(formatDecimal(afterDataInit.debtBitUSD || 0, 4))
    },
    {
      id: 2,
      name: 'Health factor',
      num1: formatMoney(formatDecimal(listData.collateralRate || 0, 2)) + '%',
      num2:
        formatMoney(formatDecimal(afterDataInit.collateralRate || 0, 2)) + '%'
    },
    {
      id: 3,
      name: 'Liquidation Price',
      num1:
        '$ ' + formatMoney(formatDecimal(listData.liquidationPrice || 0, 4)),
      num2:
        '$ ' +
        formatMoney(formatDecimal(afterDataInit.liquidationPrice || 0, 4))
    },
    {
      id: 4,
      name: 'Available to mint',
      num1: '$ ' + formatMoney(formatDecimal(listData.availableToMint || 0, 4)),
      num2:
        '$ ' + formatMoney(formatDecimal(afterDataInit.availableToMint || 0, 4))
    },
    {
      id: 5,
      name: 'Available to withdraw',
      num1:
        formatMoney(formatDecimal(listData.availableToWithdraw || 0, 4)) +
        ' wBTC',
      num2:
        formatMoney(formatDecimal(afterDataInit.availableToWithdraw || 0, 4)) +
        ' wBTC'
    }
  ]
  let arr = []
  type == 0 ? (arr = items) : (arr = items2)
  const renderedItems = arr.map((item, index) => (
    <li
      key={index}
      className="mb-[12px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
      <span>{item.name}</span>
      <p className="flex items-center justify-between font-ibmb">
        <span>{item.num1}</span>
        <Image src={getOpenUrl('return')} className="ml-2 mr-[9px] w-[5px]" />
        <span className=""> {item.num2}</span>
      </p>
    </li>
  ))

  return (
    <>
      <ul className="mt-[59px]">{renderedItems}</ul>

      <div className="absolute bottom-[34px] mt-[28px] flex w-[520px] justify-between">
        <button
          className="bg-[#000000]/.5 relative flex h-[77px] w-[233px] items-center justify-center
          border-y-[3px] border-solid border-white"
          onClick={handClickBack}>
          <div className="button_bg3 absolute -left-[6px] -top-[3px]"></div>
          <div className="button_bg3 absolute -right-[6px] -top-[3px] rotate-180"></div>
          <span className="font-ppnb text-[48px] text-white">Back</span>
        </button>
        {!isApprove ? (
          <button
            className="relative flex h-[77px] w-[233px] items-center justify-center border-y-[3px]
          border-solid border-white bg-blue"
            onClick={handApproveFun}>
            <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
            <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
            <span className="ml-[21px] font-ppnb text-[48px] text-white">
              Approve
            </span>
            <Image
              src={getOpenUrl('Union02')}
              className="ml-2 mr-[21px] w-[22px]"
            />
          </button>
        ) : (
          <button
            className="relative flex h-[77px] w-[233px] items-center justify-center border-y-[3px]
        border-solid border-white bg-blue"
            onClick={handClickConfirm}>
            <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
            <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
            <span className="font-ppnb text-[48px] text-white">Confirm</span>
          </button>
        )}
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
  handClickOk: () => void
}> = ({ toastMsg, isOk = false, handleClick, handClickOk }) => {
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
              onClick={handClickOk}>
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
                className="ml-2 mr-[14px] w-[79px]"
              />
            </button>
          )}
        </div>
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
              %{formatDecimal(afterDataInit.collateralRate || 0, 2)} after ⓘ
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

export default MyVault
