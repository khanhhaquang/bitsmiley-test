import { ReactNode } from 'react'
import store from '@/store/rootReducer'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ModalsContainer } from '@/components/Modal'
import CustomWagmiProvider from '@/providers/CustomWagmiProvider'
import { PageLayout } from './components/PageLayout'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false
    }
  }
})

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <CustomWagmiProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} position="bottom" />
            <ModalsContainer />
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
