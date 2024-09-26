import { isAxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Hash, isHash } from 'viem'
import { useAccount } from 'wagmi'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { useMempool } from '@/hooks/useMempool'
import { useZetaClient } from '@/hooks/useZetaClient'
import { useZetaService } from '@/hooks/useZetaService'
import { useGetCctx } from '@/queries/zeta'
import {
  deleteLocalStorage,
  getLocalStorage,
  setLocalStorage
} from '@/utils/storage'

import { ProcessingStatus, TxnStep } from '../components/ZetaProcessing.types'

export const useZetaProcessing = (chainId: number, collateralId: string) => {
  const { address: evmAddress } = useAccount()
  const MempoolService = useMempool()
  const ZetaService = useZetaService()
  const [showProcessing, setShowProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(TxnStep.One)
  const [processingStatus, setProcessingStatus] = useState(
    ProcessingStatus.Processing
  )
  const [processingTxn, setProcessingTxn] = useState('')

  const { broadcastTxn } = useZetaClient(chainId, collateralId)

  const clearTxnCache = useCallback(() => {
    deleteLocalStorage(
      `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_TXN}-${evmAddress}`
    )
    deleteLocalStorage(
      `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_STEP}-${evmAddress}`
    )
    deleteLocalStorage(
      `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_RAW_BTC_TXN}-${evmAddress}`
    )
  }, [evmAddress])

  const cacheTxn = useCallback(
    (txn: string) => {
      setLocalStorage(
        `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_TXN}-${evmAddress}`,
        txn
      )
    },
    [evmAddress]
  )

  const cacheRawTxn = useCallback(
    (txn: string) => {
      setLocalStorage(
        `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_RAW_BTC_TXN}-${evmAddress}`,
        txn
      )
    },
    [evmAddress]
  )

  const cacheStep = useCallback(
    (step: TxnStep) => {
      setLocalStorage(
        `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_STEP}-${evmAddress}`,
        step
      )
    },
    [evmAddress]
  )

  const initProcess = useCallback(() => {
    setProcessingTxn('')
    clearTxnCache()
    setShowProcessing(true)
    setProcessingStep(TxnStep.One)
    setProcessingStatus(ProcessingStatus.Processing)
  }, [clearTxnCache])

  const handleBroadcasting = useCallback(
    async (rawTxn: string | null) => {
      console.log('🚀 ~ handleBroadcasting ~ rawTxn:', rawTxn)
      if (rawTxn) {
        console.log('broadcasting...')
        const btcTxn = await broadcastTxn(rawTxn)
        if (btcTxn) {
          setProcessingTxn(btcTxn)
          cacheTxn(btcTxn)
        } else {
          setProcessingStatus(ProcessingStatus.Error)
        }
      } else {
        setProcessingStatus(ProcessingStatus.Error)
      }
    },
    [broadcastTxn, cacheTxn]
  )

  const { data: zetaCctx, refetch: getZetaCctxDetail } = useGetCctx(
    processingTxn as Hash,
    collateralId,
    evmAddress,
    {
      retry: 3,
      refetchInterval: ({ state }) => {
        const statusOfTxn = state.data?.CrossChainTx?.cctx_status?.status
        if (
          statusOfTxn === undefined ||
          ['Aborted', 'Reverted', 'OutboundMined', 'PendingRevert'].includes(
            statusOfTxn
          )
        ) {
          return 3000
        }
        return false
      },
      enabled:
        isHash(processingTxn) &&
        processingStep === TxnStep.Two &&
        processingStatus === ProcessingStatus.Processing
    }
  )

  useEffect(() => {
    if (evmAddress) {
      const cachedTxn =
        getLocalStorage(
          `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_TXN}-${evmAddress}`
        ) ?? ''

      const cachedStep =
        getLocalStorage(
          `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_STEP}-${evmAddress}`
        ) === '2'
          ? TxnStep.Two
          : TxnStep.One
      setProcessingTxn(cachedTxn)
      setProcessingStep(cachedStep)

      if (cachedTxn) {
        setShowProcessing(true)
      }
    }
  }, [evmAddress])

  useEffect(() => {
    if (
      processingTxn &&
      processingStep === TxnStep.One &&
      processingStatus === ProcessingStatus.Processing
    ) {
      setShowProcessing(true)
      const intervalId = setInterval(() => {
        MempoolService.getTransaction
          .call(processingTxn)
          .then((response) => {
            if (response?.status?.confirmed) {
              setProcessingStep(TxnStep.Two)
              cacheStep(TxnStep.Two)
              setShowProcessing(true)
            } else {
              console.log('waiting txn confirm')
            }
          })
          .catch((e) => {
            if (isAxiosError(e) && e.response?.status === 404) {
              clearInterval(intervalId)
              setProcessingTxn('')
              deleteLocalStorage(
                `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_TXN}-${evmAddress}`
              )
              handleBroadcasting(
                getLocalStorage(
                  `${LOCAL_STORAGE_KEYS.ZETA_PROCESSING_RAW_BTC_TXN}-${evmAddress}`
                )
              )
            }
            console.log('get onchain btc txn error: ', e)
          })
      }, 3000)

      return () => {
        clearInterval(intervalId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    processingTxn,
    processingStatus,
    processingStep,
    MempoolService.getTransaction,
    evmAddress
  ])

  useEffect(() => {
    if (
      !isHash(processingTxn) &&
      processingStep === TxnStep.Two &&
      processingStatus === ProcessingStatus.Processing
    ) {
      setShowProcessing(true)
      const intervalId = setInterval(() => {
        ZetaService.inboundHashToCctx
          .call(processingTxn)
          .then((res) => {
            const cctxArr = res?.inboundHashToCctx?.cctx_index
            if (cctxArr && cctxArr.length > 0) {
              console.log('zetaTxn:', cctxArr[0])
              cacheTxn(cctxArr[0])
              setProcessingTxn(cctxArr[0])
            } else {
              console.log('waiting txn inbound_hash')
            }
          })
          .catch(() => {
            console.log('waiting txn')
          })
      }, 3000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [
    processingTxn,
    processingStatus,
    processingStep,
    evmAddress,
    ZetaService.inboundHashToCctx,
    cacheTxn
  ])

  useEffect(() => {
    if (processingStep === TxnStep.Two && isHash(processingTxn)) {
      const status = zetaCctx?.CrossChainTx?.cctx_status?.status
      let noResultTimer = null
      if (status) {
        if (noResultTimer) clearTimeout(noResultTimer)
        setShowProcessing(true)
        if (status === 'OutboundMined') {
          setProcessingStatus(ProcessingStatus.Success)
          clearTxnCache()
        } else if (
          status === 'Aborted' ||
          status === 'Reverted' ||
          status === 'PendingRevert'
        ) {
          setProcessingStatus(ProcessingStatus.Error)
          clearTxnCache()
        }
      } else {
        noResultTimer = setTimeout(() => {
          setShowProcessing(true)
          clearTxnCache()
          setProcessingStatus(ProcessingStatus.NoResult)
        }, 16000)
      }
    }
  }, [
    processingStep,
    processingTxn,
    clearTxnCache,
    getZetaCctxDetail,
    zetaCctx?.CrossChainTx?.cctx_status?.status
  ])

  return {
    showProcessing,
    processingStep,
    processingStatus,
    processingTxn,
    setShowProcessing,
    setProcessingStatus,
    setProcessingStep,
    setProcessingTxn,
    clearTxnCache,
    cacheTxn,
    cacheRawTxn,
    handleBroadcasting,
    initProcess
  }
}
