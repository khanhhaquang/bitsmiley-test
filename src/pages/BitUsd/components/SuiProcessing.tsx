import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { ExecutorResult } from '@/hooks/useSuiExecute'
import { useUserInfo } from '@/hooks/useUserInfo'

import { ProcessingModal } from './Processing'
import { ProcessingType } from './Processing.types'

interface SuiProcessingProps extends ExecutorResult {
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
  const { suiBlockExplorerUrl } = useUserInfo() // TO DO
  const openVaultTxId = executeData?.digest

  if (isPending) {
    return (
      <ProcessingModal
        message="Your transaction is getting processed on-chain."
        link={
          !!suiBlockExplorerUrl && !!openVaultTxId
            ? `${suiBlockExplorerUrl}/tx/${openVaultTxId}`
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
          navigate('/app/alphanet')
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
          !suiBlockExplorerUrl || !openVaultTxId ? (
            <span>{error?.message}</span>
          ) : (
            <span>
              The transaction has failed. You can check it on-chain{' '}
              <a
                className="cursor-pointer text-green hover:underline"
                href={`${suiBlockExplorerUrl}/tx/${openVaultTxId}`}>
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
