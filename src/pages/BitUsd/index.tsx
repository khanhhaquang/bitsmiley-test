import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

const MainBitUsd: React.FC = () => {
  return (
    <Suspense fallback="...">
      <Outlet />
    </Suspense>
  )
}

export default MainBitUsd
