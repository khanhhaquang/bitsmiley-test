import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { CopyRightAndLinks } from '@/components/CopyRightAndLinks'
import { Header } from '@/components/Header'
import { cn } from '@/utils/cn'

export const PageLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { pathname } = useLocation()

  const isRoot = pathname === '/'
  const isAirdrop = pathname.startsWith('/airdrop')

  return (
    <>
      <Header wallet isAirdrop={isAirdrop} />
      {children}
      <CopyRightAndLinks
        musicControl={isRoot}
        className={cn(
          isRoot ? 'text-white mix-blend-difference ' : 'text-black',
          isAirdrop && 'hidden'
        )}
      />
    </>
  )
}
