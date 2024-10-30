import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { Abi, erc20Abi, erc721Abi } from 'viem'

import bitSmileyAbi from './src/abi/BitSmiley.json'
import BitSmileyMerkleErc20Airdrop from './src/abi/BitSmileyMerkleErc20Airdrop.json'
import bitSmileyQueryAbi from './src/abi/BitSmileyQuery.json'
import bitUsdAbi from './src/abi/BitUsd.json'
import bitUsdL2Abi from './src/abi/BitUsdL2.json'
import oracleAbi from './src/abi/Oracle.json'
import registerAbi from './src/abi/Register.json'
import erc721StakingAbi from './src/abi/Staking.json'
import vaultManagerAbi from './src/abi/VaultManager.json'
import zetaConnectorAbi from './src/abi/BitSmileyZetaConnector.json'

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
    out: 'src/contracts/ERC20.ts',
    contracts: [
      {
        name: 'ERC20',
        abi: erc20Abi
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
    out: 'src/contracts/BitSmileyQuery.ts',
    contracts: [
      {
        name: 'BitSmileyQuery',
        abi: bitSmileyQueryAbi as Abi
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
  },
  {
    out: 'src/contracts/Register.ts',
    contracts: [
      {
        name: 'Register',
        abi: registerAbi as Abi
      }
    ],
    plugins: [react()]
  },
  {
    out: 'src/contracts/Airdrop.ts',
    contracts: [
      {
        name: 'Airdrop',
        abi: BitSmileyMerkleErc20Airdrop as Abi
      }
    ],
    plugins: [react()]
  },
  {
    out: 'src/contracts/ZetaConnector.ts',
    contracts: [
      {
        name: 'ZetaConnector',
        abi: zetaConnectorAbi as Abi
      }
    ],
    plugins: [react()]
  }
])
