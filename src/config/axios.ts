import axios, { AxiosInstance, AxiosStatic } from 'axios'
import axiosRetry from 'axios-retry'

import { DOMAIN_URL } from '@/config/settings'
import commonActions from '@/store/common/actions'
import store from '@/store/rootReducer'

const axiosInstance = axios.create({
  baseURL: DOMAIN_URL.API,
  headers: {
    accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json'
  }
})

backOff(axios)
backOff(axiosInstance)

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

export { axios, axiosInstance }
