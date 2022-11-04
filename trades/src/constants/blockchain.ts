import {
  ChainId,
  JSBI,
  Percent,
  Token,
  WETH,
} from '@rbl/velox-common/uniV2ClonesSDK';
import { Connector } from '@web3-react/types';

import CoinbaseSvg from '../assets/svgs/coinbase.svg';
import MetamaskSvg from '../assets/svgs/metamask-logo.svg';

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]?: Token[];
};

export const DAI = new Token(
  ChainId.AVALANCHE_MAINNET,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
);
export const USDC = new Token(
  ChainId.AVALANCHE_MAINNET,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
);

const WBNB = new Token(
  ChainId.BSC_MAINNET,
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  18,
  'WBNB',
  'Wrapped BNB'
);
const BNBUSDT = new Token(
  ChainId.BSC_MAINNET,
  '0x55d398326f99059fF775485246999027B3197955',
  18,
  'USDT',
  'BSC-USD'
);
const BNBUSDC = new Token(
  ChainId.BSC_MAINNET,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  18,
  'USDC',
  'USD Coin'
);
const BNBBUSD = new Token(
  ChainId.BSC_MAINNET,
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  18,
  'BUSD',
  'BUSD Token'
);

const WGLMR = new Token(
  ChainId.MOONBEAM_MAINNET,
  '0xAcc15dC74880C9944775448304B263D191c6077F',
  18,
  'WGLMR',
  'Wrapped GLMR'
);
const GLMRUSDC = new Token(
  ChainId.MOONBEAM_MAINNET,
  '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b',
  6,
  'USDC',
  'USD Coin'
);
const GLMRTether = new Token(
  ChainId.MOONBEAM_MAINNET,
  '0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73',
  6,
  'USDT',
  'Tether USD'
);

///river
const WMOVR = new Token(
  ChainId.MOONRIVER_MAINNET,
  '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
  18,
  'WMOVR',
  'Wrapped MOVR'
);

const MOVUSDC = new Token(
  ChainId.MOONRIVER_MAINNET,
  '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D',
  6,
  'USDC',
  'USD Coin'
);

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.AVALANCHE_MAINNET]: [WETH[ChainId.AVALANCHE_MAINNET], DAI, USDC],
  [ChainId.BSC_MAINNET]: [WBNB, BNBUSDT, BNBUSDC, BNBBUSD],
  [ChainId.MOONBEAM_MAINNET]: [WGLMR, GLMRTether, GLMRUSDC],
  [ChainId.MOONRIVER_MAINNET]: [WMOVR, MOVUSDC],
};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.AVALANCHE_MAINNET]: [WETH[ChainId.AVALANCHE_MAINNET], DAI, USDC],
  [ChainId.BSC_MAINNET]: [WBNB, BNBUSDT, BNBUSDC, BNBBUSD],
  [ChainId.MOONBEAM_MAINNET]: [WGLMR, GLMRTether, GLMRUSDC],
  [ChainId.MOONRIVER_MAINNET]: [WMOVR, MOVUSDC],
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.AVALANCHE_MAINNET]: [WETH[ChainId.AVALANCHE_MAINNET], DAI, USDC],
  [ChainId.BSC_MAINNET]: [WBNB, BNBUSDT, BNBUSDC, BNBBUSD],
  [ChainId.MOONBEAM_MAINNET]: [WGLMR, GLMRTether, GLMRUSDC],
  [ChainId.MOONRIVER_MAINNET]: [WMOVR, MOVUSDC],
};

export interface WalletInfo {
  connector?: Connector;
  name: string;
  icon: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const NetworkContextName = 'NETWORK';

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
  JSBI.BigInt(100),
  BIPS_BASE
); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
  JSBI.BigInt(300),
  BIPS_BASE
); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
  JSBI.BigInt(500),
  BIPS_BASE
); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(
  JSBI.BigInt(1000),
  BIPS_BASE
); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
  JSBI.BigInt(1500),
  BIPS_BASE
); // 15%

// used to ensure the user doesn't send so much AVAX so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(
  JSBI.BigInt(10),
  JSBI.BigInt(16)
); // .01 AVAX
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(
  JSBI.BigInt(75),
  JSBI.BigInt(10000)
);
