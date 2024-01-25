import { CloseIcon, HistoryIcon } from '@/assets/icons'
import { cn } from '@/utils/cn'
import { Modal } from '@/components/Modal'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { getUserNfts } from '@/store/account/reducer'
import { INft } from '@/services/user'
import { displayAddress, getOrdScanUrl } from '@/utils/formatter'
import { openUrl } from '@/utils/getAssetsUrl'
import { Tooltip } from 'react-tooltip'
import { getIsOpenHistory } from '@/store/common/reducer'
import { useStoreActions } from '@/hooks/useStoreActions'
import { getAddressStatus } from '@/store/addressStatus/reducer'
import { AddressStauts } from '@/types/status'

export const History: React.FC = () => {
  const userNfts = useSelector(getUserNfts)
  const addressStatus = useSelector(getAddressStatus)
  const isOpenHistory = useSelector(getIsOpenHistory)

  const { setIsOpenHistory } = useStoreActions()

  if (!userNfts.length || addressStatus === AddressStauts.MintingEnded)
    return null

  return (
    <div className="absolute left-[935px] top-[341px] cursor-pointer">
      <HistoryIcon
        className="text-blue3 hover:text-blue1 active:to-blue"
        onClick={() => setIsOpenHistory(true)}
      />
      <HistoryModal
        userNfts={userNfts}
        isOpen={isOpenHistory}
        onClose={() => setIsOpenHistory(false)}
      />
    </div>
  )
}

const HistoryModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  userNfts: INft[]
}> = ({ isOpen, onClose, userNfts }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative border border-white bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
        <CloseIcon
          onClick={onClose}
          className="absolute right-3 top-3 z-[100] cursor-pointer"
        />

        <div className="px-[42px] pb-6 pt-[42px]">
          <div className="mb-6 whitespace-nowrap text-center text-2xl">
            minting history
          </div>
          <div className="mb-6 w-[382px] whitespace-pre-wrap text-center font-psm text-sm">
            Here you can check all your inscription transactions with bitSmiley
            under current wallet address
          </div>

          <div className="max-h-[359px] border border-dashed border-white bg-black/50 pr-[5px]">
            <div
              className={cn(
                'h-full overflow-y-scroll pl-3 py-6 pr-[7px] font-psm text-sm leading-tight text-white',
                'bit-smiley-disclaimer'
              )}>
              {userNfts.map((nft, idx) => (
                <Fragment key={idx}>
                  <div className="flex items-center justify-center gap-x-12 text-sm uppercase">
                    <div className="flex flex-col items-start gap-y-3">
                      <div>[inscription id]</div>
                      <div>[your inscription]</div>
                      <div>[vIEW ON]</div>
                    </div>
                    <div className="flex flex-col items-start gap-y-3">
                      <div>{displayAddress(nft.inscription_id, 4, 4)}</div>
                      <div
                        className={cn(
                          'font-bold normal-case',
                          nft.invalid_reason ? 'text-red' : 'text-blue'
                        )}>
                        {nft.invalid_reason ? (
                          <>
                            <span>
                              Invalid
                              <span
                                id="invalid-reason"
                                className="cursor-pointer">
                                ⓘ
                              </span>
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
                                  <div className="w-[244px] border border-red bg-black p-3 text-sm font-normal leading-tight text-white">
                                    {nft.invalid_reason}
                                  </div>
                                )
                              }}
                            />
                          </>
                        ) : (
                          'Valid'
                        )}
                      </div>
                      <div
                        className="cursor-pointer normal-case text-green underline"
                        onClick={() =>
                          openUrl(getOrdScanUrl(nft.inscription_id as string))
                        }>
                        OrdScan
                      </div>
                    </div>
                  </div>
                  {idx !== userNfts.length - 1 && (
                    <div className="my-3 whitespace-nowrap text-grey5">
                      -----------------------------------------
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <div
              onClick={onClose}
              className={cn(
                'w-[120px]',
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
