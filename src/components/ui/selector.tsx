import { useEffect, useRef, useState } from 'react'

import { DropArrowDownIcon, DropArrowUpIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/utils/cn'

export type SelectorItem = {
  id: number
  name: string
  icon?: string
}
type SelectorProps = {
  selectedId?: number
  items: SelectorItem[]
  onChange: (item: SelectorItem) => void
  className?: string
}

const Selector: React.FC<SelectorProps> = ({
  selectedId,
  items,
  onChange,
  className
}) => {
  const dropDownRef = useRef<HTMLDivElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [currentItem, setCurrentItem] = useState(
    items.length > 0 ? items[0] : null
  )

  useEffect(() => {
    if (selectedId && currentItem?.id != selectedId) {
      const item = items.find((v) => v.id === selectedId)
      if (item) setCurrentItem(item)
    }
  }, [currentItem?.id, items, selectedId])

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
        className="group flex h-[33px] items-center justify-between gap-1 border border-white/60 bg-white/10 px-3 font-ibmr">
        <div className="flex items-center gap-2">
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
            className="flex h-[33px] w-full cursor-pointer items-center gap-2 border border-white/60 border-t-transparent bg-white/10 px-3 text-white/75 hover:bg-white/50 hover:text-black">
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

export default Selector
