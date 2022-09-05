import { AppEnv, AppEnvDataMap } from '../types';
// import { WidgetClassification } from './widgets/types';

export const ROME_ENV: string = process.env.REACT_APP_ROME_ENV || '';

export const FIREBASE_WEB_API_KEY = process.env.REACT_APP_FIREBASE_WEB_API_KEY;
export const FIREBASE_CHART_DATA_STORAGE =
  process.env.REACT_APP_FIREBASE_CHART_DATA_STORAGE;

export const GA_CODE = process.env.REACT_APP_GA_CODE;
export const HASURA_API_ENDPOINT_WS =
  process.env.REACT_APP_HASURA_API_ENDPOINT_WS;
export const HASURA_ADMIN_SECRET = process.env.REACT_APP_HASURA_ADMIN_SECRET;
export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;

export const KYBER_MAINNET_ENV = process.env.REACT_APP_KYBER_MAINNET_ENV;
export const KYBER_INFURA_KEY = process.env.REACT_APP_KYBER_INFURA_KEY;
export const KYBER_AGGREGATOR_API = process.env.REACT_APP_KYBER_AGGREGATOR_API;
export const KYBER_AGGREGATOR_STATS_API =
  process.env.REACT_APP_KYBER_AGGREGATOR_STATS_API;
export const KYBER_KRYSTAL_API = process.env.REACT_APP_KYBER_KRYSTAL_API;

export function getEnvDataFrom<Type>(
  env: AppEnv,
  dataMap: AppEnvDataMap<Type>
): Type | undefined {
  if (!Object.values(AppEnv).includes(env)) {
    throw new Error(
      `REACT_APP_ROME_ENV must be one of ${JSON.stringify(AppEnv)}`
    );
  }
  return dataMap[env];
}

export function getCurrentEnvDataFrom<Type>(
  data: AppEnvDataMap<Type>
): Type | undefined {
  return getEnvDataFrom(ROME_ENV as AppEnv, data);
}
