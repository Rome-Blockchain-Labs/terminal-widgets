import {
  computePriceImpact,
  CurrencyAmount,
  ETHER,
  Fraction,
  JSBI,
  TokenAmount,
} from '@dynamic-amm/sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { parseUnits } from 'ethers/lib/utils';
import React, { useCallback, useMemo, useState } from 'react';
import { AlertTriangle } from 'react-feather';
import { Link } from 'react-router-dom';
import { Flex, Text } from 'rebass';
import { theme } from 'twin.macro';

import {
  ConfirmationModalContent,
  TransactionConfirmationModal,
  TransactionErrorContent,
} from '../../../../components/modals';
import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import {
  ButtonError,
  ButtonLight,
  ButtonPrimary,
} from '../../components/Button';
import { AutoColumn } from '../../components/Column';
import { ConfirmAddModalBottom } from '../../components/ConfirmAddModalBottom';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import CurrencyLogo from '../../components/CurrencyLogo';
import CurrentPrice from '../../components/CurrentPrice';
import Loader from '../../components/Loader';
import {
  PoolPriceBar,
  PoolPriceRangeBar,
  ToggleComponent,
} from '../../components/PoolPriceBar';
import QuestionHelper from '../../components/QuestionHelper';
import Row, { AutoRow, RowBetween, RowFlat } from '../../components/Row';
import FormattedPriceImpact from '../../components/swap/FormattedPriceImpact';
import ZapError from '../../components/ZapError';
import { AMP_HINT, ZAP_ADDRESSES } from '../../constants/index';
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
  useDerivedZapInInfo,
  useMintState,
  useZapInActionHandlers,
} from '../../state/mint/hooks';
import { tryParseAmount } from '../../state/swap/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import {
  useIsExpertMode,
  useUserSlippageTolerance,
} from '../../state/user/hooks';
import { calculateGasMargin, formattedNum, getZapContract } from '../../utils';
import { feeRangeCalc, useCurrencyConvertedToNative } from '../../utils/dmm';
import isZero from '../../utils/isZero';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import {
  computePriceImpactWithoutFee,
  warningSeverity,
} from '../../utils/prices';
import { wrappedCurrency } from '../../utils/wrappedCurrency';
import { Dots, Wrapper } from '../Pool/styleds';
import {
  ActiveText,
  CurrentPriceWrapper,
  DetailBox,
  DynamicFeeRangeWrapper,
  FirstColumn,
  GridColumn,
  PoolRatioWrapper,
  SecondColumn,
  Section,
  TokenWrapper,
  USDPrice,
  Warning,
} from './styled';

