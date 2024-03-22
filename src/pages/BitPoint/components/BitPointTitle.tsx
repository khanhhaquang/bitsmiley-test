import { Image } from '@/components/Image'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const BitPointTitle: React.FC<{ title: string; className?: string }> = ({
  title,
  className
}) => {
  return (
    <div
      className={cn(
        'mb-20 flex w-full items-center justify-center gap-x-1.5',
        className
      )}>
      <Image
        src={getIllustrationUrl('bitpoint/join-team-left-dashes')}
        className="w-full flex-1 shrink-0"
      />
      <span className="text-nowrap font-smb text-2xl [text-shadow:-2px_0_0_rgba(255,255,255,0.45)]">
        {title}
      </span>
      <Image
        src={getIllustrationUrl('bitpoint/join-team-right-dashes')}
        className="w-full flex-1 shrink-0"
      />
    </div>
  )
}
