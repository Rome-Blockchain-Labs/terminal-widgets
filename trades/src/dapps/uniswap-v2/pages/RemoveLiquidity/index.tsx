import { BigNumber } from '@ethersproject/bignumber';
import { splitSignature } from '@ethersproject/bytes';
import { TransactionResponse } from '@ethersproject/providers';
import {
  Currency,
  currencyEquals,
  ETHER,
  Percent,
  WETH,
} from '@rbl/velox-common/uniV2ClonesSDK';
import { Contract } from 'ethers';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ArrowDown, Plus } from 'react-feather';
import { Text } from 'rebass';
import tw, { theme } from 'twin.macro';

import {
  ButtonConfirmed,
  ButtonLight,
  ButtonPrimary,
} from '../../../../components/buttons';
import { LightCard } from '../../../../components/card';
import { AutoColumn, ColumnCenter } from '../../../../components/column';
import {
  ConfirmationModalContent,
  TransactionConfirmationModal,
} from '../../../../components/modals';
import { AddRemoveTabs } from '../../../../components/navigationTabs';
import Row, { RowBetween, RowFixed } from '../../../../components/row';
import Slider from '../../../../components/slider';
import { getNativeTokenFromNetworkName } from '../../../../constants/networkExchange';
import { DappContext } from '../../../../contexts';
import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { useDebouncedChangeHandler, usePairContract } from '../../../../hooks';
import {
  calculateGasMargin,
  calculateSlippageAmount,
  currencyId,
  getDefaultCurrencySymbol,
  getRouterContract,
  wrappedCurrency,
} from '../../../../utils';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import CurrencyLogo from '../../components/CurrencyLogo';
import DoubleCurrencyLogo from '../../components/DoubleLogo';
import { MinimalPositionCard } from '../../components/PositionCard';
import { Dots } from '../../components/swap/styleds';
import { useCurrency } from '../../hooks/Tokens';
import {
  ApprovalState,
  useApproveCallback,
} from '../../hooks/useApproveCallback';
import { useWalletModalToggle } from '../../state/application/hooks';
import { Field } from '../../state/burn/actions';
import { useBurnActionHandlers } from '../../state/burn/hooks';
import { useBurnState, useDerivedBurnInfo } from '../../state/burn/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import {
  useUserDeadline,
  useUserSlippageTolerance,
} from '../../state/user/hooks';
import AppBody from '../AppBody';
import { ClickableText, MaxButton, Wrapper } from '../Pool/styleds';

