import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import erc721StakingAbi from './src/abi/Staking.json'
import { merlinTestnet } from './src/config/wagmi'
import { Abi } from 'viem'

export default defineConfig({
  out: 'src/contracts/generated.ts',
  contracts: [
    {
      name: 'StakingContract',
      abi: erc721StakingAbi as Abi,
      address: {
        [merlinTestnet.id]: '0x1094187ec416ef2e6ae7fc70f10a9b6d4988f108'
      }
    }
  ],
  plugins: [react()]
})
