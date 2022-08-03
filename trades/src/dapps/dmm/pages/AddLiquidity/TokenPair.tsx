import {
  CurrencyAmount,
  ETHER,
  Fraction,
  JSBI,
  Token,
  TokenAmount,
} from '@dynamic-amm/sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3React } from '@romeblockchain/wallet';
import { parseUnits } from 'ethers/lib/utils';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { AlertTriangle, Plus } from 'react-feather';
import { Link } from 'react-router-dom';
import { Flex, Text } from 'rebass';
import { theme } from 'twin.macro';

import {
  ConfirmationModalContent,
  TransactionConfirmationModal,
  TransactionErrorContent,
} from '../../../../components/modals';
import { useSelector } from '../../../../hooks';
import { widgetByIdSelector } from '../../../../store/selectors/app';
import { DmmContext } from '../../../../widgets/Dmm/DmmContext';
import {
  ButtonError,
  ButtonLight,
  ButtonPrimary,
} from '../../components/Button';
import { AutoColumn, ColumnCenter } from '../../components/Column';
import { ConfirmAddModalBottom } from '../../components/ConfirmAddModalBottom';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import CurrentPrice from '../../components/CurrentPrice';
import Loader from '../../components/Loader';
import {
  PoolPriceBar,
  PoolPriceRangeBar,
  ToggleComponent,
} from '../../components/PoolPriceBar';
import QuestionHelper from '../../components/QuestionHelper';
import Row, { AutoRow, RowBetween, RowFlat } from '../../components/Row';
import { AMP_HINT, ROUTER_ADDRESSES } from '../../constants';
import { PairState } from '../../data/Reserves';
import { useCurrency } from '../../hooks/Tokens';
import {
  ApprovalState,
  useApproveCallback,
} from '../../hooks/useApproveCallback';
import useTokensMarketPrice from '../../hooks/useTokensMarketPrice';
import useTransactionDeadline from '../../hooks/useTransactionDeadline';
import {
  useTokensPrice,
  useWalletModalToggle,
} from '../../state/application/hooks';
import { Field } from '../../state/mint/actions';
import {
  useDerivedMintInfo,
  useMintActionHandlers,
  useMintState,
} from '../../state/mint/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import {
  useIsExpertMode,
  useUserSlippageTolerance,
} from '../../state/user/hooks';
import {
  calculateGasMargin,
  calculateSlippageAmount,
  formattedNum,
  getRouterContract,
} from '../../utils';
import {
  convertToNativeTokenFromETH,
  feeRangeCalc,
  useCurrencyConvertedToNative,
} from '../../utils/dmm';
import isZero from '../../utils/isZero';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import { wrappedCurrency } from '../../utils/wrappedCurrency';
import { Dots, Wrapper } from '../Pool/styleds';
import {
  ActiveText,
  CurrentPriceWrapper,
  DynamicFeeRangeWrapper,
  FirstColumn,
  GridColumn,
  PoolRatioWrapper,
  SecondColumn,
  Section,
  USDPrice,
  Warning,
} from './styled';

