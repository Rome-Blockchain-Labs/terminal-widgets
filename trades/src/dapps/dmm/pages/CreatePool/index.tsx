import {
  Currency,
  currencyEquals,
  ETHER,
  Fraction,
  JSBI,
  TokenAmount,
  WETH,
} from '@dynamic-amm/sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3React } from '@romeblockchain/wallet';
import { parseUnits } from 'ethers/lib/utils';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { AlertTriangle, Plus } from 'react-feather';
import { Link } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { Flex, Text } from 'rebass';
import { theme } from 'twin.macro';

import {
  ConfirmationModalContent,
  TransactionConfirmationModal,
} from '../../../../components/modals';
import { DmmContext, DmmPage } from '../../../../widgets/Dmm/DmmContext';
import {
  ButtonError,
  ButtonLight,
  ButtonPrimary,
} from '../../components/Button';
import { BlueCard, LightCard } from '../../components/Card';
import { AutoColumn, ColumnCenter } from '../../components/Column';
import { ConfirmAddModalBottom } from '../../components/ConfirmAddModalBottom';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import Loader from '../../components/Loader';
import { AddRemoveTabs } from '../../components/NavigationTabs';
import {
  PoolPriceBar,
  PoolPriceRangeBarToggle,
} from '../../components/PoolPriceBar';
import QuestionHelper from '../../components/QuestionHelper';
import Row, { AutoRow, RowBetween, RowFlat } from '../../components/Row';
import { CREATE_POOL_AMP_HINT, ROUTER_ADDRESSES } from '../../constants';
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
import { useDerivedPairInfo } from '../../state/pair/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import {
  useIsExpertMode,
  useUserSlippageTolerance,
} from '../../state/user/hooks';
import { StyledInternalLink } from '../../theme';
import {
  calculateGasMargin,
  calculateSlippageAmount,
  formattedNum,
  getRouterContract,
} from '../../utils';
import { currencyId } from '../../utils/currencyId';
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
  AMPColumn,
  Container,
  GridColumn,
  NumericalInput2,
  PageWrapper,
  Section,
  TokenColumn,
  USDPrice,
  Warning,
} from './styled';

