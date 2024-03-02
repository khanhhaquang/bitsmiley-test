import { ethers } from 'ethers'
import { ChainCfg } from './config/chain'
// let provider: object = {}
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
// import { useStoreActions } from '@/hooks/useStoreActions'
// const { setAccountInfo, setLoginType, resetStorage } = useStoreActions()
if (typeof window.ethereum !== 'undefined') {
  // provider = new ethers.providers.Web3Provider(window.ethereum)
  // signer = provider.getSigner()
  // signer = (provider as object).getSigner()
  console.log(ethers, '------>', provider, signer)
  window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
    console.log('accountsChanged-->', accounts)
    if (accounts.length > 0) {
      const newAccount = accounts[0]
      console.log('MetaMask Account Changed:', newAccount)
      window.location.reload()
    } else {
      console.log('MetaMask Account Disconnected')
    }
  })
  window.ethereum.on('networkChanged', (networkId: number) => {
    console.log('MetaMask Network Changed:', networkId)
    window.location.reload()
  })
  // const chainId = await ethereum.request({ method: 'eth_chainId' });
  // ethereum.on('chainChanged', handleChainChanged);

  // function handleChainChanged(chainId) {
  //   window.location.reload();
  // }
} else {
  console.error('window.ethereum undefind')
}
export const getChainId = async () => {
  const network = await provider.getNetwork()
  console.log('Current MetaMask Network:', network.chainId)
  return network
}
export const connectWallet = async () => {
  try {
    if (window.ethereum) {
      const accounts = await window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .catch((err: { code: number }) => {
          console.error(err)
          if (err.code === 4001) {
            console.log('Please connect to MetaMask.')
          } else {
            console.error(err)
          }
        })
      console.log(accounts)

      const network = await provider.getNetwork()
      console.log('Network ID:', network.chainId)
      console.log('Network Name:', network.name)
      const gasPrice = await provider.getGasPrice()
      console.log('Current Gas Price:', gasPrice.toString())
      return accounts
    } else {
      console.error(
        'Ethereum not found. Please install MetaMask or another Web3 wallet.'
      )
    }
  } catch (error) {
    console.error('Failed to connect wallet:', error)
  }
}

export const getWalletAddress = async () => {
  const accounts = await provider.listAccounts()
  console.log('Current MetaMask Account:', accounts)
  if (accounts.length > 0) {
    const currentAccount = accounts[0]
    console.log('Current MetaMask Account:', currentAccount)
  } else {
    console.log('No MetaMask Account Connected')
  }
  return accounts
}

export const getBalance = async (address: string) => {
  try {
    const balance = await provider.getBalance(address)
    return ethers.utils.formatEther(balance)
  } catch (error) {
    console.error('Failed to get balance:', error)
  }
}

/* eslint-disable */
export const creatContract = async (address:string, abi:any) => {
  const contract = await new ethers.Contract(address, abi, signer)
  return contract
}
/* eslint-enable */

export const utilsFormatEther = (balance: string) => {
  return ethers.utils.formatEther(balance)
}

export const utilsParseEther = (balance: string) => {
  return ethers.utils.parseEther(balance)
}

export const getGasPrice = async () => {
  const gasPrice = await provider.getGasPrice()
  console.log('Current Gas Price:', gasPrice.toString())
  return gasPrice
}

const networkAdd = (addParams: object) => {
  console.log('ethereum', window.ethereum)

  window.ethereum
    .request({
      method: 'wallet_addEthereumChain',
      params: [addParams]
    })
    .then(() => {})
}

export const networkChange = (chainId: number) => {
  console.log('networkChange=====ethereum', window.ethereum, chainId)
  window.ethereum
    .request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainId }]
    })
    .then(() => {})
    .catch((e: { code: number }) => {
      if (e.code === 4902) {
        try {
          networkAdd(ChainCfg[chainId])
        } catch (err: unknown) {
          console.log(err)
        }
      }
    })
}

export const utilsGetNetwork = async (chainId: number) => {
  const network = await ethers.utils.hexValue(chainId)
  console.log('Network:', network)
  return network
}
