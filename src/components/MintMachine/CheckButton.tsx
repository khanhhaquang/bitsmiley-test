import { useMemo, useState } from 'react'
import { cn } from '@/utils/cn'
import { Image } from '@/components/Image'
import { getFrameUrl, getIllustrationUrl } from '@/utils/getAssetsUrl'
import { CanvasFrames } from '../CanvasFrames'
import { Modal } from '../Modal'
import { CloseIcon } from '@/assets/icons'
import { Tooltip } from 'react-tooltip'
import { useCheckInsctiption } from '@/hooks/useCheckInscription'
import { InscriptionType } from '@/services/project'

export const CheckButton: React.FC<{ inscriptionId: string }> = ({
  inscriptionId
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)

  const { check } = useCheckInsctiption(inscriptionId.trim())

  const checkButtonImgName = useMemo(() => {
    if (!inscriptionId) return 'checkbutton-disabled'
    if (isPressed) return 'checkbutton-down'
    return 'checkbutton-up'
  }, [inscriptionId, isPressed])

  return (
    <>
      <ResultModal
        inscriptionId={inscriptionId}
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
      />

      {!!inscriptionId && (
        <div className="absolute left-[782px] top-[560px]">
          <CanvasFrames
            fps={10}
            width={45}
            height={70}
            imgLocalPaths={Array(13)
              .fill(1)
              .map((_, idx) =>
                getFrameUrl('arrow-indicator', `arrow-indicator${idx + 1}`)
              )}
          />
        </div>
      )}
      <div
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={async () => {
          setIsPressed(false)

          if (!inscriptionId) return

          const result = await check()

          if (result) {
            setIsResultModalOpen(true)
          }
        }}
        onMouseLeave={() => setIsPressed(false)}
        className={cn(
          'absolute left-[740px] top-[626px] z-50 h-[76px]',
          'flex flex-col justify-end',
          !!inscriptionId && 'cursor-pointer'
        )}>
        <Image src={getIllustrationUrl(checkButtonImgName)} />
      </div>
    </>
  )
}

const ResultModal: React.FC<{
  inscriptionId: string
  onClose: () => void
  isOpen: boolean
}> = ({ isOpen, onClose, inscriptionId }) => {
  const { result } = useCheckInsctiption(inscriptionId)
  const isError = result?.code !== 0
  const isValid = result?.message?.valid_type === InscriptionType.VALID
  const isInvalidValid =
    result?.message?.valid_type === InscriptionType.VALID_INVALID
  const isInvalid = result?.message?.valid_type === InscriptionType.INVALID

  const invalidReason = result?.message?.reason

  const renderValid = () => {
    return (
      <div className="text-center">
        This bitDisc-Black is <span className="text-green">Valid</span>
      </div>
    )
  }

  const renderError = () => {
    return (
      <div className="flex w-[341px] flex-col gap-y-1">
        <div>The on-chain ID can not be recognised.</div>
        <div>
          Want to know how to find the on-chain ID?{' '}
          <span className="text-green">
            [<span className="cursor-pointer hover:underline">Check here</span>]
          </span>
        </div>
      </div>
    )
  }

  const renderInvalidValid = () => {
    return (
      <div className="flex w-[310px] flex-col gap-y-1">
        <div>
          This bitDisc-Black is{' '}
          <>
            <span id="invalid-reason" className="cursor-pointer text-red">
              Invalidⓘ
            </span>
            <Tooltip
              noArrow
              place="right-start"
              opacity={1}
              style={{
                padding: 0,
                backgroundColor: 'black'
              }}
              anchorSelect="#invalid-reason"
              render={() => {
                return (
                  <div className="w-[244px] border border-white bg-black p-3 text-sm font-normal leading-tight text-white">
                    {invalidReason}
                  </div>
                )
              }}
            />
          </>
        </div>
        <div>
          It entitles an airdrop in future! For further knowledge{' '}
          <span className="text-green">
            [<span className="cursor-pointer hover:underline">Check here</span>]
          </span>
        </div>
      </div>
    )
  }
  const renderInvalid = () => {
    return (
      <div className="flex w-[310px] flex-col gap-y-1">
        <div>
          This bitDisc-Black is{' '}
          <>
            <span id="invalid-reason" className="cursor-pointer text-red">
              Invalidⓘ
            </span>
            <Tooltip
              noArrow
              place="right-start"
              opacity={1}
              style={{
                padding: 0,
                backgroundColor: 'black'
              }}
              anchorSelect="#invalid-reason"
              render={() => {
                return (
                  <div className="w-[244px] border border-white bg-black p-3 text-sm font-normal leading-tight text-white">
                    {invalidReason}
                  </div>
                )
              }}
            />
          </>
        </div>
        <div className="break-all">
          It is acquired through unrecognised means and entitles{' '}
          <span className="text-red">no airdrop.</span>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (isError) return renderError()
    if (isValid) return renderValid()
    if (isInvalidValid) return renderInvalidValid()
    if (isInvalid) return renderInvalid()
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative border-2 border-black bg-black bg-connect-modal bg-cover bg-no-repeat">
        <CloseIcon
          onClick={onClose}
          className="absolute right-4 top-4 z-[100] cursor-pointer"
        />

        <div className="p-6 pt-[42px]">
          <div
            className={cn(
              'mb-9 whitespace-nowrap text-center font-smb text-2xl',
              isError && 'text-red'
            )}>
            {isError ? 'ERROR' : 'Result'}
          </div>

          {!isError && (
            <div className="w-[310px] border border-dashed border-white bg-black/50 p-3 text-sm">
              <div className="mb-2.5 text-center">
                bitDisk-Black on-chain ID
              </div>
              <div className="break-all text-white/50">{inscriptionId}</div>
            </div>
          )}

          <div className="mt-3 text-sm">{renderContent()}</div>

          <div className="mt-9 text-center">
            <div
              onClick={onClose}
              className={cn(
                'w-[80px]',
                'inline-block bg-white cursor-pointer text-black px-3 py-1 font-bold whitespace-nowrap text-sm font-psm',
                'hover:bg-blue3',
                'shadow-take-bitdisc-button hover:shadow-take-bitdisc-button-hover active:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:bg-blue'
              )}>
              OK
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
