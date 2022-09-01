import React from 'react';

import IconComplete from '../../../assets/icons/icon-complete.svg';
import IconError from '../../../assets/icons/icon-error.svg';
import IconOrangeError from '../../../assets/icons/icon-orange-error.svg';
import IconProgress from '../../../assets/icons/icon-progress.svg';
import IconQuestion from '../../../assets/icons/icon-question.svg';
import { PinkTooltip } from '../../../components/Icons';
import { PartnerStrategyDeployed } from '../../../model/strategy';
import TxHashIcon from './TxHashIcon';

const getErrorText = (
  errorStatus: string,
  strategy?: PartnerStrategyDeployed
) => {
  if (errorStatus === 'SLIPPAGE_PERCENT_EXCEEDED') {
    return 'Strategy slippage was not set high enough';
  }
  if (errorStatus === 'EXECUTION_FAILED') {
    return 'Transaction failed';
  }
  if (errorStatus === 'INSUFFICIENT_GAS_PRICE') {
    return 'Not enough gas allowance';
  }
  if (['INSUFFICIENT_WETH_ALLOWANCE'].includes(errorStatus)) {
    return 'Not enough native token allowance';
  }
  if (['INSUFFICIENT_TOKEN_ALLOWANCE'].includes(errorStatus)) {
    return 'Not enough token allowance';
  }
  if (['INSUFFICIENT_TOKEN_BALANCE'].includes(errorStatus)) {
    return 'Not enough token balance';
  }
  if (['INSUFFICIENT_WETH_BALANCE'].includes(errorStatus)) {
    return 'Not enough native token balance';
  }
  if (
    [
      'INCORRET_TOKEN_IN_DECIMALS',
      'INCORRET_TOKEN_OUT_DECIMALS',
      'INVALID_TOKEN_IN_ADDRESS',
      'INVALID_TOKEN_OUT_ADDRESS',
      'INVALID_USER_ADDRESS',
      'MISSING_TOKEN_USD_VALUE',
      'INVALID_PAIR_ADDRESS',
    ].includes(errorStatus)
  ) {
    return 'Invalid inputs';
  }
  if (errorStatus === 'UNKNOWN_ERROR') {
    return 'Unexpected error occurred';
  }
  if (errorStatus === 'ONCHAIN_SIMULATION_FAIL') {
    return `Strategy was ready to execute but on chain simulation failed. Did not put transaction on chain to save gas. Please contact Velox for details on StrategyId:${
      strategy?.identifier || 'unknown'
    }`;
  }
  return 'Unknown error';
};

const StrategyStatusIcon = (props: { strategy: PartnerStrategyDeployed }) => {
  const { strategy } = props;
  const status = strategy.strategyStatus;

  const successfullyExecuted = status === 'SUCCESSFUL';
  const criteriaNotMet = ['TARGET_PRICE_NOT_MET', 'CREATED'].includes(status);
  const currentlyExecuting = status === 'IN_PROGRESS';

  if (successfullyExecuted) {
    return (
      <>
        <PinkTooltip title={'Complete'}>
          <img alt="complete" id="" src={IconComplete} width="20" />
        </PinkTooltip>
        <TxHashIcon strategy={strategy} />
      </>
    );
  }
  //todo change this if we subscribe live to this data
  if (criteriaNotMet || currentlyExecuting) {
    return (
      <PinkTooltip title={'In progress'}>
        <img alt="inProgress" id="" src={IconProgress} width="20" />
      </PinkTooltip>
    );
  }

  // Right now, only execution failed won't retry, so use the error icon'
  if (status === 'EXECUTION_FAILED') {
    return (
      <>
        <img alt="error icon" id="" src={IconError} width="20" />
        <PinkTooltip title={getErrorText(status, strategy)}>
          <img alt="more info" src={IconQuestion} width="20" />
        </PinkTooltip>
        <TxHashIcon strategy={strategy} />
      </>
    );
  }
  if (status === 'ONCHAIN_SIMULATION_FAIL') {
    return (
      <>
        <img alt="error icon" id="" src={IconOrangeError} width="20" />
        <PinkTooltip title={getErrorText(status, strategy)}>
          <img alt="more info" src={IconQuestion} width="20" />
        </PinkTooltip>
        <TxHashIcon strategy={strategy} />
      </>
    );
  }

  return (
    <>
      <PinkTooltip title={'In progress'}>
        <img alt="inProgress" id="" src={IconProgress} width="20" />
      </PinkTooltip>
      {/*todo using the progress icon, as errors will naturally retry -- to REVISIT LATER*/}
      {/*<img src={IconError} alt="error icon" width="20" id="" />*/}
      <PinkTooltip title={getErrorText(status, strategy)}>
        <img alt="more info" src={IconQuestion} width="20" />
      </PinkTooltip>
      <TxHashIcon strategy={strategy} />
    </>
  );
};

export default StrategyStatusIcon;
