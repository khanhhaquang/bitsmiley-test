import { type Abi } from 'viem'
import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import stakingABI from './src/abi/Staking.json'

export default defineConfig({
  out: 'src/hooks/stakingContracts.ts',
  contracts: [
    {
      name: 'staking',
      abi: stakingABI.abi as Abi
    }
  ],
  plugins: [react()]
})