export default function RemoveLiquidity({
  currencyIdA: defaultCurrencyIdA,
  currencyIdB: defaultCurrencyIdB,
  onBack,
}: {
  currencyIdA: string;
  currencyIdB: string;
  onBack: () => void;
}) {
  const [currencyIdA, setCurrencyIdA] = useState<string | undefined>(
    defaultCurrencyIdA
  );
  const [currencyIdB, setCurrencyIdB] = useState<string | undefined>(
    defaultCurrencyIdB
  );

  const {
    network,
    router: { ABI: routerABI, address: routerAddress },
  } = useContext(DappContext);

  const [currencyA, currencyB] = [
    useCurrency(currencyIdA, network) ?? undefined,
    useCurrency(currencyIdB, network) ?? undefined,
  ];
  const { account, chainId, provider } = useWallets();
  const [tokenA, tokenB] = useMemo(
    () => [
      wrappedCurrency(currencyA, chainId),
      wrappedCurrency(currencyB, chainId),
    ],
    [currencyA, currencyB, chainId]
  );

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // burn state
  const { independentField, typedValue } = useBurnState();
  const { error, pair, parsedAmounts } = useDerivedBurnInfo(
    currencyA ?? undefined,
    currencyB ?? undefined
  );
  const { onUserInput: _onUserInput } = useBurnActionHandlers();
  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showDetailed, setShowDetailed] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState(false); // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('');
  const [deadline] = useUserDeadline();
  const [allowedSlippage] = useUserSlippageTolerance();

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo(
      '0'
    )
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY
        ? typedValue
        : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A
        ? typedValue
        : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B
        ? typedValue
        : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  };

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(
    new Percent('1')
  );

  // pair contract
  const pairContract: Contract | null = usePairContract(
    pair?.liquidityToken?.address
  );

  // allowance handling
  const [signatureData, setSignatureData] = useState<{
    v: number;
    r: string;
    s: string;
    deadline: number;
  } | null>(null);
  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    routerAddress
  );
  async function onAttemptToApprove() {
    if (!pairContract || !pair || !provider)
      throw new Error('missing dependencies');
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
    if (!liquidityAmount) throw new Error('missing liquidity amount');
    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account);

    const deadlineForSignature: number =
      Math.ceil(Date.now() / 1000) + deadline;

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ];
    const domain = {
      chainId: chainId,
      name: 'Pangolin Liquidity',
      verifyingContract: pair.liquidityToken.address,
      version: '1',
    };
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ];
    const message = {
      deadline: deadlineForSignature,
      nonce: nonce.toHexString(),
      owner: account,
      spender: routerAddress,
      value: liquidityAmount.raw.toString(),
    };
    const data = JSON.stringify({
      domain,
      message,
      primaryType: 'Permit',
      types: {
        EIP712Domain,
        Permit,
      },
    });

    provider
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          deadline: deadlineForSignature,
          r: signature.r,
          s: signature.s,
          v: signature.v,
        });
      })
      .catch((error) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback();
        }
      });
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setSignatureData(null);
      return _onUserInput(field, typedValue);
    },
    [_onUserInput]
  );

  const onLiquidityInput = useCallback(
    (typedValue: string): void => onUserInput(Field.LIQUIDITY, typedValue),
    [onUserInput]
  );
  const onCurrencyAInput = useCallback(
    (typedValue: string): void => onUserInput(Field.CURRENCY_A, typedValue),
    [onUserInput]
  );
  const onCurrencyBInput = useCallback(
    (typedValue: string): void => onUserInput(Field.CURRENCY_B, typedValue),
    [onUserInput]
  );

  // tx sending
  const addTransaction = useTransactionAdder();
  const onRemove = useCallback(async () => {
    if (!chainId || !provider || !account)
      throw new Error('missing dependencies');
    const {
      [Field.CURRENCY_A]: currencyAmountA,
      [Field.CURRENCY_B]: currencyAmountB,
    } = parsedAmounts;
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts');
    }
    const router = getRouterContract(
      routerAddress,
      routerABI,
      provider,
      account
    );

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(
        currencyAmountA,
        allowedSlippage
      )[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(
        currencyAmountB,
        allowedSlippage
      )[0],
    };

    if (!currencyA || !currencyB) throw new Error('missing tokens');
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
    if (!liquidityAmount) throw new Error('missing liquidity amount');

    const currencyBIsETH = currencyB === ETHER;
    const oneCurrencyIsETH = currencyA === ETHER || currencyBIsETH;
    const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline;

    if (!tokenA || !tokenB) throw new Error('could not wrap');

    let methodNames: string[],
      args: Array<string | string[] | number | boolean>;
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = [
          'removeLiquidityAVAX',
          'removeLiquidityAVAXSupportingFeeOnTransferTokens',
        ];
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
          ].toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
          ].toString(),
          account,
          deadlineFromNow,
        ];
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity'];
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadlineFromNow,
        ];
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = [
          'removeLiquidityAVAXWithPermit',
          'removeLiquidityAVAXWithPermitSupportingFeeOnTransferTokens',
        ];
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
          ].toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
          ].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ];
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit'];
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ];
      }
    } else {
      throw new Error(
        'Attempting to confirm without approval or a signature. Please contact support.'
      );
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((error) => {
            console.error('estimateGas failed', methodName, args, error);
            return undefined;
          })
      )
    );

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(
      (safeGasEstimate) => BigNumber.isBigNumber(safeGasEstimate)
    );

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.');
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation];
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];

      setAttemptingTxn(true);
      await router[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            summary:
              'Remove ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              getDefaultCurrencySymbol(currencyA) +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              getDefaultCurrencySymbol(currencyB),
          });

          setTxHash(response.hash);
        })
        .catch((error: Error) => {
          setAttemptingTxn(false);
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error);
        });
    }
  }, [
    account,
    addTransaction,
    allowedSlippage,
    approval,
    chainId,
    currencyA,
    currencyB,
    deadline,
    provider,
    parsedAmounts,
    routerABI,
    routerAddress,
    signatureData,
    tokenA,
    tokenB,
  ]);

  const modalHeader = useMemo(
    () => (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        <RowBetween align="flex-end">
          <Text fontSize={24} fontWeight={500}>
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </Text>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyA} size={'24px'} />
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {getDefaultCurrencySymbol(currencyA)}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <Plus color={theme`colors.white`} size="16" />
        </RowFixed>
        <RowBetween align="flex-end">
          <Text fontSize={24} fontWeight={500}>
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </Text>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyB} size={'24px'} />
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {getDefaultCurrencySymbol(currencyB)}
            </Text>
          </RowFixed>
        </RowBetween>

        <span tw="text-white text-xl pt-3 font-medium">
          {`Output is estimated. If the price changes by more than ${
            allowedSlippage / 100
          }% your transaction will revert.`}
        </span>
      </AutoColumn>
    ),
    [allowedSlippage, currencyA, currencyB, parsedAmounts]
  );

  const modalBottom = useMemo(
    () => (
      <>
        <RowBetween>
          <Text color={theme`colors.white`} fontSize={16} fontWeight={500}>
            {'PGL ' +
              getDefaultCurrencySymbol(currencyA) +
              '/' +
              getDefaultCurrencySymbol(currencyB)}{' '}
            Burned
          </Text>
          <RowFixed>
            <DoubleCurrencyLogo
              currency0={currencyA}
              currency1={currencyB}
              margin={true}
            />
            <Text fontSize={16} fontWeight={500}>
              {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
            </Text>
          </RowFixed>
        </RowBetween>
        {pair && (
          <>
            <RowBetween>
              <Text color={theme`colors.white`} fontSize={16} fontWeight={500}>
                Price
              </Text>
              <Text color={theme`colors.white`} fontSize={16} fontWeight={500}>
                1 {getDefaultCurrencySymbol(currencyA)} ={' '}
                {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'}{' '}
                {getDefaultCurrencySymbol(currencyB)}
              </Text>
            </RowBetween>
            <RowBetween>
              <div />
              <Text color={theme`colors.white`} fontSize={16} fontWeight={500}>
                1 {getDefaultCurrencySymbol(currencyB)} ={' '}
                {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'}{' '}
                {getDefaultCurrencySymbol(currencyA)}
              </Text>
            </RowBetween>
          </>
        )}
        <ButtonPrimary
          disabled={
            !(approval === ApprovalState.APPROVED || signatureData !== null)
          }
          onClick={onRemove}
        >
          <Text fontSize={20} fontWeight={500}>
            Confirm
          </Text>
        </ButtonPrimary>
      </>
    ),
    [
      approval,
      currencyA,
      currencyB,
      onRemove,
      pair,
      parsedAmounts,
      signatureData,
      tokenA,
      tokenB,
    ]
  );

  const pendingText = useMemo(
    () =>
      `Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(
        6
      )} ${getDefaultCurrencySymbol(currencyA)} and ${parsedAmounts[
        Field.CURRENCY_B
      ]?.toSignificant(6)} ${getDefaultCurrencySymbol(currencyB)}`,
    [currencyA, currencyB, parsedAmounts]
  );

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString());
    },
    [onUserInput]
  );

  const oneCurrencyIsETH = currencyA === ETHER || currencyB === ETHER;
  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals((WETH as any)[chainId], currencyA)) ||
        (currencyB && currencyEquals((WETH as any)[chainId], currencyB)))
  );

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        setCurrencyIdA(currencyId(currency));
        setCurrencyIdB(currencyIdA);
      } else {
        setCurrencyIdA(currencyId(currency));
        setCurrencyIdB(currencyIdB);
      }
    },
    [currencyIdA, currencyIdB]
  );
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        setCurrencyIdA(currencyIdB);
        setCurrencyIdB(currencyId(currency));
      } else {
        setCurrencyIdA(currencyIdA);
        setCurrencyIdB(currencyId(currency));
      }
    },
    [currencyIdA, currencyIdB]
  );

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    setSignatureData(null); // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0');
    }
    setTxHash('');
  }, [onUserInput, txHash]);

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] =
    useDebouncedChangeHandler(
      Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
      liquidityPercentChangeCallback
    );
  const nativeCurrencySymbol = getNativeTokenFromNetworkName(network)?.symbol;

  return (
    <>
      <AppBody>
        <TransactionConfirmationModal
          attemptingTxn={attemptingTxn}
          content={() => (
            <ConfirmationModalContent
              bottomContent={modalBottom}
              title={'You will receive'}
              topContent={modalHeader}
              onDismiss={handleDismissConfirmation}
            />
          )}
          hash={txHash ? txHash : ''}
          isOpen={showConfirm}
          pendingText={pendingText}
          onDismiss={handleDismissConfirmation}
        />
        <AddRemoveTabs adding={false} onBack={onBack} />
        <Wrapper>
          <AutoColumn gap="md">
            <LightCard>
              <AutoColumn gap="5px">
                <RowBetween>
                  <span tw="text-xl">Amount</span>
                  <ClickableText
                    fontWeight={500}
                    onClick={() => {
                      setShowDetailed(!showDetailed);
                    }}
                  >
                    {showDetailed ? 'Simple' : 'Detailed'}
                  </ClickableText>
                </RowBetween>
                <Row style={{ justifyContent: 'center' }}>
                  <span
                    css={[
                      tw`font-bold font-fira`,
                      {
                        fontSize: 32,
                      },
                    ]}
                  >
                    {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
                  </span>
                </Row>
                {!showDetailed && (
                  <>
                    <Slider
                      size={16}
                      value={innerLiquidityPercentage}
                      onChange={setInnerLiquidityPercentage}
                    />
                    <RowBetween>
                      <MaxButton
                        width="20%"
                        onClick={() =>
                          onUserInput(Field.LIQUIDITY_PERCENT, '25')
                        }
                      >
                        25%
                      </MaxButton>
                      <MaxButton
                        width="20%"
                        onClick={() =>
                          onUserInput(Field.LIQUIDITY_PERCENT, '50')
                        }
                      >
                        50%
                      </MaxButton>
                      <MaxButton
                        width="20%"
                        onClick={() =>
                          onUserInput(Field.LIQUIDITY_PERCENT, '75')
                        }
                      >
                        75%
                      </MaxButton>
                      <MaxButton
                        width="20%"
                        onClick={() =>
                          onUserInput(Field.LIQUIDITY_PERCENT, '100')
                        }
                      >
                        Max
                      </MaxButton>
                    </RowBetween>
                  </>
                )}
              </AutoColumn>
            </LightCard>
            {!showDetailed && (
              <>
                <ColumnCenter>
                  <ArrowDown color={theme`colors.yellow.400`} size="16" />
                </ColumnCenter>
                <LightCard>
                  <AutoColumn gap="10px">
                    <RowBetween>
                      <span tw="text-xl font-medium">
                        {formattedAmounts[Field.CURRENCY_A] || '-'}
                      </span>
                      <RowFixed>
                        <CurrencyLogo
                          currency={currencyA}
                          size="16px"
                          style={{ marginRight: '12px' }}
                        />
                        <span
                          id="remove-liquidity-tokena-symbol"
                          tw="text-xl font-medium"
                        >
                          {getDefaultCurrencySymbol(currencyA)}
                        </span>
                      </RowFixed>
                    </RowBetween>
                    <RowBetween>
                      <span tw="text-xl font-medium">
                        {formattedAmounts[Field.CURRENCY_B] || '-'}
                      </span>
                      <RowFixed>
                        <CurrencyLogo
                          currency={currencyB}
                          size="16px"
                          style={{ marginRight: '12px' }}
                        />
                        <span
                          id="remove-liquidity-tokenb-symbol"
                          tw="text-xl font-medium"
                        >
                          {getDefaultCurrencySymbol(currencyB)}
                        </span>
                      </RowFixed>
                    </RowBetween>
                    {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                      <RowBetween style={{ justifyContent: 'flex-end' }}>
                        {oneCurrencyIsETH ? (
                          <button
                            tw="text-yellow-400"
                            onClick={() => {
                              setCurrencyIdA(
                                currencyA === ETHER
                                  ? (WETH as any)[chainId].address
                                  : currencyIdA
                              );
                              setCurrencyIdB(
                                currencyB === ETHER
                                  ? (WETH as any)[chainId].address
                                  : currencyIdB
                              );
                            }}
                          >
                            Receive {nativeCurrencySymbol}
                          </button>
                        ) : oneCurrencyIsWETH ? (
                          <button
                            tw="text-yellow-400"
                            onClick={() => {
                              setCurrencyIdA(
                                currencyA &&
                                  currencyEquals(
                                    currencyA,
                                    (WETH as any)[chainId]
                                  )
                                  ? 'AVAX' //todo
                                  : currencyIdA
                              );
                              setCurrencyIdB(
                                currencyB &&
                                  currencyEquals(
                                    currencyB,
                                    (WETH as any)[chainId]
                                  )
                                  ? 'AVAX' //todo
                                  : currencyIdB
                              );
                            }}
                          >
                            Receive ${nativeCurrencySymbol}
                          </button>
                        ) : null}
                      </RowBetween>
                    ) : null}
                  </AutoColumn>
                </LightCard>
              </>
            )}

            {showDetailed && (
              <>
                <CurrencyInputPanel
                  disableCurrencySelect
                  currency={pair?.liquidityToken}
                  id="liquidity-amount"
                  pair={pair}
                  showMaxButton={!atMaxAmount}
                  value={formattedAmounts[Field.LIQUIDITY]}
                  onMax={() => {
                    onUserInput(Field.LIQUIDITY_PERCENT, '100');
                  }}
                  onUserInput={onLiquidityInput}
                />
                <ColumnCenter>
                  <ArrowDown color={theme`colors.white`} size="16" />
                </ColumnCenter>
                <CurrencyInputPanel
                  currency={currencyA}
                  hideBalance={true}
                  id="remove-liquidity-tokena"
                  label={'Output'}
                  showMaxButton={!atMaxAmount}
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onCurrencySelect={handleSelectCurrencyA}
                  onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                  onUserInput={onCurrencyAInput}
                />
                <ColumnCenter>
                  <Plus color={theme`colors.white`} size="16" />
                </ColumnCenter>
                <CurrencyInputPanel
                  currency={currencyB}
                  hideBalance={true}
                  id="remove-liquidity-tokenb"
                  label={'Output'}
                  showMaxButton={!atMaxAmount}
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onCurrencySelect={handleSelectCurrencyB}
                  onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                  onUserInput={onCurrencyBInput}
                />
              </>
            )}
            {pair && (
              <div style={{ padding: '4px 12px' }}>
                <RowBetween>
                  Price:
                  <div tw="text-xl">
                    1 {getDefaultCurrencySymbol(currencyA)} ={' '}
                    {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'}{' '}
                    {getDefaultCurrencySymbol(currencyB)}
                  </div>
                </RowBetween>
                <RowBetween>
                  <div />
                  <div tw="text-xl">
                    1 {getDefaultCurrencySymbol(currencyB)} ={' '}
                    {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'}{' '}
                    {getDefaultCurrencySymbol(currencyA)}
                  </div>
                </RowBetween>
              </div>
            )}
            <div style={{ position: 'relative' }}>
              {!account ? (
                <ButtonLight onClick={toggleWalletModal}>
                  Connect Wallet
                </ButtonLight>
              ) : (
                <RowBetween>
                  <ButtonConfirmed
                    confirmed={
                      approval === ApprovalState.APPROVED ||
                      signatureData !== null
                    }
                    disabled={
                      approval !== ApprovalState.NOT_APPROVED ||
                      signatureData !== null
                    }
                    fontSize={16}
                    fontWeight={500}
                    mr="0.5rem"
                    onClick={onAttemptToApprove}
                  >
                    {approval === ApprovalState.PENDING ? (
                      <Dots>Approving</Dots>
                    ) : approval === ApprovalState.APPROVED ||
                      signatureData !== null ? (
                      'Approved'
                    ) : (
                      'Approve'
                    )}
                  </ButtonConfirmed>
                  <button
                    disabled={
                      !isValid ||
                      (signatureData === null &&
                        approval !== ApprovalState.APPROVED)
                    }
                    tw="text-white text-xl font-medium py-2 px-4"
                    onClick={() => setShowConfirm(true)}
                  >
                    {error || 'Remove'}
                  </button>
                  {/* <ButtonError
                    disabled={
                      !isValid ||
                      (signatureData === null &&
                        approval !== ApprovalState.APPROVED)
                    }
                    error={
                      !isValid &&
                      !!parsedAmounts[Field.CURRENCY_A] &&
                      !!parsedAmounts[Field.CURRENCY_B]
                    }
                    onClick={() => {
                      setShowConfirm(true);
                    }}
                  >
                    <Text fontSize={16} fontWeight={500}>
                      {error || 'Remove'}
                    </Text>
                  </ButtonError> */}
                </RowBetween>
              )}
            </div>
          </AutoColumn>
        </Wrapper>
      </AppBody>

      {pair ? (
        <AutoColumn style={{ marginTop: '1rem', minWidth: '20rem' }}>
          <MinimalPositionCard pair={pair} showUnwrapped={oneCurrencyIsWETH} />
        </AutoColumn>
      ) : null}
    </>
  );
}
