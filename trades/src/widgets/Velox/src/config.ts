// export const UNISWAP_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
export const WETH_DECIMALS = 18;

export const DEFAULT_PAGE_SIZE = 10;

export const tokenSyncUri = String(
  process.env.REACT_APP_TOKEN_SYNC_URI ||
    'https://testvelox-pj4px6fmua-uc.a.run.app/v1/graphql'
).replace('ws', 'http');

export const strategyApiUri = String(process.env.REACT_APP_STRATEGY_API_URI);

export const strategyApiKey = String(process.env.REACT_APP_STRATEGY_API_KEY);

export const romeTokenSyncUri = String(
  process.env.REACT_APP_HASURA_API_ENDPOINT_WS ||
    'https://romenet.prod.velox.global/v1/graphql'
).replace('ws', 'http');

export const enableRinkeby =
  String(process.env.REACT_APP_ENABLE_RINKEBY) === 'true';

export const gasGweiToMinWeth = 0.0004;

export const minWethAllowance = 0;

export const renderedDecimals = 6;

export const loggingEndpoint = String(
  process.env.REACT_APP_VELOX_LOGGING_URL || '/logging'
);

export const enableVeloxWidgetMode =
  String(process.env.REACT_APP_ENABLE_VELOX_WIDGET_MODE) === 'true';
export const enableVeloxWidgetTest =
  String(process.env.REACT_APP_ENABLE_VELOX_WIDGET_TEST) === 'true';

export const googleAnalyticsCode = String(process.env.REACT_APP_GA_CODE);
