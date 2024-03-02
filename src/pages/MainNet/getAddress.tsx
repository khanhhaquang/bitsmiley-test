// import React, { useState, useEffect } from 'react'
// import { ethers } from 'ethers'

// // const provider = new ethers.providers.Web3Provider(window.ethereum);
// // const provider = new ethers()
// interface WalletProps {
//   address: string
//   balance: number
// }

// const useWallet = (): WalletProps => {
//   const [address, setAddress] = useState<string>('')
//   const [balance, setBalance] = useState<number>(0)

//   useEffect(() => {
//     const loadWallet = async () => {
//       const accounts = await provider.listAccounts()
//       setAddress(accounts[0])

//       const weiBalance = await provider.getBalance(accounts[0])
//       const etherBalance = ethers.utils.formatEther(weiBalance)
//       setBalance(parseFloat(etherBalance))
//     }

//     loadWallet()
//   }, [])

//   return { address, balance }
// }

// const Wallet: React.FC = () => {
//   const { address, balance } = useWallet()

//   return (
//     <div>
//       <p>Address: {address}</p>
//       <p>Balance: {balance} ETH</p>
//     </div>
//   )
// }

// export default Wallet
