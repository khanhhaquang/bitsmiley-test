import { cn } from '@/utils/cn'

export const RolledDiceButNotOpened: React.FC = () => {
  return (
    <>
      <div className="absolute left-[423px] top-[441px] font-smb text-sm">
        The machine has rolled the dice for you
      </div>

      <div className="absolute left-[646px] top-[532px]">
        <div
          className={cn(
            'relative bg-white cursor-pointer text-black px-3 py-1 font-bold whitespace-nowrap text-[15px] hover:bg-blue3',
            'shadow-connectwallet-button hover:shadow-connectwallet-button-hover active:shadow-none active:translate-x-1.5 active:translate-y-1.5 active:bg-blue'
          )}>
          PURCHASE
        </div>
      </div>
    </>
  )
}
