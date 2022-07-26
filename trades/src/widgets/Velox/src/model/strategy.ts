import type { Strategy as VeloxStrategy } from '@rbl/velox-common/veloxModels';
export type Strategy = VeloxStrategy;

export interface StrategyWithSignature extends Strategy {
  signedMessage: string;
}

export interface PartnerStrategyData extends Strategy {
  trigger: TriggerData;
}

export enum TriggerType {
  UsdBased = 'usdBased',
  Ratio = 'ratio',
}

export enum Direction {
  Up = 'up',
  Down = 'down',
}

export interface TriggerData {
  triggerType: TriggerType;
  quoteTokenAddress: string;
  direction: Direction;
  threshold: string;
}

// prettier-ignore
export interface PartnerStrategyDeployed extends Strategy {
  inToken: { symbol: string; name: string, primary_img_uri: string | undefined },
  outToken: { symbol: string; name: string, primary_img_uri: string | undefined },
  //string will be deprecated after a database migration
  transactionHash?:String|Array<string>,
  id: number,
  created_at:string,
  updated_at:string
  trigger: TriggerData;
}
