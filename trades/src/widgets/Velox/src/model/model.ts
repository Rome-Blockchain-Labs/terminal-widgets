import {
  pancakeswap,
  pangolin,
  rinkebyUniswap,
  sushiswap,
  uniswapV2,
  uniswapV3,
} from '../containers/exchangeSelector/allowableExchanges';

/**
 * Main bot configuration
 */
export interface VeloxBotConfiguration {
  tokenPair: String;
  tokenAmount: Number;
  ethAmount: Number;
  protocol: Protocol;
  action: Action;
  additionalParams: AdditionalParam[];
}

/**
 * Which protocol should we use.
 * For the MVP works UNISWAP only.
 */
export enum Protocol {
  UNISWAP,
  SUSHISWAP,
}
/**
 * BUY IF or SELL IF blocks
 */
export enum ActionType {
  BUY,
  SELL,
}
/**
 * Conditions for the action.
 */
export enum ActionCondition {
  /**
   * if price equals
   */
  PRICE_EQ,
  /**
   * Price increased on X percent
   */
  PERCENTAGE_UP,
  /**
   * Price decreased on X percent
   */
  PERCENTAGE_DOWN,
}

export interface Action {
  type: ActionType;
  condition: ActionCondition;
  payload: Number;
}

export enum AdditionalParamType {
  /**
   * cap gas cost at
   */
  CGCA,
  /**
   * Dynamic Transaction Threshold
   */
  DTT,
}
/**
 * All configuration params.
 * It might be also String but in the present configuration
 * we won't use it to avoid extra errors.
 */
export interface AdditionalParam {
  type: AdditionalParamType;
  value: Number | Boolean;
}

export type allowableExchanges =
  | typeof rinkebyUniswap
  | typeof sushiswap
  | typeof uniswapV2
  | typeof uniswapV3
  | typeof pangolin
  | typeof pancakeswap;
