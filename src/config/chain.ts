export const ChainCfg = {
  1: {
      chainId: '0x1',
      chainName: 'Ethereum Mainnet',
      nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
      },
      rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
      blockExplorerUrls: ['https://etherscan.io'],
  },
  3: {
      chainId: '0x3',
      chainName: 'Ropsten testNet',
      nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
      },
      rpcUrls: ['https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
      blockExplorerUrls: ['https://ropsten.etherscan.io'],
  },
  42: {
      chainId: '0x2a',
      chainName: 'Kovan testNet',
      nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
      },
      rpcUrls: ['https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
      blockExplorerUrls: ['https://kovan.etherscan.io'],
  },
  56: {
      chainId: '0x38',
      chainName: 'Binance Smart Chain',
      nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com/'],
  },
  97: {
      chainId: '0x61',
      chainName: 'Binance Smart Chain - TestNet',
      nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
      },
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
      blockExplorerUrls: ['https://testnet.bscscan.com/'],
  },
  686868: {
    chainId: '0xa7b14',
    chainName: 'Merlin Testnet',
    nativeCurrency: {
        name: 'BTC',
        symbol: 'BTC',
        decimals: 18,
    },
    rpcUrls: ['https://testnet-rpc.merlinchain.io'],
    blockExplorerUrls: ['https://testnet-scan.merlinchain.io'],
  },
  4200: {
    chainId: '0x1068',
    chainName: 'Merlin Mainnet',
    nativeCurrency: {
        name: 'BTC',
        symbol: 'BTC',
        decimals: 18,
    },
    rpcUrls: ['https://rpc.merlinchain.io'],
    blockExplorerUrls: ['https://scan.merlinchain.io'],
  },
};