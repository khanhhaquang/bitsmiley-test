import { useRef, useState } from 'react'

import { DropArrowDownIcon, DropArrowUpIcon } from '@/assets/icons'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/utils/cn'
import { Image } from '@/components/Image'

export type DropdownItem = {
  id: number
  name: string
  icon?: string
}
type DropdownProps = {
  items: DropdownItem[]
  onChange: (item: DropdownItem) => void
  className?: string
}

const DropDown: React.FC<DropdownProps> = ({ items, onChange, className }) => {
  const dropDownRef = useRef<HTMLDivElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(
    items.length > 0 ? items[0] : null
  )

  useClickOutside(dropDownRef, () => {
    setIsDropdownOpen(false)
  })

  const toggleDropdown = (e: React.UIEvent) => {
    e.stopPropagation()
    setIsDropdownOpen(true)
  }

  return (
    <div
      tabIndex={0}
      className={cn(
        'relative cursor-pointer w-[116px] text-center text-white/75 font-bold whitespace-nowrap text-sm',
        className
      )}>
      <div
        onClick={toggleDropdown}
        onKeyUp={(e) => {
          if (e.code === 'Enter') {
            toggleDropdown(e)
          }
        }}
        className="group flex h-[33px] items-center justify-between gap-1 border border-white/60 px-3 bg-white/10 font-ibmr">
        <div className="flex gap-2 items-center">
          {currentItem?.icon && (
            <Image src={currentItem?.icon} className="aspect-square size-4" />
          )}
          <span className="group-hover:border-white/60 group-hover:text-white">
            {currentItem?.name ?? ''}
          </span>
        </div>

        <DropArrowDownIcon
          className={cn(
            'opacity-75 group-hover:opacity-100 size-2',
            isDropdownOpen && 'hidden'
          )}
        />
        <DropArrowUpIcon
          className={cn(
            'opacity-75 group-hover:opacity-100 group-hover:fill-white hidden size-2',
            isDropdownOpen && 'block'
          )}
        />
      </div>
      <div
        ref={dropDownRef}
        className={cn(
          'absolute left-0 overflow-hidden top-full z-10 w-full h-0 text-[14px] font-ibmr',
          isDropdownOpen && 'h-auto'
        )}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentItem(item)
              setIsDropdownOpen(false)
              onChange(item)
            }}
            className="flex w-full h-[33px] cursor-pointer items-center gap-2 border border-white/60 border-t-transparent px-3 text-white/75 hover:bg-white/50 hover:text-black bg-white/10">
            {item.icon && (
              <Image src={item.icon} className="aspect-square size-4" />
            )}
            {item.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DropDown
