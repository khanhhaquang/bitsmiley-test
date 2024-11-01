import { useNavigate } from 'react-router-dom'

import { ArrowLeftDoubleIcon } from '@/assets/icons'
import { InfoIndicator } from '@/components/InfoIndicator'
import { IDetailedCollateral } from '@/types/vault'

import { ManageVaultHeaderInfoTable } from '../../tables'

export const ManageVaultHeaderInformation: React.FC<{
  collateral?: IDetailedCollateral
}> = ({ collateral }) => {
  const navigate = useNavigate()

  return (
    <div className="mt-6 flex items-center justify-center gap-x-9 font-ibmr text-sm text-white/70">
      <button
        onClick={() => navigate(-1)}
        className="flex cursor-pointer items-center justify-center gap-x-1 font-ibmb text-sm hover:text-white active:text-white/50">
        <ArrowLeftDoubleIcon width={13} height={10} />
        Back
      </button>

      {ManageVaultHeaderInfoTable.map(({ key, title, message, format }) => (
        <div key={key} className="flex items-center gap-x-1">
          <span>
            {title} <InfoIndicator message={message} />:
          </span>
          <span>{format(collateral)}</span>
        </div>
      ))}
    </div>
  )
}
