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
import { LOCAL_STORAGE_KEYS,commonParam } from '@/config/settings'
import { AkarIconslinkOutIcon } from '@/assets/icons'
import './index.scss'
import { getFrameUrl, getOpenUrl, openUrl } from '@/utils/getAssetsUrl'
import { Link, useNavigate } from 'react-router-dom';
import {ProjectService} from '@/services/project'
import { bitSmileyABI,bitUSDABI,oraclesABI,vaultManagerABI} from '@/abi/abi'
import {utilsGetNetwork,utilsParseEther,getChainId,getGasPrice,utilsFormatEther,connectWallet,getWalletAddress,getBalance,creatContract,networkChange} from '@/ethersConnect'
import { useUserInfo } from '@/hooks/useUserInfo'
import { SCANTXHASH } from '@/config/links'
import {formatDecimal,formatMoney} from '@/utils/formatter'
import LoadingAnimation from '@/components/LoadingAnimation'
import { displayAddress } from '@/utils/formatter'

const OpenVault: React.FC = () => {
  const navigate = useNavigate();
  const isNetworkError = useSelector(getNetworkError)
  const [isEntered, setIsEntered] = useState(false)
  const [inputValue, setInputValue] = useState(0);
  const [isLoding, setIsLodingValue] = useState(false);
  //1=>Start ; 2=>mint bitUSD; 3=>mint bitUSD ing;4=> Minting Completed;5=>Changes Failed
  const [isState, setIsStateValue] = useState(1); 

  // const { address, isConnected } = useUserInfo()

  const [bitSmileyAddrees,setBitSmileyAddrees]= useState('')
  const [walletInfo, setWalletInfo] = useState([]);

  const [contractToken,setContractToken] = useState('')
  const [TokenContract,setTokenContract] = useState('')
  const [balanceWBTC,setBalanceWBTC] = useState(0)
  const [isApprove,setIsApprove] = useState(false)
  const [gasPrice,setGasPrice]= useState(0)
  const [transactionHash,setTransactionHash]= useState('')
  const [listInfo,setListInfo]= useState({borrowRate:'',liquidity:'',minSize:'',maxLTV:''})
  const [oracle ,setOracle] =useState('')
  const [oracleContract,setOracleContract] = useState(0)
  const [priceUSD,setPriceOracle] = useState(0)
  const [oraclePrice,setOraclePriceOracle] = useState(0)
  const [vaultManagerAddress,setVaultManagerAddress] = useState('')
  const [vaultManagerContract,setVaultManagerContract] = useState('')
  const [bitSmileyContract,setBitSmileyContract] = useState('')
  const [vault1,setVault1] = useState('')
  const [AvailableBitUSD,setAvailableBitUSD] = useState(0)
  const [currentNetwork,setCurrentNetwork] = useState(0)
  
  const [overviewDataInit,setOverviewDataInit] = useState({liquidationPrice: 0,
    collateralRate: 0,
    debtBitUSD: 0,
    lockedCollateral: 0,
    availableToWithdraw: 0,
    availableToMint: 0})
  const [overviewAfterDataInit,setOverviewAfterDataInit] = useState({liquidationPrice: 0,collateralRate: 0,
    debtBitUSD: 0,
    lockedCollateral: 0,
    availableToWithdraw: 0,
    availableToMint: 0})
  
  const isGlobalStatus = async()=>{
    let flag = true
    if(walletInfo.length==0){
      flag = false
      connectWallet()
    }else if(currentNetwork.chainId !=listInfo.chainId){
      flag = false
      const id =await utilsGetNetwork(listInfo.chainId)
      networkChange(id)
    }
    return flag
  }

  const projectFun = async()=>{
    try{
      const info = JSON.parse(getLocalStorage(LOCAL_STORAGE_KEYS.NETWORKINFO))
      console.log(info)
      setListInfo(info)
     
      const {data} = await ProjectService.getProjectInfo.call()
      console.log(data.data.web3Info[0].contract,gasPrice)
      const contractNetworkNew = data.data.web3Info[0].contract
      setContractToken(contractNetworkNew.WBTC)
      setBitSmileyAddrees(contractNetworkNew.BitSmiley)
      setVaultManagerAddress(contractNetworkNew.VaultManager)
      setOracle(contractNetworkNew.oracle)

      const gas =await getGasPrice()
      setGasPrice(gas)
      const a = await getWalletAddress()
      setWalletInfo(a)
      if(a.length==0){
        connectWallet()
      }

      const network = await getChainId()
      setCurrentNetwork(network)
      console.log(info.chainId)
      if(info.chainId != network.chainId){
        const id =await utilsGetNetwork(info.chainId)
        networkChange(id)
      }

      const vaultManager = await creatContract(contractNetworkNew.VaultManager,vaultManagerABI)
      console.log(vaultManager)
      setVaultManagerContract(vaultManager)

      const oracleCon = await creatContract(contractNetworkNew.oracle,oraclesABI)
      const price = await oracleCon.getPrice(commonParam.BTC)
      console.log(price,Number(utilsFormatEther(price)))
      setOracleContract(oracleCon)
      setOraclePriceOracle(Number(utilsFormatEther(price)))
      
      const contract = await creatContract(contractNetworkNew.WBTC,bitUSDABI)
      setTokenContract(contract)
      console.log(contract,walletInfo[0])
      
      const smileyContract=await creatContract(contractNetworkNew.BitSmiley,bitSmileyABI)
      setBitSmileyContract(smileyContract)
      const vault = await smileyContract.owners(a[0]);
      console.log('vault==>',vault)
      setVault1(vault)

      const balance = await contract.balanceOf(a[0])
      let b =utilsFormatEther(balance)
      setBalanceWBTC(b)
      console.log('--balance',balance,b,balance.toString(),'bitSmileyAddrees==',contractNetworkNew.BitSmiley)
      
      const isAllowance = await contract.allowance(a[0],contractNetworkNew.BitSmiley)
      console.log('--Allowance number--',isAllowance,Number(utilsFormatEther(isAllowance)))
      let allowanceNum = Number(utilsFormatEther(isAllowance))
      if(allowanceNum >= inputValue){
        setIsApprove(true)
      }else{
        setIsApprove(false)
      }
    }catch(err){console.log(err)}
  }
  const initData = async()=>{
    const overviewInit = await overviewData(0);
    console.log('====>---',overviewInit)
    setOverviewDataInit(overviewInit)
  }
  
  const getRealTimeOracle = async ()=>{
    const price = await oracleContract.getPrice(commonParam.BTC)
    // console.log(price,Number(utilsFormatEther(price)))
    setOraclePriceOracle(Number(utilsFormatEther(price)))
  }
  
  useEffect(() => {
    if(!oracleContract)return
    let timer;
    timer = setInterval(()=>[
      getRealTimeOracle()
    ],3000)
    return () => {
      clearInterval(timer);
    };
  },[oracleContract])

  useEffect(() => {
    console.log('vault1-------',vault1)
    if(vault1){
      if(vault1 != '0x0000000000000000000000000000000000000000'){
        setIsStateValue(3)
        setIsApprove(true)
      }
    }
  }, [vault1])
  useEffect(() => {
    console.log('vaultManagerContract',vaultManagerContract)
    if(vaultManagerContract && vault1){
      console.log('vaultManagerContract==1',vaultManagerContract)
      initData();
    }
  }, [vaultManagerContract,vault1])

  useEffect(() => {
    projectFun()
  }, [])
  useEffect(() => {
    if(vaultManagerContract){
      getAvailableBitUSD()
    }
  }, [vaultManagerContract,oraclePrice])

  const getAvailableBitUSD = async()=>{
    console.log(vaultManagerContract)
    // const bitUSDAmount = utilsParseEther(inputValue.toString());
    // const price = utilsParseEther(oraclePrice.toString());
    console.log('commonParam.BTC=',commonParam.BTC)
    // const collateral = await vaultManager.collateralTypes(BTC);
    // collateralEvaluation = _collateral_Input
    //             * 价格
    //             * collateral.safetyFactor
    //             / collateral.rate;
    const collateral = await vaultManagerContract.collateralTypes(commonParam.BTC);
    const safetyFactor = collateral.safetyFactor / 10**9
    const rate = collateral.rate / 10**27

    console.log('Input=',inputValue,'oraclePrice=',Number(oraclePrice),'safetyFactor=',safetyFactor,
    'rate=',rate)
   
    const collateralEvaluation = inputValue * oraclePrice * safetyFactor / rate
    console.log(collateralEvaluation)
    setAvailableBitUSD(collateralEvaluation)

    // const collateralEvaluation2 = await vaultManagerContract.evaluateCollateral(commonParam.BTC, bitUSDAmount);
    // let avail = utilsFormatEther(collateralEvaluation2)
    // console.log(avail)
    // setAvailableBitUSD(avail)
  }

  const blurSetupVault= async()=>{
    getAvailableBitUSD()
  }

  const handApproveFun= async()=>{
    const flag =await isGlobalStatus()
    if(!flag){
      return;
    }
    console.log('approve start--->',inputValue,TokenContract)
    const isAllowance = await TokenContract.approve(bitSmileyAddrees,utilsParseEther(inputValue.toString()))
    console.log(isAllowance)
    if(isAllowance.hash){
      setTransactionHash(isAllowance.hash)
      setIsLodingValue(true)
    }
    const receipt = await isAllowance.wait();
    console.log('Transaction confirmed:', receipt.transactionHash);
    console.log('Gas used:', receipt.gasUsed.toString());
    if(receipt){
      setIsLodingValue(false)
      setIsStateValue(1)
      setIsApprove(true)
    }
  }
  const StartFun= async()=>{
    const flag =await isGlobalStatus()
    if(!flag){
      return;
    }
    console.log('contractToken--',contractToken)
    console.log('setVlu-->',inputValue,gasPrice*1.2.toString())
    console.log(walletInfo,bitSmileyAddrees)
    try{
      const collateral = utilsParseEther(inputValue.toString());
      const contract=await creatContract(bitSmileyAddrees,bitSmileyABI)
      console.log(contract,collateral.toString())
      const gasLimit = await contract.estimateGas.openVaultAndMintFromBTC(
        0,
        collateral,
        { 
          gasPrice: gasPrice, 
        }
      );
      console.log('Estimated Gas Limit:', gasLimit);
      const transactionResponse=await contract.openVaultAndMintFromBTC(
          0,
          collateral,
          { 
            gasPrice: gasPrice,
            gasLimit: gasLimit,
          }
      )
      console.log(transactionResponse)
      if(transactionResponse){
        setTransactionHash(transactionResponse.hash)
        setIsLodingValue(true)
      }
      const receipt = await transactionResponse.wait();
      console.log('Transaction confirmed:', receipt.transactionHash);
      console.log('Gas used:', receipt.gasUsed.toString());
      if(receipt){
        const vault = await bitSmileyContract.owners(walletInfo[0]);
        console.log('vault==>',vault)
        setVault1(vault)
        setIsLodingValue(false)
        setIsStateValue(2)
        setIsApprove(true)
      }
    }catch(err){
      setIsStateValue(5)
      console.log(err)
    }
  }

  const overviewData = async(val)=>{
    // bitSmileyContract
    console.log(vaultManagerContract)
    const safeRate = commonParam.safeRate; // 50%
    const bitUSDAmount = utilsParseEther(val.toString());
    console.log('commonParam.BTC=',commonParam.BTC,'vault1=',vault1,'bitUSDAmount=',Number(bitUSDAmount))
    // BTC, vault1, collateral, bitUSDAmount
    // var vaultManager = await creatContract(vaultManagerAddress,vaultManagerABI)
    const result = await vaultManagerContract.getVaultChange(commonParam.BTC,vault1,0,bitUSDAmount,safeRate * 10000000)
    console.log(result)
    console.log(result.liquidationPrice)
    const arr={}
    arr.liquidationPrice = Number(utilsFormatEther(result.liquidationPrice.toString()))
    arr.collateralRate = result.collateralRate / 1000 * 100
    arr.debtBitUSD = Number(utilsFormatEther(result.debtBitUSD))
    arr.lockedCollateral = Number(utilsFormatEther(result.lockedCollateral.toString()))
    arr.availableToWithdraw = Number(utilsFormatEther(result.availableToWithdraw.toString()))
    arr.availableToMint = Number(utilsFormatEther(result.availableToMint.toString()))
    console.log(arr)
    return arr
  }

  const handleInputChange = (event) => {
    const regex = /^\d*\.?\d*$/;
    const newValue = event.target.value; 
    if (regex.test(newValue)) {
      setInputValue(newValue);
    }
  };


  const handleInputBlurMint=async (event)=>{
    console.log(inputValue)
    if(inputValue<=0)return;
    if(inputValue > overviewDataInit.availableToMint){
      setInputValue(formatDecimal(String(overviewDataInit.availableToMint),4));
    }
    const overviewInit = await overviewData(inputValue);
    console.log('====>---',overviewInit)
    setOverviewAfterDataInit(overviewInit)
  }

  const onClickMintBitUsd = async()=>{
    const flag =await isGlobalStatus()
    if(!flag){
      return;
    }
    console.log(inputValue,bitSmileyContract)
    if(inputValue<=0)return
    try{
      const USDAmount=utilsParseEther(inputValue.toString());
      console.log('vault1===',vault1,'bitUSDAmount',USDAmount.toString(),)

      const gasLimit = await bitSmileyContract.estimateGas.mintFromBTC(
        vault1,
        USDAmount,
        0,//btc
        { value: 0 ,gasPrice: gasPrice}
      );
      const result=await bitSmileyContract.mintFromBTC(
        vault1,
        USDAmount,
        0,//btc
        {
          gasPrice: gasPrice,
          gasLimit: gasLimit
        }
      )
      if(result){
        setTransactionHash(result.hash)
        setIsLodingValue(true)
        // setIsStateValue(2)
      }
      const receipt = await result.wait();
      console.log('Transaction confirmed:', receipt.transactionHash);
      console.log('Gas used:', receipt.gasUsed.toString());
      if(receipt){
        setIsLodingValue(false)
        setIsStateValue(4)
      }
      
    }catch(err){
      console.log(err)
    }
    

  }
  const handClickFild = ()=>{
    setIsStateValue(1)
  }
  const okClick = ()=>{
    navigate('/mainNet')
  }
  if (isMobile(window.navigator).any) return <MobilePage />

  // if (isNetworkError) return <NetworkErrorPage />
  
  return (
    <div>
      <Header wallet/>
      <div>
        <div className=" max-w-[1434px] mx-auto mt-[164px]">
          <TitleBox message={
            isState==1||isState==5?'Open a wBTC1 Vault':
            isState==2?'wBTC1 Vault':
            `wBTC1 Vault: ${displayAddress(vault1)}`
          } isWhite='true'/>
        </div>
        <div className=" container mx-auto">
          <dl className="max-w-[1220px] mx-auto mt-[9px] ">
            <dt className="mb-[16px]">
              <ul className="flex justify-center table_title_color font-ibmb">
                <li className="text-center mr-[50px]">Borrow rate : {listInfo.borrowRate * 100}% ⓘ </li>
                <li className="text-center mr-[50px]">Liquidity fee: 50% ⓘ </li>
                <li className="text-center mr-[50px]">Min Size: {listInfo.minSize} $ ⓘ</li>
                <li className="text-center mr-[50px]">Max LTV: {listInfo.maxLTV * 100}% ⓘ</li>
              </ul>
              {/* <networkInfo list={listInfo}/> */}
            </dt>
          </dl>
          <div className="line_bottom mb-[31px]"></div>


          <div className="flex justify-center pb-[250px]">
            <div className="flex-none grid_bg relative w-[629px] h-[528px] mr-[99px]">
            <div className="blendMode absolute t-0 l-0"></div>
              <div className="relative h-[528px]">
                <CornerPin></CornerPin>
                <TitleBlock titleValue="Overview"></TitleBlock>
                {
                  isState==3 || isState==4?
                  <MintBitUsdOverviewBox listData={overviewDataInit} afterDataInit={overviewAfterDataInit}/>:
                  <OverviewBox isOpacity={true}/>
                }
              </div>
            </div>
            <div className="flex-none grid_bg relative">
              <div className="blendMode_blue absolute t-0 l-0"></div>
              <div className="w-[629px] relative h-[528px] px-[53px] ">
                <CornerPin></CornerPin>
                {
                  isState==5?<FailedTitleBlock/>:
                  <TitleBlock titleValue={`${isState==3?'Mint bitUSd':isState==4?'Minting Completed':'Setup Vault'}`}></TitleBlock>
                }
                
                <div>
                  {
                    isLoding ?<LoadingBox openUrlClick={()=>openUrl(`${SCANTXHASH.test}${transactionHash}`)}/>:
                    isState==1?
                    <SetupVault balance={balanceWBTC} 
                    AvailableBitUSD={AvailableBitUSD}
                    price={oraclePrice}
                    inputValue={inputValue} 
                    isApprove={isApprove}
                    handleBlur={blurSetupVault}
                    handleInputChange={handleInputChange} 
                    handApproveFun={handApproveFun} 
                    handStartFun={StartFun}/>:
                    isState==2?
                    <MintBitUSDBox toastMsg="ly created a vault. You can find it in “My Vault”. Continue to mint bitUSD from this vault"
                    handleClick={()=>{
                      setIsStateValue(3)
                    }}
                    />:
                    isState==3?
                    <MintBitUSDIng 
                    afterDataInit={overviewAfterDataInit}
                    listData={overviewDataInit}
                    inputValue={inputValue} 
                    handOnClickMint={onClickMintBitUsd}
                    handleBlur={handleInputBlurMint} 
                    handleInputChange={handleInputChange}/>:
                    isState==4?
                    <MintBitUSDBox isOk="true" toastMsg="Your vault change is completed. You can find the changes in the Vault History below."
                    handleOkClick={okClick}/>:
                    isState==5?
                    <MintBitUSDBox isOk="true" handleOkClick={handClickFild} toastMsg="Your vault change has encountered an error ⓘ. Please try again"/>:<></>
                  }
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
  list:Object
}> = ({list}) =>{
  return (
    <>
      <ul className="flex justify-center table_title_color font-ibmb">
        <li className="text-center mr-[50px]">Borrow rate : {list.borrowRate * 100}% ⓘ </li>
        <li className="text-center mr-[50px]">Liquidity fee: {list.liquidity * 100}% ⓘ </li>
        <li className="text-center mr-[50px]">Min Size: {list.minSize} BTC ⓘ</li>
        <li className="text-center mr-[50px]">Max LTV: {list.maxLTV * 100}% ⓘ</li>
      </ul>
    </>
    
  )
  
}

const TitleBlock: React.FC<{
  titleValue:String
}> = ({titleValue}) =>{
  return(
    <>
      <h3 className="text-center text-[36px] font-ppnb text-white h-[46px] flex justify-center items-center">  
        <span className="bg-black px-[24px]">
          {titleValue}
        </span>        
      </h3>
    </>
  )
}

const CornerPin: React.FC<{}> = ({}) =>{
  return(
    <>
      <div className="union01 absolute left-0 top-[22px] w-[24px] h-[24px]"></div>
      <div className="union01 rotate-90 absolute right-0 top-[22px] w-[24px] h-[24px]"></div>
      <div className="union01 -rotate-90 absolute left-0 bottom-0 w-[24px] h-[24px]"></div>
      <div className="union01 -rotate-180 absolute right-0 bottom-0 w-[24px] h-[24px]"></div>
    </>
  )
}


const SetupVault: React.FC<{
  inputValue: Number
  balance:any
  isApprove:Boolean
  price:Number
  AvailableBitUSD:any
  handleInputChange:() => void
  handStartFun:()=>void
  handApproveFun:()=>void
  handleBlur:()=>void
}> = ({inputValue,balance,handleBlur,AvailableBitUSD,price,isApprove=false,handleInputChange,handStartFun,handApproveFun}) => {
  return (
    <>
      <div className="flex justify-between items-center mt-[84px] text-[16px] font-ibmr text-white mb-[27px]">
        <span>Deposit BTC</span>
        <span>{Number(balance)} available</span>
      </div>
      <div className="bg-black/[.35] py-[10px] px-[20px] mb-[27px]">
        <input type="number" min="1" className="input_style font-ibmb text-[36px] hover:border-none flex items-center
        h-[47px] w-auto leading-[47px]" 
        onBlur={handleBlur}
        value={inputValue} 
        onChange={handleInputChange} />
        <p className="text-white mt-3 font-ibmr text-[16px] text-white/[.8]">~
        { formatMoney(formatDecimal(String(price * inputValue),4))} USD</p>
      </div>

      <ul>
        {/* <li className="flex justify-between items-center font-ibmr text-white text-[16px] mb-[8px] h-[21px]">
          <span>Collateral locked</span>
          <p className="flex justify-between items-center font-ibmb">
            <span>0.00 BTC </span>
            <Image src={getOpenUrl('return')} className="w-[5px] mr-[9px] ml-2"/> 
            <span className="text-green"> 1.00 BTC</span></p>
        </li> */}
        <li className="flex justify-between items-center font-ibmr text-white text-[16px] mb-[8px] h-[21px]">
          <span>Available to generate bitUSD</span>
          <p className="flex justify-between items-center font-ibmb">
            <span>{formatMoney(formatDecimal(AvailableBitUSD),4)} $ </span>
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
      <div className="flex justify-center mt-[78px]">
        {
          !isApprove?
          <button className="flex justify-center items-center w-[517px] h-[77px] bg-blue relative
          border-solid border-y-[3px] border-white"
          onClick={handApproveFun}>
            <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
            <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
            <span className="ml-[21px] font-ppnb text-[48px] text-white">Give permission  to use BTC</span>
            <Image src={getOpenUrl('Union02')} className="w-[22px] mr-[21px] ml-2"/> 
          </button>:
          <button className="flex justify-between items-center w-[517px] h-[77px] bg-blue relative
          border-solid border-y-[3px] border-white"
          onClick={handStartFun}>
            <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
            <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
            <span className="ml-[21px] font-ppnb text-[48px] text-white">Start</span>
            <Image src={getOpenUrl('union01')} className="w-[79px] mr-[14px] ml-2"/> 
          </button>
        }
      </div>
    </>
  )
}

const MintBitUSDIng: React.FC<{
  inputValue: Number
  listData:Array
  afterDataInit:Object
  handleBlur:()=>void
  handOnClickMint:()=>void
  handleInputChange:() => void
}> = ({inputValue,handleInputChange,handOnClickMint,afterDataInit,listData,handleBlur}) => {
  return (
    <>
      <div className="flex justify-between items-center mt-[44px] text-[16px] font-ibmr text-white mb-[27px]">
        <span>Mint bitUSD</span>
        <span>Max: {formatMoney(formatDecimal(String(listData.availableToMint),4))} $</span>
      </div>
      <div className="bg-black/[.35] py-[10px] px-[20px] mb-[27px] relative">
        <input type="number" min="1" className="input_style font-ibmb text-[36px] hover:border-none flex items-center
        h-[47px] w-auto leading-[47px]" 
        placeholder="1"
        onBlur={handleBlur}
        value={inputValue} 
        onChange={handleInputChange} />
        <p className="mt-3 absolute right-[20px] -top-[17px] text-blue/[.5] font-ppnb text-[48px]">
          bitUSD
        </p>
      </div>

      <ul>
        <li className="flex justify-between items-center font-ibmr text-white text-[16px] mb-[8px] h-[21px]">
          <span className="whitespace-nowrap">Vault Debt</span>
          <p className="flex justify-between items-center font-ibmb">
            <span>{formatMoney(formatDecimal(String(listData.debtBitUSD),4))} $ </span>
            <Image src={getOpenUrl('return')} className="w-[5px] mr-[9px] ml-2"/> 
            <span className="text-green"> {formatMoney(formatDecimal(String(afterDataInit.debtBitUSD),4))} $</span></p>
        </li>
        <li className="flex justify-between items-center font-ibmr text-white text-[16px] mb-[8px] h-[21px]">
          <span className="whitespace-nowrap">Health factor</span>
          <p className="flex justify-between items-center font-ibmb">
            <span>{formatDecimal(String(listData.collateralRate),2)} % </span>
            <Image src={getOpenUrl('return')} className="w-[5px] mr-[9px] ml-2"/> 
            <span className="text-green"> {formatDecimal(String(afterDataInit.collateralRate),2)} %</span></p>
        </li>
        <li className="flex justify-between items-center font-ibmr text-white text-[16px] mb-[8px] h-[21px]">
          <span className="whitespace-nowrap">Available to mint bitUSD</span>
          <p className="flex justify-between items-center font-ibmb whitespace-nowrap">
            <span>{formatMoney(formatDecimal(String(listData.availableToMint),4))} $ </span>
            <Image src={getOpenUrl('return')} className="w-[5px] mr-[9px] ml-2"/> 
            <span className="text-green"> {formatMoney(formatDecimal(String(afterDataInit.availableToMint),4))} $</span>
          </p>
        </li>
        <li className="flex justify-between items-center font-ibmr text-white text-[16px] mb-[8px] h-[21px]">
          <span className="whitespace-nowrap">Liquidation Price</span>
          <p className="flex justify-between items-center font-ibmb">
            <span>{formatMoney(formatDecimal(String(listData.liquidationPrice),4))} $ </span>
            <Image src={getOpenUrl('return')} className="w-[5px] mr-[9px] ml-2"/> 
            <span className="text-green"> {formatMoney(formatDecimal(String(afterDataInit.liquidationPrice),4))} $</span>
          </p>
        </li>
      </ul>

      <div className="flex justify-center mt-[28px] absolute bottom-[34px]">
        <button className="flex justify-between items-center w-[517px] h-[77px] bg-blue relative
        border-solid border-y-[3px] border-white"
        onClick={handOnClickMint}>
          <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
          <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
          <span className="ml-[21px] font-ppnb text-[48px] text-white">Start</span>
          <Image src={getOpenUrl('union01')} className="w-[79px] mr-[14px] ml-2"/> 
        </button>
      </div>
    </>
  )
}

const LoadingBox: React.FC<{
  handleClick:() => void
  openUrlClick:() => void
}> = ({handleClick,openUrlClick}) =>{
  return(
    <>
      <div>
        <p className="text-center max-w-[381px] m-auto leading-[20px] my-[163px]">
          <span className=" text-white font-ibmr"
          onClick={openUrlClick}>
            Your transaction is getting processed on-chain <span className="text-green">[Check here]</span>
          </span>
        </p>
        <div className="flex justify-center mt-[28px] absolute bottom-[34px]">
          <button className="flex justify-center items-center w-[517px] h-[77px] bg-white/[.2] relative
          border-solid border-y-[3px] border-white/[.5]">
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
  toastMsg: String
  isOk:Boolean
  handleClick:() => void
  handleOkClick:()=>void
}> = ({toastMsg,isOk=false,handleClick,handleOkClick}) =>{
  return(
    <>
      <div>
        <p className="text-center max-w-[381px] m-auto leading-[20px] my-[163px] text-white font-ibmr">
          {toastMsg}
        </p>
        <div className="flex justify-center mt-[28px] absolute bottom-[34px]">
          {
            isOk?
            <button className="flex justify-center items-center w-[517px] h-[77px] bg-blue relative
            border-solid border-y-[3px] border-white"
            onClick={handleOkClick}>
              <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
              <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
              <span className="ml-[21px] font-ppnb text-[48px] text-white">Ok</span>
            </button>
            :
            <button className="flex justify-between items-center w-[517px] h-[77px] bg-blue relative
            border-solid border-y-[3px] border-white"
            onClick={handleClick}
            >
              <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
              <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
              <span className="ml-[21px] font-ppnb text-[48px] text-white">Mint bitUSD</span>
              <Image src={getOpenUrl('union01')} className="w-[79px] mr-[14px]"/> 
            </button>
          }
          
        </div>
      </div>
    </>
  )
}

const OverviewBox: React.FC<{ 
  isOpacity: Boolean
  listData:Array
  handleClick:() => void
}> = ({isOpacity,listData,handleClick}) =>{
  return(
    <>
    <div className="mt-[94px] flex justify-center items-center">
      <Image src={getOpenUrl('Untitled')} className="w-[251px] mr-[44px]"/>
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
  isOpacity: Boolean
  listData:Array
  afterDataInit:Array
  handleClick:() => void
}> = ({isOpacity,listData,afterDataInit,handleClick}) =>{
  return(
    <>
    <div className="mt-[10px]  px-[30px]">
      <div className={`text-white px-[30px] flex flex-wrap justify-between items-center ${isOpacity?'opacity-50':''}`}>
        <div className="w-[50%] mt-[24px]">
          <p className="text-base font-ibmr">Liquidation Price</p>
          <h1 className="text-[72px] leading-[51px] font-ppnb mt-1 mb-4">${formatMoney(formatDecimal(String(listData.liquidationPrice),4))}</h1>
          <div className="relative font-ibmr w-[196px] h-[31px] text-white bg-black pl-[8px] flex items-center"> 
            $ {formatMoney(formatDecimal(String(afterDataInit.liquidationPrice),4))} after ⓘ 
            {/* $ {afterDataInit.liquidationPrice} after ⓘ  */}
          </div>
        </div>
        <div className="w-[50%] mt-[24px] pl-[10px]">
          <p className="text-base font-ibmr">Health factor</p>
          <h1 className="text-[72px] leading-[51px] font-ppnb mt-1 mb-4">{formatDecimal(String(listData.collateralRate),2)}%</h1>
          <div className="relative font-ibmr w-[196px] h-[31px] text-white bg-black pl-[8px] flex items-center"> 
            % {formatDecimal(String(afterDataInit.collateralRate),2)} after ⓘ
          </div>
        </div>
        <div className="w-[50%] mt-[24px]">
          <p className="text-base font-ibmr">Vault Debt</p>
          <h1 className="text-[72px] leading-[51px] font-ppnb mt-1 mb-4">${formatMoney(formatDecimal(String(listData.debtBitUSD),4))}</h1>
          <div className="relative font-ibmr w-[196px] h-[31px] text-white bg-black pl-[8px] flex items-center"> 
            $ {formatMoney(formatDecimal(String(afterDataInit.debtBitUSD),4))} after ⓘ 
          </div>
        </div>


      </div>

      <div className={`text-white/[.7] flex justify-center items-start mt-[20px]`}>
        <div className="mt-[24px]">
          <p className="font-ibmr text-[14px] whitespace-nowrap">Collateral locked</p>
          <h1 className="text-[32px] leading-[32px] font-ppnb mb-[6px] whitespace-nowrap"> {formatMoney(formatDecimal(String(listData.lockedCollateral),4))} BTC</h1>
          <div className="relative text-[14px] font-ibmr min-w-[100px] h-[31px] text-white bg-black pl-[8px] flex items-center"> 
            {formatMoney(formatDecimal(String(afterDataInit.lockedCollateral),4))} after 
          </div>
        </div>
        <div className="mt-[24px] pl-[18px] pr-[18px]">
          <p className="font-ibmr text-[14px] whitespace-nowrap">Available to withdraw</p>
          <h1 className="text-[32px] leading-[32px] font-ppnb mb-[6px] whitespace-nowrap"> {formatMoney(formatDecimal(String(listData.availableToWithdraw),4))} BTC</h1>
          <div className="relative text-[14px] font-ibmr min-w-[100px] h-[31px] text-white bg-black pl-[8px] flex items-center"> 
            {formatMoney(formatDecimal(String(afterDataInit.availableToWithdraw),4))} after 
          </div>
        </div>
        <div className="mt-[24px]">
          <p className="font-ibmr text-[14px] whitespace-nowrap ">Available to mint</p>
          <h1 className="text-[32px] leading-[32px] font-ppnb mb-[6px] whitespace-nowrap"> {formatMoney(formatDecimal(String(listData.availableToMint),4))} bitUSD</h1>
          <div className="relative text-[14px] font-ibmr min-w-[100px] h-[31px] text-white bg-black pl-[8px] flex items-center"> 
            {formatMoney(formatDecimal(String(afterDataInit.availableToMint),4))} after 
          </div>
        </div>
      </div>

    </div>
    </>
  )
}

const FailedTitleBlock: React.FC<{
  titleValue:String 
}> = ({titleValue}) =>{
  return(
    <>
      <h3 className="text-center text-[36px] font-ppnb text-[#FF0000] h-[46px] flex justify-center items-center">  
        <span className=" bg-black px-[24px]">
          Changes Failed
        </span>        
      </h3>
    </>
  )
}

export default OpenVault
