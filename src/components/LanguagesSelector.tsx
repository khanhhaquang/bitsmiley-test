/* eslint-disable security/detect-object-injection */
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { DropArrowDownIcon, DropArrowUpIcon } from '@/assets/icons'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/utils/cn'
import { availableLanguage, SupportLanguage } from '@/utils/i18n'

const LanguagesSelector = () => {
  const { pathname } = useLocation()

  const dropDownRef = useRef<HTMLDivElement>(null)
  const { i18n } = useTranslation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currentLanguage = i18n.language as SupportLanguage

  useClickOutside(dropDownRef, () => {
    setIsDropdownOpen(false)
  })

  const toggleDropdown = (e: React.UIEvent) => {
    e.stopPropagation()
    setIsDropdownOpen(true)
  }

  const onChangeLanguage = (langCode: string) => {
    setIsDropdownOpen(false)
    i18n.changeLanguage(langCode)
  }

  const isAirdropArcade = pathname === '/airdrop/arcade'

  if (!isAirdropArcade) return null

  return (
    <div
      tabIndex={0}
      className={cn(
        'relative cursor-pointer  text-center text-white/75 font-bold whitespace-nowrap text-sm'
      )}>
      <div
        onClick={toggleDropdown}
        onKeyUp={(e) => {
          if (e.code === 'Enter') {
            toggleDropdown(e)
          }
        }}
        className="group flex h-[34px] w-[104px] items-center justify-between gap-[10px] border border-white/35 px-3 py-2 uppercase ">
        <span className="group-hover:border-white/60 group-hover:text-white">
          {availableLanguage[currentLanguage]}
        </span>
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
          'absolute left-0 overflow-hidden top-full z-10 w-full font-bold h-0 text-[15px]',
          isDropdownOpen && 'h-auto'
        )}>
        {Object.entries(availableLanguage)
          .filter(([langCode]) => langCode !== currentLanguage)
          .map(([langCode, langName]) => (
            <button
              key={langCode}
              onClick={() => {
                onChangeLanguage(langCode)
              }}
              className="flex w-full cursor-pointer items-center justify-center border border-white/35 border-t-transparent px-5 py-2 text-white/75 hover:border-white/60 hover:text-white">
              {langName}
            </button>
          ))}
      </div>
    </div>
  )
}

export default LanguagesSelector
