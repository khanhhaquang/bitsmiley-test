import { useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { WalletItem } from '.'

type EvmConnectorProps = {
  onClose: () => void
}

const EvmConnector: React.FC<EvmConnectorProps> = ({ onClose }) => {
  const { connect } = useConnect()

  return (
    <WalletItem
      iconName="metamask"
      name="Metamask wallet"
      connect={() => {
        connect({ connector: injected() }, { onError: (v) => console.log(v) })
        onClose()
      }}
    />
  )
}

export default EvmConnector
