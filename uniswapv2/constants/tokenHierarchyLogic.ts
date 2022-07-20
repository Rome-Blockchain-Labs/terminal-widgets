import { NETWORKS } from './veloxMultichain'

//TODO: Add testnet token addresses
type Hierarchy = {
  baseTokenPriority: Array<string>
  feeTokenPriority: Array<string>
}
const hierarchyPerNetwork: { [exchange: string]: Hierarchy } = {}

const ethereumTokens = {
  native: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'.toLowerCase(),
  highPriorityTokens: [
    '0x514910771af9ca656af840dff83e8264ecf986ca'.toLowerCase(), //LINK
    '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2'.toLowerCase(), //SUSHI
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'.toLowerCase(), //UNI
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'.toLowerCase(), //WBTC
  ],
  stables: [
    '0x6B175474E89094C44Da98b954EedeAC495271d0F'.toLowerCase(), //DAI
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'.toLowerCase(), //USDC
    '0xdac17f958d2ee523a2206206994597c13d831ec7'.toLowerCase(), //USDT
    '0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3'.toLowerCase(), //MIM
    '0xa47c8bf37f92abed4a126bda807a7b7498661acd'.toLowerCase(), //UST,
    '0x0000000000085d4780b73119b644ae5ecd22b376'.toLowerCase(), //TUSD,
    '0x4fabb145d64652a948d72533023f6e7a623c7c53'.toLowerCase(), //BUSD
  ],
}

const avalancheTokens = {
  native: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'.toLowerCase(),
  highPriorityTokens: [
    '0x60781C2586D68229fde47564546784ab3fACA982'.toLowerCase(), //PNG
    '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB'.toLowerCase(), //ETH.e
    '0xdb456F6112F68b1F22aeD4fB5a1d58A91D292F40'.toLowerCase(), //ETH
    '0x50b7545627a5162F82A992c33b87aDc75187B218'.toLowerCase(), //WBTC.e
    '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB'.toLowerCase(), //WBTC
    '0x5947BB275c521040051D82396192181b413227A3'.toLowerCase(), //LINK.e
    '0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5'.toLowerCase(), //QI
    '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd'.toLowerCase(), //JOE
  ],
  stables: [
    '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E'.toLowerCase(), //USDC
    '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70'.toLowerCase(), //DAI.e
    '0xc7198437980c041c805A1EDcbA50c1Ce5db95118'.toLowerCase(), //USDT.e
    '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664'.toLowerCase(), //USDC.e
    '0x19860CCB0A68fd4213aB9D8266F7bBf05A8dDe98'.toLowerCase(), //BUSD.e
    '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a'.toLowerCase(), //DAI
    '0xde3A24028580884448a5397872046a019649b084'.toLowerCase(), //USDT
    '0x130966628846BFd36ff31a822705796e8cb8C18D'.toLowerCase(), //MIM
  ],
}

const bscTokens = {
  native: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'.toLowerCase(),
  highPriorityTokens: [
    '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'.toLowerCase(), //ETH
    '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47'.toLowerCase(), //ADA
    '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'.toLowerCase(), //CAKE
    '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD'.toLowerCase(), //LINK
  ],
  stables: [
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'.toLowerCase(), //BUSD
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'.toLowerCase(), //USDC
    '0x55d398326f99059fF775485246999027B3197955'.toLowerCase(), //USDT
    '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3'.toLowerCase(), //DAI
  ],
}

const moonbeamTokens = {
  native: '0xAcc15dC74880C9944775448304B263D191c6077F'.toLowerCase(),
  highPriorityTokens: [
    '0xfA9343C3897324496A05fC75abeD6bAC29f8A40f'.toLowerCase(), //ETH
    '0xc9BAA8cfdDe8E328787E29b4B078abf2DaDc2055'.toLowerCase(), //BNB
    '0xcd3B51D98478D53F4515A306bE565c6EebeF1D58'.toLowerCase(), //GLINT
  ],
  stables: [
    '0x765277EebeCA2e31912C9946eAe1021199B39C61'.toLowerCase(), //DAI
    '0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73'.toLowerCase(), //USDT
    '0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F'.toLowerCase(), //BUSD
    '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b'.toLowerCase(), //USDC
  ],
}

const moonriverTokens = {
  native: '0x98878b06940ae243284ca214f92bb71a2b032b8a'.toLowerCase(),
  highPriorityTokens: [
    '0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8'.toLowerCase(), //BTC
    '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C'.toLowerCase(), //ETH
    '0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B'.toLowerCase(), //SOLAR
  ],
  stables: [
    '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844'.toLowerCase(), //DAI
    '0x1A93B23281CC1CDE4C4741353F3064709A16197d'.toLowerCase(), //FRAX
    '0xB44a9B6905aF7c801311e8F4E76932ee959c663C'.toLowerCase(), //USDT
    '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D'.toLowerCase(), //USDC
  ],
}

const metisTokens = {
  native: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000'.toLowerCase(),
  highPriorityTokens: [
    '0x90fE084F877C65e1b577c7b2eA64B8D8dd1AB278'.toLowerCase(), //NETT
    '0xa5B55ab1dAF0F8e1EFc0eB1931a957fd89B918f4'.toLowerCase(), //WBTC
    '0x420000000000000000000000000000000000000A'.toLowerCase(), //WETH
  ],
  stables: [
    // [dai, busd, usdt, usdc]

    '0x4651B38e7ec14BB3db731369BFE5B08F2466Bd0A'.toLowerCase(), //DAI
    '0x12D84f1CFe870cA9C9dF9785f8954341d7fbb249'.toLowerCase(), //BUSD
    '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC'.toLowerCase(), //m.USDT
    '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21'.toLowerCase(), //m.USDC
  ],
}

