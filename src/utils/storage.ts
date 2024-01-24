import { LOCAL_STORAGE_KEYS } from '@/config/settings'

const setLocalStorage = (key: string, data: string) => {
  localStorage.setItem(key, data)
}

const getLocalStorage = (key: string) => {
  return localStorage.getItem(key)
}

const deleteLocalStorage = (key: string) => {
  return localStorage.removeItem(key)
}

const clearStorage = () => {
  localStorage.clear()
}

const clearLoginType = () => {
  deleteLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE)
}
const clearConfirmedMinted = () => {
  deleteLocalStorage(LOCAL_STORAGE_KEYS.CONFIRMED_MINTED)
}

export {
  clearStorage,
  setLocalStorage,
  deleteLocalStorage,
  getLocalStorage,
  clearLoginType,
  clearConfirmedMinted
}
