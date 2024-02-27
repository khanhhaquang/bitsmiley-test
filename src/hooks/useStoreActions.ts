import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import accountActions from '@/store/account/actions'
import commonActions from '@/store/common/actions'
import { IAccountInfo, LoginTypeEnum } from '@/types/common'
import { IProject } from '@/services/project'
import { Hash } from 'viem'

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
    (payload?: LoginTypeEnum) =>
      dispatch(accountActions.SET_LOGIN_TYPE(payload)),
    [dispatch]
  )
  const setNetworkError = useCallback(
    (payload: boolean) => dispatch(commonActions.SET_NETWORK_ERROR(payload)),
    [dispatch]
  )
  const setCurrentTypewritterSeq = useCallback(
    (payload: number) =>
      dispatch(commonActions.SET_CURRENT_TYPEWRITTER_SEQ(payload)),
    [dispatch]
  )
  const addTransaction = useCallback(
    (payload: Hash) => dispatch(commonActions.ADD_TRANSACTION(payload)),
    [dispatch]
  )
  const addTransactions = useCallback(
    (payload: Hash[]) => dispatch(commonActions.ADD_TRANSACTIONS(payload)),
    [dispatch]
  )
  const removeTransaction = useCallback(
    (payload: string) => dispatch(commonActions.REMOVE_TRANSACTION(payload)),
    [dispatch]
  )

  const setProjectInfo = useCallback(
    (payload: IProject) => dispatch(commonActions.SET_PROJECT_INFO(payload)),
    [dispatch]
  )

  return {
    setLoginType,
    resetStorage,
    setAccountInfo,
    setNetworkError,
    setCurrentTypewritterSeq,
    addTransaction,
    addTransactions,
    removeTransaction,
    setProjectInfo
  }
}
