import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import accountActions from '@/store/account/actions'
import commonActions from '@/store/common/actions'
import { IAccountInfo, LoginTypeEnum } from '@/types/common'

export const useStoreActions = () => {
  const dispatch = useDispatch()

  const resetStorage = useCallback(
    () => dispatch({ type: 'LOGOUT' }),
    [dispatch]
  )

  // account
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
  const setCurrentTypewritterSeq = useCallback(
    (payload: number) =>
      dispatch(commonActions.SET_CURRENT_TYPEWRITTER_SEQ(payload)),
    [dispatch]
  )

  return {
    setCurrentTypewritterSeq,
    setAccountInfo,
    setLoginType,
    resetStorage
  }
}