const polygonTokens = {
  native: '0x0000000000000000000000000000000000001010'.toLowerCase(),
  highPriorityTokens: [
    '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'.toLowerCase(), //WETH
    '0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3'.toLowerCase(), //BNB
    '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6'.toLowerCase(), //WBTC
    '0xb33EaAd8d922B1083446DC23f610c2567fB5180f'.toLowerCase(), //UNI
  ],
  stables: [
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'.toLowerCase(), //DAI
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'.toLowerCase(), //USDC
    '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'.toLowerCase(), //USDT
    '0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7'.toLowerCase(), //BUSD
  ],
}

//Higher index = higher priority
hierarchyPerNetwork[NETWORKS.ETHEREUM.NAME] = {
  baseTokenPriority: [
    ...ethereumTokens.highPriorityTokens,
    ethereumTokens.native,
    ...ethereumTokens.stables,
  ],
  feeTokenPriority: [
    ...ethereumTokens.highPriorityTokens,
    ...ethereumTokens.stables,
    ethereumTokens.native,
  ],
}

//Higher index = higher priority
hierarchyPerNetwork[NETWORKS.AVALANCHE.NAME] = {
  baseTokenPriority: [
    ...avalancheTokens.highPriorityTokens,
    avalancheTokens.native,
    ...avalancheTokens.stables,
  ],
  feeTokenPriority: [
    ...avalancheTokens.highPriorityTokens,
    ...avalancheTokens.stables,
    avalancheTokens.native,
  ],
}

//Higher index = higher priority
hierarchyPerNetwork[NETWORKS.BSC.NAME] = {
  baseTokenPriority: [
    ...bscTokens.highPriorityTokens,
    bscTokens.native,
    ...bscTokens.stables,
  ],
  feeTokenPriority: [
    ...bscTokens.highPriorityTokens,
    ...bscTokens.stables,
    bscTokens.native,
  ],
}

//Higher index = higher priority
hierarchyPerNetwork[NETWORKS.MOONBEAM.NAME] = {
  baseTokenPriority: [
    ...moonbeamTokens.highPriorityTokens,
    moonbeamTokens.native,
    ...moonbeamTokens.stables,
  ],
  feeTokenPriority: [
    ...moonbeamTokens.highPriorityTokens,
    ...moonbeamTokens.stables,
    moonbeamTokens.native,
  ],
}

//Higher index = higher priority
hierarchyPerNetwork[NETWORKS.MOONRIVER.NAME] = {
  baseTokenPriority: [
    ...moonriverTokens.highPriorityTokens,
    moonriverTokens.native,
    ...moonriverTokens.stables,
  ],
  feeTokenPriority: [
    ...moonriverTokens.highPriorityTokens,
    ...moonriverTokens.stables,
    moonriverTokens.native,
  ],
}

hierarchyPerNetwork[NETWORKS.METIS.NAME] = {
  baseTokenPriority: [
    ...metisTokens.highPriorityTokens,
    metisTokens.native,
    ...metisTokens.stables,
  ],
  feeTokenPriority: [
    ...metisTokens.highPriorityTokens,
    ...metisTokens.stables,
    metisTokens.native,
  ],
}

hierarchyPerNetwork[NETWORKS.POLYGON.NAME] = {
  baseTokenPriority: [
    ...polygonTokens.highPriorityTokens,
    polygonTokens.native,
    ...polygonTokens.stables,
  ],
  feeTokenPriority: [
    ...polygonTokens.highPriorityTokens,
    ...polygonTokens.stables,
    polygonTokens.native,
  ],
}

function isToken0HigherPriority(
  chainId: string,
  priorityArray: Array<string>,
  token0Address: string,
  token1Address: string,
  strict = false,
) {
  if (!priorityArray) throw new Error('Priority list for network not found')

  const token0Index = priorityArray.indexOf(token0Address.toLowerCase())
  const token1Index = priorityArray.indexOf(token1Address.toLowerCase())

  if (token0Index < 0 && token1Index < 0) {
    if (strict) {
      throw new Error(
        `no priority token found on the pair ${token0Address}-${token1Address}`,
      )
    } else {
      return token0Address > token1Address
    }
  }

  //Higher index = higher priority
  //If one side of the pair isn't on the priority list, the other will always have a higher index,
  // since indexOf returns -1 for objects that aren't present on the array
  return token0Index > token1Index
}

export function isToken0BaseOfPair(
  network: string,
  chainId: string,
  token0Address: string,
  token1Address: string,
) {
  const baseTokenPriority = hierarchyPerNetwork[network]?.baseTokenPriority
  return isToken0HigherPriority(
    chainId,
    baseTokenPriority,
    token0Address,
    token1Address,
  )
}

export function shouldTakeFeeFromToken0(
  network: string,
  chainId: string,
  token0Address: string,
  token1Address: string,
) {
  const feeTokenPriority = hierarchyPerNetwork[network]?.feeTokenPriority
  return isToken0HigherPriority(
    chainId,
    feeTokenPriority,
    token0Address,
    token1Address,
  )
}