export default function CreatePool() {
  const { account, chainId, provider } = useWeb3React();

  const {
    currencyIdA,
    currencyIdB,
    setCurrencyIdA,
    setCurrencyIdB,
    setPage,
    setPairAddress,
  } = useContext(DmmContext);

  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);

  const { pairs } = useDerivedPairInfo(
    currencyA ?? undefined,
    currencyB ?? undefined
  );

  const currencyBIsETHER = !!(
    chainId &&
    currencyB &&
    currencyEquals(currencyB, ETHER)
  );
  const currencyBIsWETH = !!(
    chainId &&
    currencyB &&
    currencyEquals(currencyB, WETH[chainId as keyof typeof WETH])
  );

  const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected

  const expertMode = useIsExpertMode();

  // mint state
  const { independentField, otherTypedValue, typedValue } = useMintState();
  const {
    currencies,
    currencyBalances,
    dependentField,
    error,
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
    undefined
  );

  const nativeA = useCurrencyConvertedToNative(currencies[Field.CURRENCY_A]);
  const nativeB = useCurrencyConvertedToNative(currencies[Field.CURRENCY_B]);

  const [amp, setAmp] = useState('');
  const onAmpChange = (e: any) => {
    if (e.toString().length < 20) setAmp(e);
  };

  const poolsList = useMemo(
    () => pairs.map(([, pair]) => pair).filter((pair) => pair !== null),
    [pairs]
  );
  const isPoolExisted = poolsList.length > 0;

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

  const isValid = !(error || (+amp < 1 ? 'Enter amp (>=1)' : ''));

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

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A as keyof typeof parsedAmounts],
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

  const addTransactionWithType = useTransactionAdder();
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

    if (!ampConvertedInBps) return;
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER;
      estimate = router.estimateGas.addLiquidityNewPoolETH;
      method = router.addLiquidityNewPoolETH;
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)
          ?.address ?? '', // token
        ampConvertedInBps.toSignificant(5), //ampBps
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[
          tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
        ].toString(), // token min
        amountsMin[
          tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
        ].toString(), // eth min
        account,
        deadline.toHexString(),
      ];
      value = BigNumber.from(
        (tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString()
      );
    } else {
      estimate = router.estimateGas.addLiquidityNewPool;
      method = router.addLiquidityNewPool;
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        ampConvertedInBps.toSignificant(5), //ampBps
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
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
            addTransactionWithType(response, {
              summary:
                parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
                ' ' +
                convertToNativeTokenFromETH(cA, chainId).symbol +
                ' and ' +
                parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
                ' ' +
                convertToNativeTokenFromETH(cB, chainId).symbol,
              // type: 'Create pool',
            });

            setTxHash(response.hash);
          }
        })
      )
      .catch((error) => {
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error);
        }
      });
  }, [
    account,
    addTransactionWithType,
    allowedSlippage,
    ampConvertedInBps,
    chainId,
    currencies,
    currencyA,
    currencyB,
    deadline,
    noLiquidity,
    parsedAmounts,
    provider,
  ]);

  const modalHeader = useMemo(() => {
    return (
      <AutoColumn gap="5px">
        <RowFlat>
          <span tw="text-2xl font-bold mt-4">
            {nativeA?.symbol + '/' + nativeB?.symbol}
          </span>
        </RowFlat>
      </AutoColumn>
    );
  }, [nativeA?.symbol, nativeB?.symbol]);

  const modalBottom = useMemo(() => {
    return (
      <ConfirmAddModalBottom
        amplification={ampConvertedInBps}
        currencies={currencies}
        noLiquidity={true}
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
    onAdd,
    pair,
    parsedAmounts,
    poolTokenPercentage,
    price,
  ]);

  const pendingText = `Supplying ${parsedAmounts[
    Field.CURRENCY_A
  ]?.toSignificant(6)} ${nativeA?.symbol} and ${parsedAmounts[
    Field.CURRENCY_B
  ]?.toSignificant(6)} ${nativeB?.symbol}`;

  const handleCurrencyASelect = useCallback(
    (selectedCurrencyA: Currency) => {
      const newCurrencyIdA = currencyId(selectedCurrencyA, chainId);
      setCurrencyIdA(newCurrencyIdA);
    },
    [chainId, setCurrencyIdA]
  );
  const handleCurrencyBSelect = useCallback(
    (selectedCurrencyB: Currency) => {
      const newCurrencyIdB = currencyId(selectedCurrencyB, chainId);
      setCurrencyIdB(newCurrencyIdB);
    },
    [chainId, setCurrencyIdB]
  );

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    setAmp('');
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('');
    }
    setTxHash('');
  }, [onFieldAInput, txHash]);

  // const realPercentToken0 = pair
  //   ? pair.reserve0
  //       .divide(pair.virtualReserve0)
  //       .multiply('100')
  //       .divide(pair.reserve0.divide(pair.virtualReserve0).add(pair.reserve1.divide(pair.virtualReserve1)))
  //   : new Fraction(JSBI.BigInt(50))

  // const realPercentToken1 = new Fraction(JSBI.BigInt(100), JSBI.BigInt(1)).subtract(realPercentToken0 as Fraction)

  // const percentToken0 = realPercentToken0.toSignificant(4)
  // const percentToken1 = realPercentToken1.toSignificant(4)

  const tokens = useMemo(
    () =>
      [currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B]].map(
        (currency) => wrappedCurrency(currency, chainId)
      ),
    [chainId, currencies]
  );

  const usdPrices = useTokensPrice(tokens);
  const marketPrices = useTokensMarketPrice(tokens);

  const poolRatio = Number(price?.toSignificant(6));
  const marketRatio = marketPrices[1] && marketPrices[0] / marketPrices[1];

  const showSanityPriceWarning = !!(
    poolRatio &&
    marketRatio &&
    Math.abs(poolRatio - marketRatio) / marketRatio > 0.05
  );

  const confirmationContent = useCallback(
    () =>
      !linkToUnamplifiedPool ? (
        <ConfirmationModalContent
          bottomContent={modalBottom}
          title={'YOU ARE CREATING A POOL'}
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
              <div
                id="unamplified-pool-link"
                // to={`/add/${currencyIdA}/${currencyIdB}/${unAmplifiedPairAddress}`}
                tw="text-green-400 hover:text-green-600 cursor-pointer text-center"
                onClick={() => {
                  setPage(DmmPage.ADDLIQUIDITY);
                  setPairAddress(unAmplifiedPairAddress);
                }}
              >
                Go to Unamplified Pool
              </div>
            </>
          }
          title={'UNAMPLIFIED POOL EXISTED'}
          titleColor={theme`colors.green.400`}
          topContent={() => {
            return null;
          }}
          onDismiss={handleDismissConfirmation}
        />
      ),
    [
      linkToUnamplifiedPool,
      modalBottom,
      modalHeader,
      handleDismissConfirmation,
      setPage,
      setPairAddress,
      unAmplifiedPairAddress,
    ]
  );

  const width = useWindowSize().width || 0;

  const above768 = width > 768;

  return (
    <PageWrapper>
      <Container>
        <AddRemoveTabs adding={true} creating={true} />
        <Wrapper>
          <TransactionConfirmationModal
            noPadding
            attemptingTxn={attemptingTxn}
            content={confirmationContent}
            hash={txHash}
            isOpen={showConfirm}
            pendingText={pendingText}
            titleColor={theme`colors.green.400`}
            onDismiss={handleDismissConfirmation}
          />
          <AutoColumn gap="20px">
            <ColumnCenter>
              <BlueCard>
                <AutoColumn gap="10px">
                  {isPoolExisted && (
                    <span tw="text-xl text-gray-200 leading-5">
                      Note: There are existing pools for this token pair. Please
                      check{' '}
                      <Link to={`/pools/${currencyIdA}/${currencyIdB}`}>
                        here
                      </Link>
                    </span>
                  )}
                  <span tw="text-xl text-gray-200 leading-5">
                    You are creating a new pool and will be the first liquidity
                    provider. The ratio of tokens you supply below will set the
                    initial price of this pool. Once you are satisfied with the
                    rate, proceed to supply liquidity.
                  </span>
                </AutoColumn>
              </BlueCard>
            </ColumnCenter>

            <GridColumn isMobile={above768}>
              <TokenColumn gap="20px" isMobile={above768}>
                <ActiveText>Token</ActiveText>

                <div>
                  <CurrencyInputPanel
                    showCommonBases
                    currency={currencies[Field.CURRENCY_A]}
                    disableCurrencySelect={false}
                    id="create-pool-input-tokena"
                    positionMax="top"
                    showMaxButton={true}
                    value={formattedAmounts[Field.CURRENCY_A]}
                    onCurrencySelect={handleCurrencyASelect}
                    onMax={() => {
                      onFieldAInput(
                        maxAmounts[Field.CURRENCY_A]?.toExact() ?? ''
                      );
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

                    {/* {chainId && (currencyAIsWETH || currencyAIsETHER) && (
                      <StyledInternalLink
                        replace
                        to={`/create/${
                          currencyAIsETHER
                            ? currencyId(WETH[chainId], chainId)
                            : currencyId(ETHER, chainId)
                        }/${currencyIdB}`}
                      >
                        {currencyAIsETHER
                          ? 'Use Wrapped Token'
                          : 'Use Native Token'}
                      </StyledInternalLink>
                    )} */}
                  </Flex>
                </div>
                <ColumnCenter>
                  <Plus size="16" />
                </ColumnCenter>
                <div>
                  <CurrencyInputPanel
                    showCommonBases
                    currency={currencies[Field.CURRENCY_B]}
                    disableCurrencySelect={false}
                    id="create-pool-input-tokenb"
                    positionMax="top"
                    showMaxButton={true}
                    value={formattedAmounts[Field.CURRENCY_B]}
                    onCurrencySelect={handleCurrencyBSelect}
                    onMax={() => {
                      onFieldBInput(
                        maxAmounts[Field.CURRENCY_B]?.toExact() ?? ''
                      );
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

                    {chainId && (currencyBIsWETH || currencyBIsETHER) && (
                      <StyledInternalLink
                        replace
                        to={`/create/${currencyIdA}/${
                          currencyBIsETHER
                            ? currencyId(
                                WETH[chainId as keyof typeof WETH],
                                chainId
                              )
                            : currencyId(ETHER, chainId)
                        }`}
                      >
                        {currencyBIsETHER
                          ? 'Use Wrapped Token'
                          : 'Use Native Token'}
                      </StyledInternalLink>
                    )}
                  </Flex>
                </div>

                {currencies[Field.CURRENCY_A] &&
                  currencies[Field.CURRENCY_B] &&
                  pairState !== PairState.INVALID && (
                    <Section
                      borderRadius={'20px'}
                      padding="0px"
                      tw="border border-gray-400"
                    >
                      <Row padding="0 0 1rem 0">
                        <span tw="text-xl font-medium">
                          Prices and Pool share
                        </span>
                      </Row>

                      <PoolPriceBar
                        currencies={currencies}
                        noLiquidity={noLiquidity}
                        pair={pair}
                        poolTokenPercentage={poolTokenPercentage}
                        price={price}
                      />
                    </Section>
                  )}
              </TokenColumn>

              <AMPColumn
                gap="20px"
                isMobile={above768}
                style={{ height: 'fit-content' }}
              >
                <AutoRow>
                  <ActiveText>
                    AMP
                    {!!pair ? (
                      <>
                        &nbsp;=&nbsp;
                        {new Fraction(pair.amp)
                          .divide(JSBI.BigInt(10000))
                          .toSignificant(5)}
                      </>
                    ) : (
                      ''
                    )}
                  </ActiveText>
                  <QuestionHelper text={CREATE_POOL_AMP_HINT} />
                </AutoRow>

                <LightCard
                  borderRadius={'10px'}
                  padding="0 0.75rem"
                  tw="bg-dark-600"
                >
                  <NumericalInput2
                    className="token-amount-input"
                    value={amp}
                    onUserInput={onAmpChange}
                  />
                </LightCard>

                {currencies[Field.CURRENCY_A] &&
                  currencies[Field.CURRENCY_B] &&
                  pairState !== PairState.INVALID && (
                    <PoolPriceRangeBarToggle
                      amplification={ampConvertedInBps}
                      currencies={currencies}
                      pair={pair}
                      price={price}
                    />
                  )}

                <Section>
                  <AutoRow>
                    <span tw="text-xl font-medium">
                      Dynamic Fee Range:{' '}
                      {currencies[Field.CURRENCY_A] &&
                      currencies[Field.CURRENCY_B] &&
                      pairState !== PairState.INVALID &&
                      +amp >= 1
                        ? feeRangeCalc(
                            !!pair?.amp
                              ? +new Fraction(pair.amp)
                                  .divide(JSBI.BigInt(10000))
                                  .toSignificant(5)
                              : +amp
                          )
                        : '-'}
                    </span>
                    <QuestionHelper
                      text={
                        'Fees are adjusted dynamically according to market conditions to maximise returns for liquidity providers.'
                      }
                    />
                  </AutoRow>
                </Section>

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
                                <Dots>
                                  Approving{' '}
                                  {currencies[Field.CURRENCY_A]?.symbol}
                                </Dots>
                              ) : (
                                'Approve ' +
                                currencies[Field.CURRENCY_A]?.symbol
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
                                <Dots>
                                  Approving{' '}
                                  {currencies[Field.CURRENCY_B]?.symbol}
                                </Dots>
                              ) : (
                                'Approve ' +
                                currencies[Field.CURRENCY_B]?.symbol
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
                        !!(+amp < 1)
                      }
                      onClick={() => {
                        expertMode ? onAdd() : setShowConfirm(true);
                      }}
                    >
                      <span tw="text-xl font-medium">
                        {error ?? (+amp < 1 ? 'Enter amp (>=1)' : 'Create')}
                      </span>
                    </ButtonError>
                  </AutoColumn>
                )}
              </AMPColumn>
            </GridColumn>
          </AutoColumn>
        </Wrapper>
      </Container>
    </PageWrapper>
  );
}
