import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import accountActions from '@/store/account/actions'
import commonActions from '@/store/common/actions'
import addressStatusActions from '@/store/addressStatus/actions'
import stakingStatusActions from '@/store/stakingStatus/actions'
import { IAccountInfo, LoginTypeEnum } from '@/types/common'
import { AddressStauts, StakingStatus } from '@/types/status'
import { INft } from '@/services/user'

export const useStoreActions = () => {
  const dispatch = useDispatch()

  const resetStorage = useCallback(
    () => dispatch({ type: 'LOGOUT' }),
    [dispatch]
  )

  const setAccountInfo = useCallback(
    (payload: IAccountInfo) =>
      dispatch(accountActions.SET_ACCOUNT_INFO(payload)),
    [dispatch]
  )
  const setLoginType = useCallback(
    (payload: LoginTypeEnum) =>
      dispatch(accountActions.SET_LOGIN_TYPE(payload)),
    [dispatch]
  )
  const setTxId = useCallback(
    (payload: string | undefined) =>
      dispatch(accountActions.SET_TX_ID(payload)),
    [dispatch]
  )
  const setInscriptionId = useCallback(
    (payload: string | undefined) =>
      dispatch(accountActions.SET_INSCRIPTION_ID(payload)),
    [dispatch]
  )
  const setIsCreatingOrder = useCallback(
    (payload: boolean) =>
      dispatch(accountActions.SET_IS_CREATING_ORDER(payload)),
    [dispatch]
  )
  const setCurrentTypewritterSeq = useCallback(
    (payload: number) =>
      dispatch(commonActions.SET_CURRENT_TYPEWRITTER_SEQ(payload)),
    [dispatch]
  )
  const setUserNfts = useCallback(
    (payload: INft[]) => dispatch(accountActions.SET_USER_NFTS(payload)),
    [dispatch]
  )
  const setAddressStatus = useCallback(
    (payload: AddressStauts) =>
      dispatch(addressStatusActions.SET_ADDRESS_STATUS(payload)),
    [dispatch]
  )
  const setStakingStatus = useCallback(
    (payload: StakingStatus) =>
      dispatch(stakingStatusActions.SET_STAKING_STATUS(payload)),
    [dispatch]
  )
  const setIsOpenHistory = useCallback(
    (payload: boolean) => dispatch(commonActions.SET_IS_OPEN_HISTORY(payload)),
    [dispatch]
  )
  const setNetworkError = useCallback(
    (payload: boolean) => dispatch(commonActions.SET_NETWORK_ERROR(payload)),
    [dispatch]
  )

  return {
    setTxId,
    setUserNfts,
    setIsOpenHistory,
    setLoginType,
    resetStorage,
    setAccountInfo,
    setInscriptionId,
    setAddressStatus,
    setStakingStatus,
    setIsCreatingOrder,
    setNetworkError,
    setCurrentTypewritterSeq
  }
}
