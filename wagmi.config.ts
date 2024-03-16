import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { Abi, erc721Abi } from 'viem'

import bitSmileyAbi from './src/abi/BitSmiley.json'
import bitUsdAbi from './src/abi/BitUsd.json'
import bitUsdL2Abi from './src/abi/BitUsdL2.json'
import oracleAbi from './src/abi/Oracle.json'
import erc721StakingAbi from './src/abi/Staking.json'
import vaultManagerAbi from './src/abi/VaultManager.json'

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
    out: 'src/contracts/Vault.ts',
    contracts: [
      {
        name: 'Vault',
        abi: vaultManagerAbi as Abi
      }
    ],
    plugins: [react()]
  },
  {
    out: 'src/contracts/BitSmiley.ts',
    contracts: [
      {
        name: 'BitSmiley',
        abi: bitSmileyAbi as Abi
      }
    ],
    plugins: [react()]
  },
  {
    out: 'src/contracts/Oracle.ts',
    contracts: [
      {
        name: 'Oracle',
        abi: oracleAbi as Abi
      }
    ],
    plugins: [react()]
  },
  {
    out: 'src/contracts/BitUsd.ts',
    contracts: [
      {
        name: 'BitUsd',
        abi: bitUsdAbi as Abi
      }
    ],
    plugins: [react()]
  },
  {
    out: 'src/contracts/BitUsdL2.ts',
    contracts: [
      {
        name: 'BitUsdL2',
        abi: bitUsdL2Abi as Abi
      }
    ],
    plugins: [react()]
  }
])
