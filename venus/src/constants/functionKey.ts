enum FunctionKey {
  // Queries
  GET_VAI_TREASURY_PERCENTAGE = 'GET_VAI_TREASURY_PERCENTAGE',
  GET_MARKETS = 'GET_MARKETS',
  GET_MARKET_HISTORY = 'GET_MARKET_HISTORY',
  GET_ASSETS_IN_ACCOUNT = 'GET_ASSETS_IN_ACCOUNT',
  GET_V_TOKEN_BALANCES_ALL = 'GET_V_TOKEN_BALANCES_ALL',
  GET_HYPOTHETICAL_LIQUIDITY = 'GET_HYPOTHETICAL_LIQUIDITY',
  GET_V_TOKEN_BALANCE = 'GET_V_TOKEN_BALANCE',
  GET_VENUS_ACCRUED = 'GET_VENUS_ACCRUED',
  GET_VENUS_VAI_STATE = 'GET_VENUS_VAI_STATE',
  GET_MINTED_VAI = 'GET_MINTED_VAI',
  GET_VENUS_VAI_MINTER_INDEX = 'GET_VENUS_VAI_MINTER_INDEX',
  GET_VENUS_INITIAL_INDEX = 'GET_VENUS_INITIAL_INDEX',
  GET_XVS_REWARD = 'GET_XVS_REWARD',
  GET_V_TOKEN_APY_SIMULATIONS = 'GET_V_TOKEN_APY_SIMULATIONS',
  GET_V_TOKEN_BORROW_BALANCE = 'GET_V_TOKEN_BORROW_BALANCE',
  GET_V_TOKEN_CASH = 'GET_V_TOKEN_CASH',
  GET_V_TOKEN_INTEREST_RATE_MODEL = 'GET_V_TOKEN_INTEREST_RATE_MODEL',
  GET_TOKEN_ALLOWANCE = 'GET_TOKEN_ALLOWANCE',
  GET_BALANCE_OF = 'GET_BALANCE_OF',
  GET_VRT_CONVERSION_END_TIME = 'GET_VRT_CONVERSION_END_TIME',
  GET_VRT_CONVERSION_RATIO = 'GET_VRT_CONVERSION_RATIO',
  GET_XVS_WITHDRAWABLE_AMOUNT = 'GET_XVS_WITHDRAWABLE_AMOUNT',

  // Mutations
  REQUEST_FAUCET_FUNDS = 'REQUEST_FAUCET_FUNDS',
  MINT_VAI = 'MINT_VAI',
  ENTER_MARKETS = 'ENTER_MARKETS',
  EXIT_MARKET = 'EXIT_MARKET',
  REPAY_VAI = 'REPAY_VAI',
  APPROVE_TOKEN = 'APPROVE_TOKEN',
  APPROVE_VRT = 'APPROVE_VRT',
  CONVERT_VRT = 'CONVERT_VRT',
  SUPPLY = 'SUPPLY',
  SUPPLY_BNB = 'SUPPLY_BNB',
  REDEEM = 'REDEEM',
  REDEEM_UNDERLYING = 'REDEEM_UNDERLYING',
  CLAIM_XVS_REWARD = 'CLAIM_XVS_REWARD',
  REPAY_NON_BNB_V_TOKEN = 'REPAY_NON_BNB_V_TOKEN',
  REPAY_BNB = 'REPAY_BNB',
  BORROW_V_TOKEN = 'BORROW_V_TOKEN',
  WITHDRAW_XVS = 'WITHDRAW_XVS',
}

export default FunctionKey;
