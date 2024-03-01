import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './global.scss'
import Providers from './Providers.tsx'
import './ethersConnect'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
  </Providers>
)
