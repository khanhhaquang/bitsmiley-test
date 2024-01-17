import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter } from 'react-router-dom'
import { ModalsContainer } from './components/Modal'
import { rootStore } from './store/rootReducer'
import { Provider as ReduxProvider } from 'react-redux'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false
    }
  }
})

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={rootStore}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} position="top-left" />
        <BrowserRouter>
          <ModalsContainer />
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    </ReduxProvider>
  )
}

export default Providers