const ZapIn = ({
  currencyIdA,
  currencyIdB,
  pairAddress,
}: {
  currencyIdA: string;
  currencyIdB: string;
  pairAddress: string;
}) => {
  const { account, chainId, provider } = useWallets();

  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);

  const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected
  const [zapInError, setZapInError] = useState<string>('');

  const expertMode = useIsExpertMode();

  // mint state
  const { independentField, otherTypedValue, typedValue } = useMintState();
  const {
    currencies,
    currencyBalances,
    dependentField,
    error,
    insufficientLiquidity,
    liquidityMinted,
    noLiquidity,
    pair,
    pairState,
    parsedAmounts,
    poolTokenPercentage,
    price,
    unAmplifiedPairAddress,
  } = useDerivedZapInInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
    pairAddress
  );

  const nativeA = useCurrencyConvertedToNative(currencies[Field.CURRENCY_A]);
  const nativeB = useCurrencyConvertedToNative(currencies[Field.CURRENCY_B]);

  const independentToken =
    nativeA && nativeB
      ? independentField === Field.CURRENCY_A
        ? nativeA
        : nativeB
      : undefined;
  const dependentToken =
    nativeA && nativeB
      ? independentField === Field.CURRENCY_A
        ? nativeB
        : nativeA
      : undefined;

  const amp = pair?.amp || JSBI.BigInt(0);

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
  const { onFieldInput, onSwitchField } = useZapInActionHandlers();

  const isValid = !error && !insufficientLiquidity;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm
  // txn values
  const deadline = useTransactionDeadline(); // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance(); // custom from users
  const [txHash, setTxHash] = useState<string>('');

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
  const amountToApprove = tryParseAmount(
    typedValue,
    currencies[independentField]
  );

  const [approval, approveCallback] = useApproveCallback(
    amountToApprove,
    !!chainId ? ZAP_ADDRESSES[chainId as keyof typeof ZAP_ADDRESSES] : undefined
  );

  const userInCurrencyAmount: CurrencyAmount | undefined = useMemo(() => {
    return tryParseAmount(typedValue, currencies[independentField], true);
  }, [currencies, independentField, typedValue]);

  const userIn = useMemo(() => {
    return userInCurrencyAmount
      ? BigNumber.from(userInCurrencyAmount.raw.toString())
      : undefined;
  }, [userInCurrencyAmount]);

  const minLPQty = !liquidityMinted
    ? JSBI.BigInt(0)
    : JSBI.divide(
        JSBI.multiply(
          liquidityMinted?.raw,
          JSBI.BigInt(10000 - allowedSlippage)
        ),
        JSBI.BigInt(10000)
      );

  const addTransaction = useTransactionAdder();
  async function onZapIn() {
    if (!chainId || !provider || !account) return;
    const zapContract = getZapContract(chainId, provider, account);

    if (!chainId || !account) {
      return;
    }

    const tokenIn = wrappedCurrency(currencies[independentField], chainId);
    const tokenOut = wrappedCurrency(currencies[dependentField], chainId);

    if (
      !pair ||
      !pair.address ||
      !deadline ||
      !tokenIn ||
      !tokenOut ||
      !userIn
    ) {
      return;
    }

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

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null;

    if (!pair) return;

    if (currencies[independentField] === ETHER) {
      estimate = zapContract.estimateGas.zapInEth;
      method = zapContract.zapInEth;
      args = [
        tokenOut.address,
        pair.address,
        account,
        minLPQty.toString(),
        deadline.toHexString(),
      ];
      value = userIn;
    } else {
      estimate = zapContract.estimateGas.zapIn;
      method = zapContract.zapIn;
      args = [
        tokenIn.address,
        tokenOut.address,
        userIn.toString(),
        pair.address,
        account,
        minLPQty.toString(),
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
        }).then((tx) => {
          const cA = currencies[Field.CURRENCY_A];
          const cB = currencies[Field.CURRENCY_B];
          if (!!cA && !!cB) {
            setAttemptingTxn(false);
            addTransaction(tx, {
              summary: `Add liquidity for single token ${
                independentToken?.symbol
              } with amount of ${userInCurrencyAmount?.toSignificant(4)}`,
            });

            setTxHash(tx.hash);
          }
        })
      )
      .catch((err) => {
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (err?.code !== 4001) {
          console.error(err);
        }

        if (err.message.includes('INSUFFICIENT_MINT_QTY')) {
          setZapInError(
            'Insufficient liquidity available. Please reload page and try again!'
          );
        } else {
          setZapInError(err?.message);
        }
      });
  }

  const pendingText = `Supplying ${userInCurrencyAmount?.toSignificant(6)} ${
    independentToken?.symbol
  }`;

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldInput('');
    }
    setZapInError('');
    setTxHash('');
  }, [onFieldInput, txHash]);

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
      [currencies[independentField], currencies[dependentField]].map(
        (currency) => wrappedCurrency(currency, chainId)
      ),
    [chainId, currencies, dependentField, independentField]
  );

  const usdPrices = useTokensPrice(tokens);
  const marketPrices = useTokensMarketPrice(tokens);

  const poolPrice =
    independentField === Field.CURRENCY_A
      ? Number(price?.toSignificant(6))
      : Number(price?.invert().toSignificant(6));
  const marketPrice = marketPrices[1] && marketPrices[0] / marketPrices[1];

  const showSanityPriceWarning = !!(
    poolPrice &&
    marketPrice &&
    Math.abs(poolPrice - marketPrice) / marketPrice > 0.05
  );

  const handleSwitchCurrency = useCallback(() => {
    onSwitchField();
  }, [onSwitchField]);

  const estimatedUsd =
    userInCurrencyAmount && usdPrices[0]
      ? parseFloat(userInCurrencyAmount.toSignificant(6)) * usdPrices[0]
      : 0;

  const tokenAPoolAllocUsd =
    usdPrices[0] &&
    parsedAmounts &&
    parsedAmounts[independentField] &&
    usdPrices[0] *
      parseFloat(
        (parsedAmounts[independentField] as CurrencyAmount).toSignificant(6)
      );

  const tokenBPoolAllocUsd =
    usdPrices[1] &&
    parsedAmounts &&
    parsedAmounts[dependentField] &&
    usdPrices[1] *
      parseFloat(
        (parsedAmounts[dependentField] as CurrencyAmount).toSignificant(6)
      );

  const estimatedUsdForPair: [number, number] =
    independentField === Field.CURRENCY_A
      ? [tokenAPoolAllocUsd || 0, tokenBPoolAllocUsd || 0]
      : [tokenBPoolAllocUsd || 0, tokenAPoolAllocUsd || 0];

  const priceImpact =
    price &&
    userInCurrencyAmount &&
    parsedAmounts[independentField] &&
    parsedAmounts[dependentField] &&
    !userInCurrencyAmount.lessThan(
      parsedAmounts[independentField] as CurrencyAmount
    )
      ? computePriceImpact(
          independentField === Field.CURRENCY_A ? price : price.invert(),
          userInCurrencyAmount?.subtract(
            parsedAmounts[independentField] as CurrencyAmount
          ),
          parsedAmounts[dependentField] as CurrencyAmount
        )
      : undefined;

  const priceImpactWithoutFee =
    pair && priceImpact
      ? computePriceImpactWithoutFee([pair], priceImpact)
      : undefined;

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  const modalHeader = () => {
    return (
      <AutoColumn gap="5px">
        <RowFlat style={{ marginTop: '20px' }}>
          <Text
            fontSize="12px"
            fontWeight={500}
            lineHeight="42px"
            marginRight={10}
          >
            {liquidityMinted?.toSignificant(6)}
          </Text>
        </RowFlat>
        <Row>
          <Text fontSize="12px">
            {'DMM ' + nativeA?.symbol + '/' + nativeB?.symbol + ' LP Tokens'}
          </Text>
        </Row>
        <span tw="text-xl">
          {`Output is estimated. If the price changes by more than ${
            allowedSlippage / 100
          }% your transaction will revert.`}
        </span>
      </AutoColumn>
    );
  };

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        amplification={ampConvertedInBps}
        currencies={currencies}
        estimatedUsd={estimatedUsdForPair}
        noLiquidity={false}
        pair={pair}
        parsedAmounts={parsedAmounts}
        poolTokenPercentage={poolTokenPercentage}
        price={price}
        priceImpact={priceImpactWithoutFee}
        onAdd={onZapIn}
      />
    );
  };

  return (
    <Wrapper>
      <TransactionConfirmationModal
        noPadding
        attemptingTxn={attemptingTxn}
        content={() =>
          zapInError ? (
            <TransactionErrorContent
              message={zapInError}
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
              bottomContent={() => {
                return (
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
                );
              }}
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
        <GridColumn>
          <FirstColumn>
            <div>
              <CurrencyInputPanel
                isSwitchMode
                showCommonBases
                currency={currencies[independentField]}
                disableCurrencySelect={false}
                estimatedUsd={
                  formattedNum(estimatedUsd.toString(), true) || undefined
                }
                id="zap-in-input"
                positionMax="top"
                showMaxButton={!atMaxAmounts[independentField]}
                value={formattedAmounts[independentField]}
                onMax={() => {
                  onFieldInput(maxAmounts[independentField]?.toExact() ?? '');
                }}
                onSwitchCurrency={handleSwitchCurrency}
                onUserInput={onFieldInput}
              />
              <Flex
                alignItems="center"
                justifyContent="space-between"
                marginTop="0.5rem"
              >
                <USDPrice>
                  {usdPrices[0] ? (
                    `1 ${independentToken?.symbol} = ${formattedNum(
                      usdPrices[0].toString(),
                      true
                    )}`
                  ) : (
                    <Loader />
                  )}
                </USDPrice>

                {/* {pairAddress &&
                  chainId &&
                  (selectedCurrencyIsETHER || selectedCurrencyIsWETH) &&
                  currencies[dependentField] && (
                    <Link
                      to={
                        independentField === Field.CURRENCY_A
                          ? `/add/${
                              selectedCurrencyIsETHER
                                ? currencyId(WETH[chainId], chainId)
                                : currencyId(ETHER, chainId)
                            }/${currencyId(
                              currencies[dependentField] as Currency,
                              chainId
                            )}/${pairAddress}`
                          : `/add/${currencyId(
                              currencies[dependentField] as Currency,
                              chainId
                            )}/${
                              selectedCurrencyIsETHER
                                ? currencyId(WETH[chainId], chainId)
                                : currencyId(ETHER, chainId)
                            }/${pairAddress}`
                      }
                    >
                      {selectedCurrencyIsETHER
                        ? 'Use Wrapped Token'
                        : 'Use Native Token'}
                    </Link>
                  )} */}
              </Flex>
            </div>

            <Section borderRadius={'20px'} marginTop="8px" padding="0">
              <Row padding="0 0 1rem 0">
                <span tw="text-xl font-medium">Your Pool Allocation</span>
              </Row>

              <DetailBox
                style={{
                  padding: '16px 0',
                }}
              >
                <AutoColumn gap="4px" justify="space-between">
                  <TokenWrapper>
                    <CurrencyLogo
                      currency={currencies[independentField] || undefined}
                      size={'16px'}
                    />
                    <span tw="text-xl">{independentToken?.symbol}</span>
                  </TokenWrapper>
                  <span tw="text-xl">
                    {parsedAmounts[independentField]?.toSignificant(6)} (~
                    {formattedNum((tokenAPoolAllocUsd || 0).toString(), true)})
                  </span>
                </AutoColumn>

                <AutoColumn gap="4px" justify="space-between">
                  <TokenWrapper>
                    <CurrencyLogo
                      currency={currencies[dependentField] || undefined}
                      size={'16px'}
                    />
                    <span tw="text-xl">{dependentToken?.symbol}</span>
                  </TokenWrapper>
                  <span tw="text-xl">
                    {parsedAmounts[dependentField]?.toSignificant(6)} (~
                    {formattedNum((tokenBPoolAllocUsd || 0).toString(), true)})
                  </span>
                </AutoColumn>
              </DetailBox>

              <DetailBox style={{ paddingTop: '16px' }}>
                <span tw="text-xl">Price Impact</span>
                <span tw="text-xl">
                  <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
                </span>
              </DetailBox>

              {/* <AutoRow justify="space-between" gap="4px" style={{ paddingBottom: '12px' }}>
                <TYPE.subHeader fontWeight={400} fontSize={14} color={theme.subText}>
                  Est. received:
                </TYPE.subHeader>
                <TYPE.black fontWeight={400} fontSize={14}>
                  {liquidityMinted?.toSignificant(6)} LP (~
                  {tokenAPoolAllocUsd &&
                    tokenBPoolAllocUsd &&
                    formattedNum((tokenAPoolAllocUsd + tokenBPoolAllocUsd).toString(), true)}
                  )
                </TYPE.black>
              </AutoRow> */}
            </Section>

            {currencies[independentField] &&
              currencies[dependentField] &&
              pairState !== PairState.INVALID && (
                <Section
                  borderRadius={'20px'}
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
                          <span tw="text-xl font-medium">Current Price</span>
                          <span tw="text-xl">
                            <CurrentPrice price={price} />
                          </span>
                        </CurrentPriceWrapper>
                      )}

                      <PoolRatioWrapper>
                        <span tw="text-xl font-medium">Pool Ratio</span>
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
                          <Text fontSize={12} fontWeight={500}>
                            AMP
                          </Text>
                          <QuestionHelper text={AMP_HINT} />
                        </AutoRow>
                        <Text fontSize={12} fontWeight={400}>
                          {!!pair ? (
                            <>
                              {new Fraction(pair.amp)
                                .divide(JSBI.BigInt(10000))
                                .toSignificant(5)}
                            </>
                          ) : (
                            ''
                          )}
                        </Text>
                      </AutoColumn>

                      {(!!pairAddress || +amp >= 1) && (
                        <DynamicFeeRangeWrapper>
                          <AutoRow>
                            <Text fontSize={12} fontWeight={500}>
                              Dynamic Fee Range
                            </Text>
                            <QuestionHelper
                              text={
                                'Fees are adjusted dynamically according to market conditions to maximise returns for liquidity providers.'
                              }
                            />
                          </AutoRow>
                          <Text fontSize={14} fontWeight={400}>
                            {feeRangeCalc(
                              !!pair?.amp
                                ? +new Fraction(pair.amp)
                                    .divide(JSBI.BigInt(10000))
                                    .toSignificant(5)
                                : +amp
                            )}
                          </Text>
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

            {insufficientLiquidity ? (
              <ZapError
                message={'Insufficient Liquidity in the Liquidity Pool to Swap'}
                warning={false}
              />
            ) : priceImpactSeverity > 3 ? (
              <ZapError message={'Price impact is too high'} warning={false} />
            ) : priceImpactSeverity > 2 ? (
              <ZapError message={'Price impact is high'} warning={true} />
            ) : null}

            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>
                Connect Wallet
              </ButtonLight>
            ) : (
              <AutoColumn gap={'md'}>
                {(approval === ApprovalState.NOT_APPROVED ||
                  approval === ApprovalState.PENDING) &&
                  isValid &&
                  (expertMode || priceImpactSeverity <= 3) && (
                    <RowBetween>
                      <ButtonPrimary
                        disabled={
                          !isValid ||
                          approval === ApprovalState.PENDING ||
                          (priceImpactSeverity > 3 && !expertMode)
                        }
                        width={'100%'}
                        onClick={approveCallback}
                      >
                        {approval === ApprovalState.PENDING ? (
                          <Dots>Approving {independentToken?.symbol}</Dots>
                        ) : (
                          'Approve ' + independentToken?.symbol
                        )}
                      </ButtonPrimary>
                    </RowBetween>
                  )}

                <ButtonError
                  disabled={
                    !isValid ||
                    approval !== ApprovalState.APPROVED ||
                    (priceImpactSeverity > 3 && !expertMode)
                  }
                  error={
                    !!parsedAmounts[independentField] &&
                    !!parsedAmounts[dependentField] &&
                    !!pairAddress &&
                    (!isValid || priceImpactSeverity > 2)
                  }
                  onClick={() => {
                    expertMode ? onZapIn() : setShowConfirm(true);
                  }}
                >
                  <span tw="text-xl font-medium">
                    {error ??
                      (!pairAddress && +amp < 1
                        ? 'Enter amp (>=1)'
                        : priceImpactSeverity > 3 && !expertMode
                        ? 'Supply'
                        : priceImpactSeverity > 2
                        ? 'Supply Anyway'
                        : 'Supply')}
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

export default ZapIn;
