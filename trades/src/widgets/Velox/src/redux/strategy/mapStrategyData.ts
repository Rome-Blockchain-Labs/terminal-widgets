import { PartnerStrategyDeployed, Strategy } from '../../model/strategy';
import loggerWithCloud from '../../utils/logging/loggerWithCloud';

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

//todo this can be removed completely if the downstream uses of the old style of data are changed
export const recaclulateAndInjectMinMax = (
  partnerStrategy: PartnerStrategyDeployed
) => {
  switch (partnerStrategy.trigger.quoteTokenAddress) {
    case partnerStrategy.tokenInAddress:
      partnerStrategy.isUsdPriceRelatedToTokenIn = true;
      break;
    case partnerStrategy.tokenOutAddress:
      partnerStrategy.isUsdPriceRelatedToTokenIn = false;
      break;
    default:
      loggerWithCloud.error('Invalid price trigger quoteTokenAddress');
      throw new Error('Invalid price trigger quoteTokenAddress');
  }

  switch (partnerStrategy.trigger.triggerType) {
    case TriggerType.UsdBased:
      switch (partnerStrategy.trigger.direction) {
        case Direction.Up:
          partnerStrategy.minUsdPrice = parseFloat(
            partnerStrategy.trigger.threshold
          ).toString();
          break;
        case Direction.Down:
          partnerStrategy.maxUsdPrice = parseFloat(
            partnerStrategy.trigger.threshold
          ).toString();
          break;
        default:
          loggerWithCloud.error('Invalid price trigger direction');
          throw new Error('Invalid price trigger direction');
      }
      break;
    case TriggerType.Ratio:
      switch (partnerStrategy.trigger.direction) {
        case Direction.Up:
          if (partnerStrategy.isUsdPriceRelatedToTokenIn)
            partnerStrategy.minTokenOutPerTokenIn =
              partnerStrategy.trigger.threshold;
          else
            partnerStrategy.maxTokenOutPerTokenIn = String(
              1 / Number(partnerStrategy.trigger.threshold)
            );
          break;
        case Direction.Down:
          if (partnerStrategy.isUsdPriceRelatedToTokenIn)
            partnerStrategy.maxTokenOutPerTokenIn =
              partnerStrategy.trigger.threshold;
          else
            partnerStrategy.minTokenOutPerTokenIn = String(
              1 / Number(partnerStrategy.trigger.threshold)
            );
          break;
        default:
          loggerWithCloud.error('Invalid price trigger direction');
          throw new Error('Invalid price trigger direction');
      }
      break;
    default:
      loggerWithCloud.error('Invalid price trigger type');
      throw new Error('Invalid price trigger type');
  }
  return partnerStrategy;
};

export const calculateTrigger = (strategy: Strategy) => {
  const {
    isUsdPriceRelatedToTokenIn,
    maxTokenOutPerTokenIn,
    maxUsdPrice,
    minTokenOutPerTokenIn,
    minUsdPrice,
    tokenInAddress,
    tokenOutAddress,
  } = strategy;

  const triggerData = {} as TriggerData;

  triggerData.quoteTokenAddress = isUsdPriceRelatedToTokenIn
    ? tokenInAddress
    : tokenOutAddress;

  const isRatioTrigger = minTokenOutPerTokenIn || maxTokenOutPerTokenIn;
  const isUsdPriceTrigger = minUsdPrice || maxUsdPrice;

  triggerData.threshold =
    minUsdPrice ||
    maxUsdPrice ||
    minTokenOutPerTokenIn ||
    maxTokenOutPerTokenIn ||
    '';

  if (isUsdPriceTrigger) {
    triggerData.triggerType = TriggerType.UsdBased;

    if (maxUsdPrice) triggerData.direction = Direction.Down;
    else if (minUsdPrice) triggerData.direction = Direction.Up;
    else throw new Error('Internal trigger direction issue');
  } else if (isRatioTrigger) {
    triggerData.triggerType = TriggerType.Ratio;

    if (isUsdPriceRelatedToTokenIn) {
      if (maxTokenOutPerTokenIn) triggerData.direction = Direction.Down;
      else if (minTokenOutPerTokenIn) triggerData.direction = Direction.Up;
      else throw new Error('Internal trigger direction issue');
    } else {
      triggerData.threshold = String(1 / Number(triggerData.threshold));

      if (maxTokenOutPerTokenIn) triggerData.direction = Direction.Up;
      else if (minTokenOutPerTokenIn) triggerData.direction = Direction.Down;
      else throw new Error('Internal trigger direction issue');
    }
  }

  return triggerData;
};
