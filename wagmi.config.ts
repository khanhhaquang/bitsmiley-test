import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import erc721StakingAbi from './src/abi/Staking.json'
import { Abi, erc721Abi } from 'viem'
import {vaultManagerABI,bitSmileyABI}  from './src/abi/abi'

export default defineConfig([
  {
    out: 'src/contracts/Staking.ts',
    contracts: [
      {
        name: 'StakingContract',
        abi: erc721StakingAbi as Abi
      }
    ],
    plugins: [react()]
  },
  {
    out: 'src/contracts/ERC721.ts',
    contracts: [
      {
        name: 'ERC721',
        abi: erc721Abi
      }
    ],
    plugins: [react()]
  },
  {
    out: 'src/contracts/vaultManager.ts',
    contracts: [
      {
        name: 'vaultManager',
        abi: vaultManagerABI as Abi
      }
    ],
    plugins: [react()]
  },
  {
    out: 'src/contracts/smileyContract.ts',
    contracts: [
      {
        name: 'smileyContract',
        abi: bitSmileyABI as Abi
      }
    ],
    plugins: [react()]
  }
])
