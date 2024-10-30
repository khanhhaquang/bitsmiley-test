import axios, { AxiosInstance, AxiosStatic } from 'axios'
import axiosRetry from 'axios-retry'

import { DOMAIN_URL, LOCAL_STORAGE_KEYS } from '@/config/settings'
import commonActions from '@/store/common/actions'
import store from '@/store/rootReducer'
import { parseCachedToken, setLocalStorage } from '@/utils/storage'

const axiosInstance = axios.create({
  baseURL: DOMAIN_URL.API,
  headers: {
    accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json'
  }
})

const privateAxiosInstance = axios.create({
  baseURL: DOMAIN_URL.API,
  headers: {
    accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json'
  }
})

const privateAxiosSetupInterceptors = (callbackOnFail: () => void) => {
  privateAxiosInstance.interceptors.request.clear()
  privateAxiosInstance.interceptors.response.clear()

  privateAxiosInstance.interceptors.request.use(
    (config) => {
      if (config.url === 'user/login') return config

      const { token } = parseCachedToken()

      if (!token) {
        const controller = new AbortController()
        config.signal = controller.signal
        controller.abort('No token found')
        return config
      }

      config.headers.Authorization = `Bearer ${token}`
      return config
    },
    (err) => Promise.reject(err)
  )

  privateAxiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err.response?.status

      // If not Unauthorized error
      if (status === 401) {
        setLocalStorage(LOCAL_STORAGE_KEYS.TOKEN, '')
        callbackOnFail()
      }

      return Promise.reject(err)
    }
  )
}

function backOff(ax: AxiosInstance | AxiosStatic) {
  axiosRetry(ax, {
    retries: 4,
    shouldResetTimeout: true,
    retryCondition: (error) => {
      if (error?.status === 429 || error?.status === 404) {
        return true
      }

      store.dispatch(commonActions.SET_NETWORK_ERROR(true))
      return false
    },
    retryDelay: (retryCount) => {
      const delay = 2 ** (retryCount - 1) * 1000 * 10
      return delay
    },
    onRetry: (retryCount, error) => {
      if (retryCount === 4 && !!error) {
        store.dispatch(commonActions.SET_NETWORK_ERROR(true))
      }
    }
  })
}

backOff(axios)
backOff(axiosInstance)
backOff(privateAxiosInstance)

export {
  axios,
  axiosInstance,
  privateAxiosInstance,
  privateAxiosSetupInterceptors
}
