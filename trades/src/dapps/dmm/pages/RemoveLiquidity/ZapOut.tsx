import {
  computePriceImpact,
  Currency,
  CurrencyAmount,
  currencyEquals,
  ETHER,
  Percent,
  Token,
  TokenAmount,
} from '@dynamic-amm/sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { splitSignature } from '@ethersproject/bytes';
import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3React } from '@romeblockchain/wallet';
import { Contract } from 'ethers';
import React, { useCallback, useMemo, useState } from 'react';
import { Text } from 'rebass';
import { theme } from 'twin.macro';

import {
  ConfirmationModalContent,
  TransactionConfirmationModal,
  TransactionErrorContent,
} from '../../../../components/modals';
import {
  ButtonConfirmed,
  ButtonError,
  ButtonLight,
  ButtonPrimary,
} from '../../components/Button';
import { BlackCard } from '../../components/Card';
import { AutoColumn } from '../../components/Column';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import CurrencyLogo from '../../components/CurrencyLogo';
import CurrentPrice from '../../components/CurrentPrice';
import DoubleCurrencyLogo from '../../components/DoubleLogo';
import Loader from '../../components/Loader';
import Row, { AutoRow, RowBetween, RowFixed } from '../../components/Row';
import Slider from '../../components/Slider';
import FormattedPriceImpact from '../../components/swap/FormattedPriceImpact';
import { Dots } from '../../components/swap/styleds';
import ZapError from '../../components/ZapError';
import { ZAP_ADDRESSES } from '../../constants/index';
import { useCurrency } from '../../hooks/Tokens';
import {
  ApprovalState,
  useApproveCallback,
} from '../../hooks/useApproveCallback';
import { usePairContract } from '../../hooks/useContract';
import useIsArgentWallet from '../../hooks/useIsArgentWallet';
import useTransactionDeadline from '../../hooks/useTransactionDeadline';
import {
  useTokensPrice,
  useWalletModalToggle,
} from '../../state/application/hooks';
import { Field } from '../../state/burn/actions';
import { useZapOutActionHandlers } from '../../state/burn/hooks';
import { useBurnState, useDerivedZapOutInfo } from '../../state/burn/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import {
  useIsExpertMode,
  useUserSlippageTolerance,
} from '../../state/user/hooks';
import { TYPE, UppercaseText } from '../../theme';
import { calculateGasMargin, formattedNum, getZapContract } from '../../utils';
import { useCurrencyConvertedToNative } from '../../utils/dmm';
import { formatJSBIValue } from '../../utils/formatBalance';
import {
  computePriceImpactWithoutFee,
  warningSeverity,
} from '../../utils/prices';
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler';
import { wrappedCurrency } from '../../utils/wrappedCurrency';
import { Wrapper } from '../Pool/styleds';
import {
  CurrentPriceWrapper,
  DetailBox,
  DetailWrapper,
  FirstColumn,
  GridColumn,
  MaxButton,
  ModalDetailWrapper,
  SecondColumn,
  TokenWrapper,
} from './styled';

