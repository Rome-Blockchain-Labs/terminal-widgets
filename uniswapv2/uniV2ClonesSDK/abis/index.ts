import PangolinRouterABI from './pangolin/router.json'
import UniswapSwapRouterAbi from './uniswapV2/router.json'
import PangolinMulticallABI from './pangolin/multicall.json'
import TraderjoeRouterABI from './traderjoe/router.json'
import TraderjoeMulticallABI from './traderjoe/multicall.json'
import UniswapV2MulticallABI from './uniswapV2/multicall.json'
import NetswapRouterABI from './netswap/router.json'
import NetswapMulticallABI from './netswap/multicall.json'
import { ExchangeName } from 'constants/multichain'
type ABIS = {
  [key in ExchangeName]: {
    ROUTER: any
    MULTICALL: any
  }
}

// TODO fill this object later
const abis: ABIS = {
  PANGOLIN: {
    ROUTER: PangolinRouterABI,
    MULTICALL: PangolinMulticallABI,
  },
  TRADERJOE: {
    ROUTER: TraderjoeRouterABI,
    MULTICALL: TraderjoeMulticallABI,
  },
  UNISWAPV2: {
    MULTICALL: UniswapV2MulticallABI,
    ROUTER: UniswapSwapRouterAbi,
  },
  UNISWAPV3: {
    ROUTER: {},
    MULTICALL: {},
  },
  SUSHISWAP: {
    ROUTER: UniswapSwapRouterAbi,
    MULTICALL: {},
  },
  PANCAKESWAP: {
    ROUTER: UniswapSwapRouterAbi, //note, the abi is identical to uniswap's abi
    MULTICALL: {},
  },
  SAFESWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  KYBERDMM: {
    ROUTER: {},
    MULTICALL: {},
  },
  YETISWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  ZEROEXCHANGE: {
    ROUTER: {},
    MULTICALL: {},
  },
  BAGUETTE: {
    ROUTER: {},
    MULTICALL: {},
  },
  CANARY: {
    ROUTER: {},
    MULTICALL: {},
  },
  LYDIAFINANCE: {
    ROUTER: {},
    MULTICALL: {},
  },
  ELKFINANCE: {
    ROUTER: {},
    MULTICALL: {},
  },
  PANDASWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  COMPLUSNETWORK: {
    ROUTER: {},
    MULTICALL: {},
  },
  OLIVESWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  MDEX: {
    ROUTER: UniswapSwapRouterAbi, //note, the abi is identical to uniswap's abi with some exentions
    MULTICALL: {},
  },
  'ELLIPSIS.FINANCE': {
    ROUTER: {},
    MULTICALL: {},
  },
  BISWAP: {
    ROUTER: UniswapSwapRouterAbi, //note, the abi is identical to uniswap's abi with some exentions
    MULTICALL: {},
  },
  APESWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  'KNIGHTSWAP.FINANCE': {
    ROUTER: {},
    MULTICALL: {},
  },
  BABYSWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  SYNAPSE: {
    ROUTER: {},
    MULTICALL: {},
  },
  BEAMSWAP: {
    ROUTER: UniswapSwapRouterAbi, //note, the abi is identical to uniswap's abi
    MULTICALL: {},
  },
  SOLARFLARE: {
    ROUTER: {},
    MULTICALL: {},
  },
  STELLASWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  ZENLINK: {
    ROUTER: {},
    MULTICALL: {},
  },
  SOLARBEAM: {
    ROUTER: UniswapSwapRouterAbi, //note, the abi is identical to uniswap's abi with with fee parameters
    MULTICALL: {},
  },
  SHIBASWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  QUICKSWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  SOLIDEX: {
    ROUTER: {},
    MULTICALL: {},
  },
  SPOOKYSWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  SPIRITSWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  'VVS.FINANCE': {
    ROUTER: {},
    MULTICALL: {},
  },
  'MM.FINANCE': {
    ROUTER: {},
    MULTICALL: {},
  },
  CRONASWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  CRODEX: {
    ROUTER: {},
    MULTICALL: {},
  },
  CYBORGSWAP: {
    ROUTER: {},
    MULTICALL: {},
  },
  NETSWAP: {
    ROUTER: NetswapRouterABI,
    MULTICALL: NetswapMulticallABI,
  },
}

export default abis
