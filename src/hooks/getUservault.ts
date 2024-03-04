import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { commonParam } from '@/config/settings'

import { useReadSmileyContractOwners } from '@/contracts/smileyContract'

import useContractAddresses from './useNetworkAddresses'
import { useUserInfo } from './useUserInfo'
import { utilsParseEther } from '@/ethersConnect'

const getUservault = () => {
  const contractAddresses = useContractAddresses()
  const { address } = useUserInfo()
  const { data: vault1 } = useReadSmileyContractOwners({
    address: contractAddresses?.BitSmiley,
    args: [address]
  })
  return {
    vault1
  }
}

export default getUservault
