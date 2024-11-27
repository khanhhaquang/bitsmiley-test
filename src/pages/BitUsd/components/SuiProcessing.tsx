import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { ExecutorResult } from '@/hooks/useSuiUtils'
import { useUserInfo } from '@/hooks/useUserInfo'

import { ProcessingModal } from './Processing'
import { ProcessingType } from './Processing.types'

interface SuiProcessingProps
  extends Omit<ExecutorResult, 'validateTransaction'> {
  refreshVaultValues: () => void
  refetchCollateral: () => void
}

const SuiProcessing: FC<SuiProcessingProps> = ({
  isPending,
  isError,
  isSuccess,
  error,
  executeData,
  refreshVaultValues,
  reset,
  refetchCollateral
}) => {
  const navigate = useNavigate()

  const { blockExplorerUrl } = useUserInfo() // TO DO
  const openVaultTxId = executeData?.digest
  if (isPending) {
    return (
      <ProcessingModal
        message="Your transaction is getting processed on-chain."
        link={
          !!blockExplorerUrl && !!openVaultTxId
            ? `${blockExplorerUrl}/tx/${openVaultTxId}`
            : ''
        }
      />
    )
  }
  if (isSuccess) {
    return (
      <ProcessingModal
        type={ProcessingType.Success}
        actionButtonText="Ok"
        onClickActionButton={() => {
          refetchCollateral()
          refreshVaultValues()
          navigate(-1)
        }}
        message="You have successfully created a vault. Now you can see it in the
    AlphaNet main page"
      />
    )
  }
  if (isError) {
    return (
      <ProcessingModal
        type={ProcessingType.Error}
        actionButtonText="Ok"
        onClickActionButton={() => {
          reset()
          // setOpenVaultTxnStatus(TransactionStatus.Idle)
          // setTxnErrorMsg('')
        }}
        message={
          !blockExplorerUrl || !openVaultTxId ? (
            <span>{error?.message}</span>
          ) : (
            <span>
              The transaction has failed. You can check it on-chain{' '}
              <a
                className="cursor-pointer text-green hover:underline"
                href={`${blockExplorerUrl}/tx/${openVaultTxId}`}>
                here
              </a>
            </span>
          )
        }
      />
    )
  }
  return null
}

export default SuiProcessing
