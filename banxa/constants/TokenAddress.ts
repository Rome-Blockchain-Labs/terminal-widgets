interface Token {
  token: string
  address: string
}
const TokenAddresses: Record<string, Token[]> = {
  ethereum: [
    {
      token: 'USDC',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },
    {
      token: 'USDT',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
  ],
}

export default TokenAddresses