export default function ZapOut({
  currencyIdA,
  currencyIdB,
  pairAddress,
}: {
  currencyIdA: string;
  currencyIdB: string;
  pairAddress: string;
}) {
  const [currencyA, currencyB] = [
    useCurrency(currencyIdA) ?? undefined,
    useCurrency(currencyIdB) ?? undefined,
  ];
  const { account, chainId, provider } = useWeb3React();

  const nativeA = useCurrencyConvertedToNative(currencyA as Currency);
  const nativeB = useCurrencyConvertedToNative(currencyB as Currency);
  const [tokenA, tokenB] = useMemo(
    () => [
      wrappedCurrency(currencyA, chainId),
      wrappedCurrency(currencyB, chainId),
    ],
    [currencyA, currencyB, chainId]
  );

  const expertMode = useIsExpertMode();

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // burn state
  const { independentField, independentTokenField, typedValue } =
    useBurnState();
  const {
    amountsMin,
    currencies,
    dependentTokenField,
    error,
    insufficientLiquidity,
    noZapAmounts,
    pair,
    parsedAmounts,
    price,
    userLiquidity,
  } = useDerivedZapOutInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
    pairAddress
  );
  const { onSwitchField, onUserInput: _onUserInput } =
    useZapOutActionHandlers();

  const selectedCurrencyIsETHER = !!(
    chainId &&
    currencies[independentTokenField] &&
    currencyEquals(currencies[independentTokenField] as Currency, ETHER)
  );

  // const selectedCurrencyIsWETH = !!(
  //   chainId &&
  //   currencies[independentTokenField] &&
  //   currencyEquals(currencies[independentTokenField] as Currency, WETH[chainId])
  // );

  const independentToken =
    nativeA && nativeB
      ? independentTokenField === Field.CURRENCY_A
        ? nativeA
        : nativeB
      : undefined;

  const isValid = !error && !insufficientLiquidity;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState(false); // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('');
  const deadline = useTransactionDeadline();
  const [allowedSlippage] = useUserSlippageTolerance();
  const [zapOutError, setZapOutError] = useState<string>('');

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
    !!chainId ? ZAP_ADDRESSES[chainId as keyof typeof ZAP_ADDRESSES] : undefined
  );

  const isArgentWallet = useIsArgentWallet();

  async function onAttemptToApprove() {
    if (!chainId) throw new Error('missing chain');
    if (!pairContract || !pair || !provider || !deadline)
      throw new Error('missing dependencies');
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
    if (!liquidityAmount) throw new Error('missing liquidity amount');

    if (isArgentWallet) {
      return approveCallback();
    }

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account);

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ];
    const domain = {
      chainId: chainId,
      name: 'KyberDMM LP',
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
      deadline: deadline.toNumber(),
      nonce: nonce.toHexString(),
      owner: account,
      spender: ZAP_ADDRESSES[chainId as keyof typeof ZAP_ADDRESSES],
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
          deadline: deadline.toNumber(),
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
  const onCurrencyInput = useCallback(
    (typedValue: string): void =>
      onUserInput(independentTokenField, typedValue),
    [independentTokenField, onUserInput]
  );

  // tx sending
  const addTransactionWithType = useTransactionAdder();
  async function onRemove() {
    if (!chainId || !provider || !account || !deadline)
      throw new Error('missing dependencies');
    const {
      [Field.CURRENCY_A]: currencyAmountA,
      [Field.CURRENCY_B]: currencyAmountB,
    } = parsedAmounts;
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts');
    }
    const router = getZapContract(chainId, provider, account);

    if (!currencyA || !currencyB) throw new Error('missing tokens');
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
    if (!liquidityAmount) throw new Error('missing liquidity amount');

    const currencyBIsETH = currencyB === ETHER;

    if (!tokenA || !tokenB) throw new Error('could not wrap');

    let methodNames: string[],
      args: Array<string | string[] | number | boolean>;
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // zapOutEth
      if (selectedCurrencyIsETHER) {
        methodNames = ['zapOutEth'];
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          pairAddress,
          account,
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
          ].toString(),
          deadline.toHexString(),
        ];
      }
      // zapOut
      else {
        methodNames = ['zapOut'];
        args = [
          independentTokenField === Field.CURRENCY_A
            ? tokenB.address
            : tokenA.address,
          independentTokenField === Field.CURRENCY_A
            ? tokenA.address
            : tokenB.address,
          liquidityAmount.raw.toString(),
          pairAddress,
          account,
          independentTokenField === Field.CURRENCY_A
            ? amountsMin[Field.CURRENCY_A].toString()
            : amountsMin[Field.CURRENCY_B].toString(),
          deadline.toHexString(),
        ];
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // zapOutEthPermit
      if (selectedCurrencyIsETHER) {
        methodNames = ['zapOutEthPermit'];
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          pairAddress,
          account,
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
          ].toString(),
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ];
      }
      // zapOutPermit
      else {
        methodNames = ['zapOutPermit'];
        args = [
          independentTokenField === Field.CURRENCY_A
            ? tokenB.address
            : tokenA.address,
          independentTokenField === Field.CURRENCY_A
            ? tokenA.address
            : tokenB.address,
          liquidityAmount.raw.toString(),
          pairAddress,
          account,
          independentTokenField === Field.CURRENCY_A
            ? amountsMin[Field.CURRENCY_A].toString()
            : amountsMin[Field.CURRENCY_B].toString(),
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
          .catch((err) => {
            // we only care if the error is something other than the user rejected the tx
            if ((err as any)?.code !== 4001) {
              console.error('estimateGas failed', methodName, args, err);
            }

            if (err.message.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
              setZapOutError(
                'Insufficient liquidity available. Please reload page and try again!'
              );
            } else {
              setZapOutError(err?.message);
            }

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
          if (!!currencyA && !!currencyB) {
            setAttemptingTxn(false);

            addTransactionWithType(response, {
              summary:
                parsedAmounts[independentTokenField]?.toSignificant(3) +
                ' ' +
                independentToken?.symbol,
            });

            setTxHash(response.hash);
          }
        })
        .catch((err: Error) => {
          setAttemptingTxn(false);
          // we only care if the error is something _other_ than the user rejected the tx
          if ((err as any)?.code !== 4001) {
            console.error(err);
          }

          if (err.message.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
            setZapOutError(
              'Insufficient liquidity available. Please reload page and try again'
            );
          } else {
            setZapOutError(err?.message);
          }
        });
    }
  }

  const pendingText = `Removing ${parsedAmounts[
    independentTokenField
  ]?.toSignificant(6)} ${independentToken?.symbol}`;

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString());
    },
    [onUserInput]
  );

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    setSignatureData(null); // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0');
    }
    setTxHash('');
    setZapOutError('');
  }, [onUserInput, txHash]);

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] =
    useDebouncedChangeHandler(
      Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
      liquidityPercentChangeCallback
    );

  const handleSwitchCurrency = useCallback(() => {
    onSwitchField();
  }, [onSwitchField]);

  const priceToSwap = price
    ? independentTokenField === Field.CURRENCY_A
      ? price.invert()
      : price
    : undefined;

  const amountOut =
    parsedAmounts[independentTokenField] &&
    noZapAmounts[independentTokenField] &&
    !(parsedAmounts[independentTokenField] as TokenAmount).lessThan(
      noZapAmounts[independentTokenField] as TokenAmount
    )
      ? (parsedAmounts[independentTokenField] as TokenAmount).subtract(
          noZapAmounts[independentTokenField] as TokenAmount
        )
      : undefined;

  const usdPrices = useTokensPrice([tokenA, tokenB]);

  const independentTokenPrice =
    independentTokenField === Field.CURRENCY_A ? usdPrices[0] : usdPrices[1];

  const estimatedUsd =
    parsedAmounts[independentTokenField] && independentTokenPrice
      ? parseFloat(
          (parsedAmounts[independentTokenField] as TokenAmount).toSignificant(6)
        ) * independentTokenPrice
      : 0;

  const priceImpact =
    priceToSwap &&
    noZapAmounts[dependentTokenField] &&
    amountOut &&
    computePriceImpact(
      priceToSwap,
      noZapAmounts[dependentTokenField] as CurrencyAmount,
      amountOut as CurrencyAmount
    );

  const priceImpactWithoutFee =
    pair && priceImpact
      ? computePriceImpactWithoutFee([pair], priceImpact)
      : undefined;

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  function modalHeader() {
    return (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        <AutoRow gap="4px">
          <CurrencyLogo
            currency={currencies[independentTokenField]}
            size={'24px'}
          />
          <Text fontSize={12} fontWeight={500}>
            {parsedAmounts[independentTokenField]?.toSignificant(6)}
          </Text>
          <Text fontSize={12} fontWeight={500}>
            {independentToken?.symbol}
          </Text>
          {estimatedUsd && (
            <Text fontSize={12} fontWeight={500} marginLeft="4px">
              (~{formattedNum(estimatedUsd.toString(), true) || undefined})
            </Text>
          )}
        </AutoRow>

        <TYPE.italic fontSize={12} fontWeight={400} textAlign="left">
          {`Output is estimated. If the price changes by more than ${
            allowedSlippage / 100
          }% your transaction will revert.`}
        </TYPE.italic>
      </AutoColumn>
    );
  }

  function modalBottom() {
    return (
      <>
        <ModalDetailWrapper>
          {pair && (
            <>
              <CurrentPriceWrapper style={{ paddingBottom: '8px' }}>
                <TYPE.subHeader fontSize={12} fontWeight={400}>
                  Current Price
                </TYPE.subHeader>
                <TYPE.black fontSize={12} fontWeight={400}>
                  <CurrentPrice price={price} />
                </TYPE.black>
              </CurrentPriceWrapper>

              <RowBetween style={{ paddingBottom: '12px' }}>
                <TYPE.subHeader fontSize={12} fontWeight={400}>
                  Price Impact
                </TYPE.subHeader>
                <TYPE.black fontSize={12} fontWeight={400}>
                  <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
                </TYPE.black>
              </RowBetween>

              <RowBetween style={{ paddingBottom: '12px' }}>
                <Text fontSize={12} fontWeight={400}>
                  LP Tokens Removed
                </Text>

                <RowFixed>
                  <DoubleCurrencyLogo
                    currency0={currencyA}
                    currency1={currencyB}
                    margin={true}
                  />
                  <Text fontSize={12} fontWeight={400}>
                    {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
                  </Text>
                </RowFixed>
              </RowBetween>

              {amountsMin && (
                <>
                  <RowBetween style={{ paddingBottom: '12px' }}>
                    <TYPE.subHeader fontSize={12} fontWeight={400}>
                      Minimum received
                    </TYPE.subHeader>

                    <TokenWrapper>
                      <CurrencyLogo currency={independentToken} size="16px" />
                      <TYPE.black fontSize={12} fontWeight={400}>
                        {formatJSBIValue(
                          independentTokenField === Field.CURRENCY_A
                            ? amountsMin[Field.CURRENCY_A]
                            : amountsMin[Field.CURRENCY_B],
                          independentToken?.decimals
                        )}{' '}
                        {independentToken?.symbol}
                      </TYPE.black>
                    </TokenWrapper>
                  </RowBetween>
                </>
              )}
            </>
          )}
        </ModalDetailWrapper>

        <ButtonPrimary
          disabled={
            !(approval === ApprovalState.APPROVED || signatureData !== null)
          }
          onClick={onRemove}
        >
          <Text fontSize={12} fontWeight={500}>
            CONFIRM
          </Text>
        </ButtonPrimary>
      </>
    );
  }

  return (
    <>
      <Wrapper>
        <TransactionConfirmationModal
          noPadding
          attemptingTxn={attemptingTxn}
          content={() =>
            zapOutError ? (
              <TransactionErrorContent
                message={zapOutError}
                titleColor={theme`colors.green.400`}
                onDismiss={handleDismissConfirmation}
              />
            ) : (
              <ConfirmationModalContent
                bottomContent={modalBottom}
                title={'YOU WILL RECEIVE'}
                titleColor={theme`colors.green.400`}
                topContent={modalHeader}
                onDismiss={handleDismissConfirmation}
              />
            )
          }
          hash={txHash ? txHash : ''}
          isOpen={showConfirm}
          pendingText={pendingText}
          titleColor={theme`colors.green.400`}
          onDismiss={handleDismissConfirmation}
        />
        <AutoColumn gap="md">
          <GridColumn>
            <FirstColumn>
              <BlackCard borderRadius="4px" padding="1rem">
                <AutoColumn gap="1rem">
                  <RowBetween>
                    <Text fontSize={12} fontWeight={500}>
                      Amount
                    </Text>

                    <Text fontSize={12} fontWeight={500}>
                      Balance:{' '}
                      {!userLiquidity ? (
                        <Loader />
                      ) : (
                        userLiquidity?.toSignificant(6)
                      )}{' '}
                      LP Tokens
                    </Text>
                  </RowBetween>
                  <Row style={{ alignItems: 'flex-end' }}>
                    <Text fontSize={12} fontWeight={500}>
                      {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
                    </Text>
                  </Row>

                  <>
                    <Slider
                      size={18}
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
                </AutoColumn>
              </BlackCard>

              {chainId && pair && (
                <CurrencyInputPanel
                  disableCurrencySelect
                  hideBalance
                  hideLogo
                  currency={
                    new Token(
                      chainId,
                      pair.liquidityToken?.address,
                      pair.liquidityToken?.decimals,
                      'LP Tokens',
                      'LP Tokens'
                    )
                  }
                  id="liquidity-amount"
                  showMaxButton={false}
                  value={formattedAmounts[Field.LIQUIDITY]}
                  onUserInput={onLiquidityInput}
                />
              )}
            </FirstColumn>

            <SecondColumn>
              <div>
                <CurrencyInputPanel
                  disabledInput
                  isSwitchMode
                  showCommonBases
                  currency={currencies[independentTokenField]}
                  disableCurrencySelect={false}
                  estimatedUsd={
                    formattedNum(estimatedUsd.toString(), true) || undefined
                  }
                  id="zap-out-input"
                  label={'Output'}
                  positionMax="top"
                  showMaxButton={false}
                  value={formattedAmounts[independentTokenField]}
                  onSwitchCurrency={handleSwitchCurrency}
                  onUserInput={onCurrencyInput}
                />
                {/* <Flex
                  alignItems="center"
                  justifyContent="flex-end"
                  marginTop="0.5rem"
                >
                  {pairAddress &&
                    chainId &&
                    (selectedCurrencyIsETHER || selectedCurrencyIsWETH) &&
                    currencies[dependentTokenField] && (
                      <StyledInternalLink
                        replace
                        to={
                          independentTokenField === Field.CURRENCY_A
                            ? `/remove/${
                                selectedCurrencyIsETHER
                                  ? currencyId(WETH[chainId], chainId)
                                  : currencyId(ETHER, chainId)
                              }/${currencyId(
                                currencies[dependentTokenField] as Currency,
                                chainId
                              )}/${pairAddress}`
                            : `/remove/${currencyId(
                                currencies[dependentTokenField] as Currency,
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
                      </StyledInternalLink>
                    )}
                </Flex> */}
              </div>

              {pair && (
                <DetailWrapper>
                  <DetailBox
                    style={{
                      borderBottom: `1px dashed ${theme`colors.gray.200`}`,
                      paddingBottom: '12px',
                    }}
                  >
                    <AutoColumn gap="8px">
                      <TYPE.subHeader fontSize={12} fontWeight={500}>
                        <UppercaseText>Price Impact</UppercaseText>
                      </TYPE.subHeader>
                      <TYPE.black fontSize={12} fontWeight={400}>
                        <FormattedPriceImpact
                          priceImpact={priceImpactWithoutFee}
                        />
                      </TYPE.black>
                    </AutoColumn>

                    {amountsMin && (
                      <AutoColumn gap="8px">
                        <TYPE.subHeader fontSize={12} fontWeight={500}>
                          <UppercaseText>Minimum received</UppercaseText>
                        </TYPE.subHeader>

                        <TokenWrapper>
                          <CurrencyLogo
                            currency={
                              independentTokenField === Field.CURRENCY_A
                                ? currencyA
                                : currencyB
                            }
                            size="16px"
                          />
                          <TYPE.black fontSize={12} fontWeight={400}>
                            {formatJSBIValue(
                              independentTokenField === Field.CURRENCY_A
                                ? amountsMin[Field.CURRENCY_A]
                                : amountsMin[Field.CURRENCY_B],
                              independentToken?.decimals
                            )}{' '}
                            {independentToken?.symbol}
                          </TYPE.black>
                        </TokenWrapper>
                      </AutoColumn>
                    )}
                  </DetailBox>

                  <DetailBox style={{ paddingTop: '12px' }}>
                    <TYPE.subHeader
                      fontSize={12}
                      fontWeight={500}
                      style={{ alignItems: 'center', display: 'flex' }}
                    >
                      <UppercaseText>Current Price:</UppercaseText>
                    </TYPE.subHeader>
                    <TYPE.black fontSize={12} fontWeight={400}>
                      <CurrentPrice price={price} />
                    </TYPE.black>
                  </DetailBox>
                </DetailWrapper>
              )}

              {insufficientLiquidity ? (
                <ZapError
                  message={
                    'Insufficient Liquidity in the Liquidity Pool to Swap'
                  }
                  warning={false}
                />
              ) : priceImpactSeverity > 3 ? (
                <ZapError
                  message={'Price impact is too high'}
                  warning={false}
                />
              ) : priceImpactSeverity > 2 ? (
                <ZapError message={'Price impact is high'} warning={true} />
              ) : null}

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
                        !isValid ||
                        approval !== ApprovalState.NOT_APPROVED ||
                        signatureData !== null ||
                        !userLiquidity ||
                        userLiquidity.equalTo('0') ||
                        (priceImpactSeverity > 3 && !expertMode)
                      }
                      fontSize={12}
                      fontWeight={500}
                      margin="0 1rem 0 0"
                      padding="16px"
                      onClick={onAttemptToApprove}
                    >
                      {approval === ApprovalState.PENDING ? (
                        <Dots>Approving</Dots>
                      ) : approval === ApprovalState.APPROVED ||
                        signatureData !== null ? (
                        'APPROVED'
                      ) : (
                        'APPROVE'
                      )}
                    </ButtonConfirmed>
                    <ButtonError
                      disabled={
                        !isValid ||
                        (signatureData === null &&
                          approval !== ApprovalState.APPROVED) ||
                        (priceImpactSeverity > 3 && !expertMode)
                      }
                      error={
                        !!parsedAmounts[Field.CURRENCY_A] &&
                        !!parsedAmounts[Field.CURRENCY_B] &&
                        (!isValid || priceImpactSeverity > 2)
                      }
                      padding="16px 6px"
                      onClick={() => {
                        setShowConfirm(true);
                      }}
                    >
                      <Text fontSize={12} fontWeight={500}>
                        {error
                          ? error
                          : priceImpactSeverity > 3 && !expertMode
                          ? 'REMOVE'
                          : priceImpactSeverity > 2
                          ? 'REMOVE ANYWAY'
                          : 'REMOVE'}
                      </Text>
                    </ButtonError>
                  </RowBetween>
                )}
              </div>
            </SecondColumn>
          </GridColumn>
        </AutoColumn>
      </Wrapper>
    </>
  );
}
