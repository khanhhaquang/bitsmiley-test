import { ReactNode } from 'react'

import { CopyRightAndLinks } from '@/components/CopyRightAndLinks'
import { Header } from '@/components/Header'

export const PageLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header wallet />
      {children}
      <CopyRightAndLinks />
    </>
  )
}
