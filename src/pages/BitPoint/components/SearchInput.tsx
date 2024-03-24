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
        'w-full font-ibmr placeholder:text-sm text-sm bg-white/5 pl-2 pr-1 py-0.5 border-white/10 placeholder:text-center placeholder:text-white/20 hover:bg-white/10 active:bg-white/10 focus:bg-white/10',
        className
      )}
    />
  )
}
