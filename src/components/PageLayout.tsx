import { ReactNode } from 'react'
import { Header } from '@/components/Header'
import { CopyRightAndLinks } from '@/components/CopyRightAndLinks'

export const PageLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header wallet />
      {children}
      <CopyRightAndLinks />
    </>
  )
}
