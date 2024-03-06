import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

const MainBitPoint: React.FC = () => {
  return (
    <Suspense fallback="...">
      <Outlet />
    </Suspense>
  )
}

export default MainBitPoint
