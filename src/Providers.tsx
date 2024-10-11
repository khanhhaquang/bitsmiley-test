import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { hashFn } from 'wagmi/query'

import { ModalsContainer } from '@/components/Modal'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import CustomWagmiProvider from '@/providers/CustomWagmiProvider'
import store from '@/store/rootReducer'

import { PageLayout } from './components/PageLayout'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      queryKeyHashFn: hashFn
    }
  }
})

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <ModalsContainer />
        <CustomWagmiProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} position="bottom" />
            <Toaster />
            <TooltipProvider>
              <PageLayout>{children}</PageLayout>
            </TooltipProvider>
          </QueryClientProvider>
        </CustomWagmiProvider>
      </BrowserRouter>
    </ReduxProvider>
  )
}

export default Providers
