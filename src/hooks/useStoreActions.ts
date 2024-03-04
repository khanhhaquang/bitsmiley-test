import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import commonActions from '@/store/common/actions'
import { IFeaturesEnabled, IProject } from '@/services/project'
import { Hash } from 'viem'

export const useStoreActions = () => {
  const dispatch = useDispatch()

  const resetStorage = useCallback(
    () => dispatch({ type: 'LOGOUT' }),
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
  const setFeaturesEnabled = useCallback(
    (payload: IFeaturesEnabled) =>
      dispatch(commonActions.SET_FEATURESENABLED_INFO(payload)),
    [dispatch]
  )

  return {
    resetStorage,
    setNetworkError,
    setCurrentTypewritterSeq,
    addTransaction,
    addTransactions,
    removeTransaction,
    setProjectInfo,
    setFeaturesEnabled
  }
}
