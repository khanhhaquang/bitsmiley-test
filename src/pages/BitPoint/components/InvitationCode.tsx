import { CopyButton } from '@/components/CopyButton'
import { useTeamInfo } from '@/hooks/useTeamInfo'

export const CaptionInvitationCode: React.FC = () => {
  const { myTeamInfo } = useTeamInfo()

  const invitationCode = myTeamInfo?.invitationCode

  if (!invitationCode) return null

  return (
    <div className="mb-[18px] flex items-center gap-x-2 text-xs text-white/70">
      <span className="text-nowrap">
        Your invitation code:{' '}
        <span className="text-white">{invitationCode}</span>{' '}
      </span>
      <CopyButton text={invitationCode} />
    </div>
  )
}
