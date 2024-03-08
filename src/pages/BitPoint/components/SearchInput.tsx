import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'

export const SearchInput: React.FC<{
  onChange?: (v: string) => void
  className?: string
}> = ({ onChange, className }) => {
  return (
    <Input
      placeholder="Search"
      onChange={(e) => onChange?.(e.target.value.trim())}
      className={cn(
        'w-[360px] rounded-sm border-0 bg-white/10 px-2.5 py-0.5 backdrop-blur-[2px] placeholder:text-center placeholder:text-white/20',
        className
      )}
    />
  )
}