const TokenPair = ({
  currencyIdA,
  currencyIdB,
  pairAddress,
}: {
  currencyIdA: string;
  currencyIdB: string;
  pairAddress: string;
}) => {
  const { account, chainId, provider } = useWeb3React();
  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);

  const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected

  const expertMode = useIsExpertMode();

  // mint state
  const { independentField, otherTypedValue, typedValue } = useMintState();
  const {
    currencies,
    currencyBalances,
    dependentField,
    error,
    liquidityMinted,
    noLiquidity,
    pair,
    pairState,
    parsedAmounts,
    poolTokenPercentage,
    price,
    unAmplifiedPairAddress,
  } = useDerivedMintInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
    pairAddress
  );

  const nativeA = useCurrencyConvertedToNative(currencies[Field.CURRENCY_A]);
  const nativeB = useCurrencyConvertedToNative(currencies[Field.CURRENCY_B]);

  const amp = pair?.amp || JSBI.BigInt(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ampConvertedInBps = !!amp.toString()
    ? new Fraction(
        JSBI.BigInt(parseUnits(amp.toString() || '1', 20)),
        JSBI.BigInt(parseUnits('1', 16))
      )
    : undefined;

  const linkToUnamplifiedPool =
    !!ampConvertedInBps &&
    ampConvertedInBps.equalTo(JSBI.BigInt(10000)) &&
    !!unAmplifiedPairAddress &&
    !isZero(unAmplifiedPairAddress);
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity);

  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm
  // txn values
  const deadline = useTransactionDeadline(); // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance(); // custom from users
  const [txHash, setTxHash] = useState<string>('');
  const [addLiquidityError, setAddLiquidityError] = useState<string>('');

  // get formatted amounts
  const formattedAmounts = {
    [dependentField]: noLiquidity
      ? otherTypedValue
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    [independentField]: typedValue,
  };

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field]),
    };
  }, {});

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
    };
  }, {});
  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    !!chainId
      ? ROUTER_ADDRESSES[chainId as keyof typeof ROUTER_ADDRESSES]
      : undefined
  );
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    !!chainId
      ? ROUTER_ADDRESSES[chainId as keyof typeof ROUTER_ADDRESSES]
      : undefined
  );

  const addTransaction = useTransactionAdder();
  const onAdd = useCallback(async () => {
    // if (!pair) return
    if (!chainId || !provider || !account) return;
    const router = getRouterContract(chainId, provider, account);

    const {
      [Field.CURRENCY_A]: parsedAmountA,
      [Field.CURRENCY_B]: parsedAmountB,
    } = parsedAmounts;
    if (
      !parsedAmountA ||
      !parsedAmountB ||
      !currencyA ||
      !currencyB ||
      !deadline
    ) {
      return;
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(
        parsedAmountA,
        noLiquidity ? 0 : allowedSlippage
      )[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(
        parsedAmountB,
        noLiquidity ? 0 : allowedSlippage
      )[0],
    };
    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null;

    if (!pair) return;

    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER;

      const virtualReserveToken = pair.virtualReserveOf(
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId) as Token
      );
      const virtualReserveETH = pair.virtualReserveOf(
        wrappedCurrency(tokenBIsETH ? currencyB : currencyA, chainId) as Token
      );

      const currentRate = JSBI.divide(
        JSBI.multiply(
          virtualReserveETH.raw,
          JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(112))
        ),
        virtualReserveToken.raw
      );

      const allowedSlippageAmount = JSBI.divide(
        JSBI.multiply(currentRate, JSBI.BigInt(allowedSlippage)),
        JSBI.BigInt(10000)
      );

      const vReserveRatioBounds = [
        JSBI.subtract(currentRate, allowedSlippageAmount).toString(),
        JSBI.add(currentRate, allowedSlippageAmount).toString(),
      ];

      estimate = router.estimateGas.addLiquidityETH;
      method = router.addLiquidityETH;
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)
          ?.address ?? '', // token
        pair.address,
        // 40000,                                                                              //ampBps
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[
          tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
        ].toString(), // token min
        amountsMin[
          tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
        ].toString(), // eth min
        vReserveRatioBounds,
        account,
        deadline.toHexString(),
      ];
      value = BigNumber.from(
        (tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString()
      );
    } else {
      const virtualReserveA = pair.virtualReserveOf(
        wrappedCurrency(currencyA, chainId) as Token
      );
      const virtualReserveB = pair.virtualReserveOf(
        wrappedCurrency(currencyB, chainId) as Token
      );

      const currentRate = JSBI.divide(
        JSBI.multiply(
          virtualReserveB.raw,
          JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(112))
        ),
        virtualReserveA.raw
      );

      const allowedSlippageAmount = JSBI.divide(
        JSBI.multiply(currentRate, JSBI.BigInt(allowedSlippage)),
        JSBI.BigInt(10000)
      );

      const vReserveRatioBounds = [
        JSBI.subtract(currentRate, allowedSlippageAmount).toString(),
        JSBI.add(currentRate, allowedSlippageAmount).toString(),
      ];

      estimate = router.estimateGas.addLiquidity;
      method = router.addLiquidity;
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        pair.address,
        // 40000,                                                                              //ampBps
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        vReserveRatioBounds,
        account,
        deadline.toHexString(),
      ];
      value = null;
    }

    setAttemptingTxn(true);
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          const cA = currencies[Field.CURRENCY_A];
          const cB = currencies[Field.CURRENCY_B];
          if (!!cA && !!cB) {
            setAttemptingTxn(false);
            addTransaction(response, {
              summary:
                'Add ' +
                parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
                ' ' +
                convertToNativeTokenFromETH(cA, chainId).symbol +
                ' and ' +
                parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
                ' ' +
                convertToNativeTokenFromETH(cB, chainId).symbol,
            });

            setTxHash(response.hash);
          }
        })
      )
      .catch((err) => {
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (err?.code !== 4001) {
          console.error(err);
        }

        if (err.message.includes('INSUFFICIENT')) {
          setAddLiquidityError(
            'Insufficient liquidity available. Please reload page and try again!'
          );
        } else {
          setAddLiquidityError(err?.message);
        }
      });
  }, [
    account,
    addTransaction,
    allowedSlippage,
    chainId,
    currencies,
    currencyA,
    currencyB,
    deadline,
    noLiquidity,
    pair,
    parsedAmounts,
    provider,
  ]);

  const pendingText = `Supplying ${parsedAmounts[
    Field.CURRENCY_A
  ]?.toSignificant(6)} ${nativeA?.symbol} and ${parsedAmounts[
    Field.CURRENCY_B
  ]?.toSignificant(6)} ${nativeB?.symbol}`;

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('');
    }
    setTxHash('');
    setAddLiquidityError('');
  }, [onFieldAInput, txHash]);

  const realPercentToken0 = pair
    ? pair.reserve0
        .divide(pair.virtualReserve0)
        .multiply('100')
        .divide(
          pair.reserve0
            .divide(pair.virtualReserve0)
            .add(pair.reserve1.divide(pair.virtualReserve1))
        )
    : new Fraction(JSBI.BigInt(50));

  const realPercentToken1 = new Fraction(
    JSBI.BigInt(100),
    JSBI.BigInt(1)
  ).subtract(realPercentToken0 as Fraction);

  const percentToken0 = realPercentToken0.toSignificant(4);
  const percentToken1 = realPercentToken1.toSignificant(4);

  const tokens = useMemo(
    () =>
      [currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B]].map(
        (currency) => wrappedCurrency(currency, chainId)
      ),
    [chainId, currencies]
  );

  const usdPrices = useTokensPrice(tokens);
  const marketPrices = useTokensMarketPrice(tokens);

  const { widgetId } = useContext(DmmContext);

  const width =
    useSelector((state) => widgetByIdSelector(state)(widgetId).width) || 0;

  const above768 = width > 768;

  const estimatedUsdCurrencyA =
    parsedAmounts[Field.CURRENCY_A] && usdPrices[0]
      ? parseFloat(
          (parsedAmounts[Field.CURRENCY_A] as CurrencyAmount).toSignificant(6)
        ) * usdPrices[0]
      : 0;

  const estimatedUsdCurrencyB =
    parsedAmounts[Field.CURRENCY_B] && usdPrices[1]
      ? parseFloat(
          (parsedAmounts[Field.CURRENCY_B] as CurrencyAmount).toSignificant(6)
        ) * usdPrices[1]
      : 0;

  const poolPrice = Number(price?.toSignificant(6));
  const marketPrice = marketPrices[1] && marketPrices[0] / marketPrices[1];

  const showSanityPriceWarning = !!(
    poolPrice &&
    marketPrice &&
    Math.abs(poolPrice - marketPrice) / marketPrice > 0.05
  );

  const modalHeader = useMemo(() => {
    return (
      <AutoColumn gap="5px">
        <RowFlat style={{ marginTop: '20px' }}>
          <span tw="leading-6 text-xl font-medium mr-2.5">
            {liquidityMinted?.toSignificant(6)}
          </span>
        </RowFlat>
        <Row>
          <span tw="text-xl">
            {'DMM ' + nativeA?.symbol + '/' + nativeB?.symbol + ' LP Tokens'}
          </span>
        </Row>
        <span tw="text-xl">
          {`Output is estimated. If the price changes by more than ${
            allowedSlippage / 100
          }% your transaction will revert.`}
        </span>
      </AutoColumn>
    );
  }, [allowedSlippage, liquidityMinted, nativeA?.symbol, nativeB?.symbol]);

  const modalBottom = useMemo(() => {
    return (
      <ConfirmAddModalBottom
        amplification={ampConvertedInBps}
        currencies={currencies}
        estimatedUsd={[estimatedUsdCurrencyA, estimatedUsdCurrencyB]}
        noLiquidity={false}
        pair={pair}
        parsedAmounts={parsedAmounts}
        poolTokenPercentage={poolTokenPercentage}
        price={price}
        onAdd={onAdd}
      />
    );
  }, [
    ampConvertedInBps,
    currencies,
    estimatedUsdCurrencyA,
    estimatedUsdCurrencyB,
    onAdd,
    pair,
    parsedAmounts,
    poolTokenPercentage,
    price,
  ]);

  return (
    <Wrapper>
      <TransactionConfirmationModal
        noPadding
        attemptingTxn={attemptingTxn}
        content={() =>
          addLiquidityError ? (
            <TransactionErrorContent
              message={addLiquidityError}
              titleColor={theme`colors.green.400`}
              onDismiss={handleDismissConfirmation}
            />
          ) : !linkToUnamplifiedPool ? (
            <ConfirmationModalContent
              bottomContent={modalBottom}
              title={'YOU WILL RECEIVE'}
              titleColor={theme`colors.green.400`}
              topContent={modalHeader}
              onDismiss={handleDismissConfirmation}
            />
          ) : (
            <ConfirmationModalContent
              bottomContent={
                <>
                  Please use the link below if you want to add liquidity to
                  Unamplified Pool
                  <Link
                    id="unamplified-pool-link"
                    to={`/add/${currencyIdA}/${currencyIdB}/${unAmplifiedPairAddress}`}
                    onClick={handleDismissConfirmation}
                  >
                    Go to unamplified pool
                  </Link>
                </>
              }
              title={'Unamplified Pool existed'}
              titleColor={theme`colors.green.400`}
              topContent={() => {
                return null;
              }}
              onDismiss={handleDismissConfirmation}
            />
          )
        }
        hash={txHash}
        isOpen={showConfirm}
        pendingText={pendingText}
        titleColor={theme`colors.green.400`}
        onDismiss={handleDismissConfirmation}
      />

      <AutoColumn gap="20px">
        <GridColumn isMobile={above768}>
          <FirstColumn>
            <div>
              <CurrencyInputPanel
                showCommonBases
                currency={currencies[Field.CURRENCY_A]}
                disableCurrencySelect={true}
                estimatedUsd={
                  formattedNum(estimatedUsdCurrencyA.toString(), true) ||
                  undefined
                }
                id="add-liquidity-input-tokena"
                positionMax="top"
                showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                value={formattedAmounts[Field.CURRENCY_A]}
                onMax={() => {
                  onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '');
                }}
                onUserInput={onFieldAInput}
              />
              <Flex
                alignItems="center"
                justifyContent="space-between"
                marginTop="0.5rem"
              >
                <USDPrice>
                  {usdPrices[0] ? (
                    `1 ${nativeA?.symbol} = ${formattedNum(
                      usdPrices[0].toString(),
                      true
                    )}`
                  ) : (
                    <Loader />
                  )}
                </USDPrice>

                {/* {pairAddress &&
                  chainId &&
                  (currencyAIsWETH || currencyAIsETHER) && (
                    <Link
                      replace
                      to={`/add/${
                        currencyAIsETHER
                          ? currencyId(WETH[chainId], chainId)
                          : currencyId(ETHER, chainId)
                      }/${currencyIdB}/${pairAddress}`}
                    >
                      {currencyAIsETHER
                        ? 'Use Wrapped Token'
                        : 'Use Native Token'}
                    </Link>
                  )} */}
              </Flex>
            </div>
            <ColumnCenter>
              <Plus size="24" />
            </ColumnCenter>
            <div>
              <CurrencyInputPanel
                showCommonBases
                currency={currencies[Field.CURRENCY_B]}
                disableCurrencySelect={true}
                estimatedUsd={
                  formattedNum(estimatedUsdCurrencyB.toString(), true) ||
                  undefined
                }
                id="add-liquidity-input-tokenb"
                positionMax="top"
                showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                value={formattedAmounts[Field.CURRENCY_B]}
                onMax={() => {
                  onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '');
                }}
                onUserInput={onFieldBInput}
              />
              <Flex
                alignItems="center"
                justifyContent="space-between"
                marginTop="0.5rem"
              >
                <USDPrice>
                  {usdPrices[1] ? (
                    `1 ${nativeB?.symbol} = ${formattedNum(
                      usdPrices[1].toString(),
                      true
                    )}`
                  ) : (
                    <Loader />
                  )}
                </USDPrice>

                {/* {pairAddress &&
                  chainId &&
                  (currencyBIsWETH || currencyBIsETHER) && (
                    <Link
                      to={`/add/${currencyIdA}/${
                        currencyBIsETHER
                          ? currencyId(WETH[chainId], chainId)
                          : currencyId(ETHER, chainId)
                      }/${pairAddress}`}
                    >
                      {currencyBIsETHER
                        ? 'Use Wrapped Token'
                        : 'Use Native Token'}
                    </Link>
                  )} */}
              </Flex>
            </div>

            {currencies[independentField] &&
              currencies[dependentField] &&
              pairState !== PairState.INVALID && (
                <Section
                  borderRadius={'20px'}
                  marginTop="8px"
                  padding="0"
                  style={{ marginTop: '8px' }}
                >
                  <PoolPriceBar
                    currencies={currencies}
                    noLiquidity={noLiquidity}
                    pair={pair}
                    poolTokenPercentage={poolTokenPercentage}
                    price={price}
                  />
                </Section>
              )}
          </FirstColumn>

          <SecondColumn>
            {currencies[independentField] &&
              currencies[dependentField] &&
              pairState !== PairState.INVALID && (
                <Section borderRadius={'20px'} marginBottom="28px">
                  <ToggleComponent title={'Pool Information'}>
                    <AutoRow
                      padding="16px 0"
                      style={{
                        gap: '1rem',
                      }}
                    >
                      {!noLiquidity && (
                        <CurrentPriceWrapper>
                          <span tw="text-xl">Current Price</span>
                          <span tw="text-xl">
                            <CurrentPrice price={price} />
                          </span>
                        </CurrentPriceWrapper>
                      )}

                      <PoolRatioWrapper>
                        <span tw="text-xl">Pool Ratio</span>
                        <span tw="text-xl">
                          {percentToken0}% {pair?.token0.symbol} -{' '}
                          {percentToken1}% {pair?.token1.symbol}
                        </span>
                      </PoolRatioWrapper>
                    </AutoRow>

                    <AutoRow
                      padding="16px 0"
                      style={{
                        gap: '1rem',
                      }}
                    >
                      <AutoColumn style={{ flex: '1' }}>
                        <AutoRow>
                          <span tw="text-xl font-medium">AMP</span>
                          <QuestionHelper text={AMP_HINT} />
                        </AutoRow>
                        <span tw="text-xl">
                          {!!pair ? (
                            <>
                              {new Fraction(pair.amp)
                                .divide(JSBI.BigInt(10000))
                                .toSignificant(5)}
                            </>
                          ) : (
                            ''
                          )}
                        </span>
                      </AutoColumn>

                      {(!!pairAddress || +amp >= 1) && (
                        <DynamicFeeRangeWrapper>
                          <AutoRow>
                            <span tw="text-xl font-medium">
                              Dynamic Fee Range
                            </span>
                            <QuestionHelper
                              text={
                                'Fees are adjusted dynamically according to market conditions to maximise returns for liquidity providers.'
                              }
                            />
                          </AutoRow>
                          <span tw="text-xl">
                            {feeRangeCalc(
                              !!pair?.amp
                                ? +new Fraction(pair.amp)
                                    .divide(JSBI.BigInt(10000))
                                    .toSignificant(5)
                                : +amp
                            )}
                          </span>
                        </DynamicFeeRangeWrapper>
                      )}
                    </AutoRow>

                    {currencies[independentField] &&
                      currencies[dependentField] &&
                      (!!pairAddress || +amp >= 1) && (
                        <div style={{ padding: '16px 0 0' }}>
                          <AutoRow marginBottom="8px">
                            <ActiveText>Active Price Range</ActiveText>

                            <QuestionHelper
                              text={
                                'Tradable token pair price range for this pool based on AMP. If the price goes below or above this range, the pool may become inactive.'
                              }
                            />
                          </AutoRow>

                          <PoolPriceRangeBar
                            amplification={ampConvertedInBps}
                            currencies={currencies}
                            pair={pair}
                            price={price}
                          />
                        </div>
                      )}
                  </ToggleComponent>
                </Section>
              )}

            {showSanityPriceWarning && (
              <Warning>
                <AlertTriangle />
                <Text fontSize="0.75rem" marginLeft="0.75rem">
                  The price is deviating quite a lot from that market price,
                  please be careful!
                </Text>
              </Warning>
            )}

            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>
                Connect Wallet
              </ButtonLight>
            ) : (
              <AutoColumn gap={'md'}>
                {(approvalA === ApprovalState.NOT_APPROVED ||
                  approvalA === ApprovalState.PENDING ||
                  approvalB === ApprovalState.NOT_APPROVED ||
                  approvalB === ApprovalState.PENDING) &&
                  isValid && (
                    <RowBetween>
                      {approvalA !== ApprovalState.APPROVED && (
                        <ButtonPrimary
                          disabled={approvalA === ApprovalState.PENDING}
                          width={
                            approvalB !== ApprovalState.APPROVED
                              ? '48%'
                              : '100%'
                          }
                          onClick={approveACallback}
                        >
                          {approvalA === ApprovalState.PENDING ? (
                            <Dots>Approving {nativeA?.symbol}</Dots>
                          ) : (
                            'Approve ' + nativeA?.symbol
                          )}
                        </ButtonPrimary>
                      )}
                      {approvalB !== ApprovalState.APPROVED && (
                        <ButtonPrimary
                          disabled={approvalB === ApprovalState.PENDING}
                          width={
                            approvalA !== ApprovalState.APPROVED
                              ? '48%'
                              : '100%'
                          }
                          onClick={approveBCallback}
                        >
                          {approvalB === ApprovalState.PENDING ? (
                            <Dots>Approving {nativeB?.symbol}</Dots>
                          ) : (
                            'Approve ' + nativeB?.symbol
                          )}
                        </ButtonPrimary>
                      )}
                    </RowBetween>
                  )}

                <ButtonError
                  disabled={
                    !isValid ||
                    approvalA !== ApprovalState.APPROVED ||
                    approvalB !== ApprovalState.APPROVED
                  }
                  error={
                    !isValid &&
                    !!parsedAmounts[Field.CURRENCY_A] &&
                    !!parsedAmounts[Field.CURRENCY_B] &&
                    !!(pairAddress && +amp < 1)
                  }
                  onClick={() => {
                    expertMode ? onAdd() : setShowConfirm(true);
                  }}
                >
                  <span tw="text-xl font-medium">
                    {error ??
                      (!pairAddress && +amp < 1 ? 'Enter amp (>=1)' : 'Supply')}
                  </span>
                </ButtonError>
              </AutoColumn>
            )}
          </SecondColumn>
        </GridColumn>
      </AutoColumn>
    </Wrapper>
  );
};

export default TokenPair;
