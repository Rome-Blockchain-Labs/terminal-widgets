import {
  Currency,
  CurrencyAmount,
  ETHER,
  Percent,
  Token,
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
import { Dots } from '../../components/swap/styleds';
import { ROUTER_ADDRESSES } from '../../constants/index';
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
import { useBurnActionHandlers } from '../../state/burn/hooks';
import { useBurnState, useDerivedBurnInfo } from '../../state/burn/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { useUserSlippageTolerance } from '../../state/user/hooks';
import { TYPE, UppercaseText } from '../../theme';
import {
  calculateGasMargin,
  calculateSlippageAmount,
  formattedNum,
  getRouterContract,
} from '../../utils';
import {
  convertToNativeTokenFromETH,
  useCurrencyConvertedToNative,
} from '../../utils/dmm';
import { formatJSBIValue } from '../../utils/formatBalance';
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

export default function TokenPair({
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

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // burn state
  const { independentField, typedValue } = useBurnState();
  const { amountsMin, error, pair, parsedAmounts, price, userLiquidity } =
    useDerivedBurnInfo(
      currencyA ?? undefined,
      currencyB ?? undefined,
      pairAddress
    );
  const { onUserInput: _onUserInput } = useBurnActionHandlers();
  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState(false); // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('');
  const deadline = useTransactionDeadline();
  const [allowedSlippage] = useUserSlippageTolerance();
  const [removeLiquidityError, setRemoveLiquidityError] = useState<string>('');

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
    !!chainId
      ? ROUTER_ADDRESSES[chainId as keyof typeof ROUTER_ADDRESSES]
      : undefined
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
      spender: ROUTER_ADDRESSES[chainId as keyof typeof ROUTER_ADDRESSES],
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
  const onCurrencyAInput = useCallback(
    (typedValue: string): void => onUserInput(Field.CURRENCY_A, typedValue),
    [onUserInput]
  );
  const onCurrencyBInput = useCallback(
    (typedValue: string): void => onUserInput(Field.CURRENCY_B, typedValue),
    [onUserInput]
  );

  // tx sending
  const addTransactionWithType = useTransactionAdder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const router = getRouterContract(chainId, provider, account);

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

    if (!tokenA || !tokenB) throw new Error('could not wrap');

    let methodNames: string[],
      args: Array<string | string[] | number | boolean>;
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = [
          'removeLiquidityETH',
          'removeLiquidityETHSupportingFeeOnTransferTokens',
        ];
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          pairAddress,
          liquidityAmount.raw.toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
          ].toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
          ].toString(),
          account,
          deadline.toHexString(),
        ];
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity'];
        args = [
          tokenA.address,
          tokenB.address,
          pairAddress,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString(),
        ];
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = [
          'removeLiquidityETHWithPermit',
          'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens',
        ];
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          pairAddress,
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
          pairAddress,
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
          if (!!currencyA && !!currencyB) {
            setAttemptingTxn(false);

            addTransactionWithType(response, {
              summary:
                parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
                ' ' +
                convertToNativeTokenFromETH(currencyA, chainId).symbol +
                ' and ' +
                parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
                ' ' +
                convertToNativeTokenFromETH(currencyB, chainId).symbol,
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

          if (err.message.includes('INSUFFICIENT')) {
            setRemoveLiquidityError(
              'Insufficient liquidity available. Please reload page and try again!'
            );
          } else {
            setRemoveLiquidityError(err?.message);
          }
        });
    }
  }

  const usdPrices = useTokensPrice([tokenA, tokenB]);

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

  const pendingText = `Removing ${parsedAmounts[
    Field.CURRENCY_A
  ]?.toSignificant(6)} ${nativeA?.symbol} and ${parsedAmounts[
    Field.CURRENCY_B
  ]?.toSignificant(6)} ${nativeB?.symbol}`;

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
    setRemoveLiquidityError('');
  }, [onUserInput, txHash]);

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] =
    useDebouncedChangeHandler(
      Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
      liquidityPercentChangeCallback
    );

  const modalHeader = useMemo(() => {
    return (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        <AutoRow gap="4px">
          <CurrencyLogo currency={currencyA} size={'28px'} />
          <Text fontSize={12} fontWeight={500}>
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </Text>
          <Text fontSize={12} fontWeight={500}>
            {nativeA?.symbol}
          </Text>
          {estimatedUsdCurrencyA && (
            <Text fontSize={12} fontWeight={500} marginLeft="4px">
              (~
              {formattedNum(estimatedUsdCurrencyA.toString(), true) ||
                undefined}
              )
            </Text>
          )}
        </AutoRow>

        <AutoRow gap="4px">
          <CurrencyLogo currency={currencyB} size={'28px'} />
          <Text fontSize={12} fontWeight={500}>
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </Text>
          <Text fontSize={12} fontWeight={500}>
            {nativeB?.symbol}
          </Text>
          {estimatedUsdCurrencyB && (
            <Text fontSize={12} fontWeight={500} marginLeft="4px">
              (~
              {formattedNum(estimatedUsdCurrencyB.toString(), true) ||
                undefined}
              )
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
  }, [
    allowedSlippage,
    currencyA,
    currencyB,
    estimatedUsdCurrencyA,
    estimatedUsdCurrencyB,
    nativeA?.symbol,
    nativeB?.symbol,
    parsedAmounts,
  ]);

  const modalBottom = useMemo(() => {
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
                      <CurrencyLogo currency={currencyA} size="16px" />
                      <TYPE.black fontSize={12} fontWeight={400}>
                        {formatJSBIValue(
                          amountsMin[Field.CURRENCY_A],
                          currencyA?.decimals
                        )}{' '}
                        {nativeA?.symbol}
                      </TYPE.black>
                    </TokenWrapper>
                  </RowBetween>

                  <RowBetween>
                    <div />

                    <TokenWrapper>
                      <CurrencyLogo currency={currencyB} size="16px" />
                      <TYPE.black fontSize={12} fontWeight={400}>
                        {formatJSBIValue(
                          amountsMin[Field.CURRENCY_B],
                          currencyB?.decimals
                        )}{' '}
                        {nativeB?.symbol}
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
  }, [
    amountsMin,
    approval,
    currencyA,
    currencyB,
    nativeA?.symbol,
    nativeB?.symbol,
    onRemove,
    pair,
    parsedAmounts,
    price,
    signatureData,
  ]);

  return (
    <>
      <Wrapper>
        <TransactionConfirmationModal
          noPadding
          attemptingTxn={attemptingTxn}
          content={() =>
            removeLiquidityError ? (
              <TransactionErrorContent
                message={removeLiquidityError}
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
                    <span tw="text-4xl font-medium">
                      {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
                    </span>
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
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <CurrencyInputPanel
                    currency={currencyA}
                    disableCurrencySelect={true}
                    estimatedUsd={
                      formattedNum(estimatedUsdCurrencyA.toString(), true) ||
                      undefined
                    }
                    id="remove-liquidity-tokena"
                    label={'Output'}
                    showMaxButton={false}
                    value={formattedAmounts[Field.CURRENCY_A]}
                    onCurrencySelect={() => null}
                    onUserInput={onCurrencyAInput}
                  />
                  {/* <Flex
                    alignItems="center"
                    justifyContent="flex-end"
                    marginTop="0.5rem"
                  >
                    {pairAddress &&
                      chainId &&
                      (currencyAIsETHER || currencyAIsWETH) && (
                        <StyledInternalLink
                          replace
                          to={`/remove/${
                            currencyAIsETHER
                              ? currencyId(WETH[chainId], chainId)
                              : currencyId(ETHER, chainId)
                          }/${currencyIdB}/${pairAddress}`}
                        >
                          {currencyAIsETHER
                            ? 'Use Wrapped Token'
                            : 'Use Native Token'}
                        </StyledInternalLink>
                      )}
                  </Flex> */}
                </div>

                <div>
                  <CurrencyInputPanel
                    currency={currencyB}
                    disableCurrencySelect={true}
                    estimatedUsd={
                      formattedNum(estimatedUsdCurrencyB.toString(), true) ||
                      undefined
                    }
                    id="remove-liquidity-tokenb"
                    showMaxButton={false}
                    value={formattedAmounts[Field.CURRENCY_B]}
                    onCurrencySelect={() => null}
                    onUserInput={onCurrencyBInput}
                  />
                  {/* <Flex
                    alignItems="center"
                    justifyContent="flex-end"
                    marginTop="0.5rem"
                  >
                    {pairAddress &&
                      chainId &&
                      (currencyBIsWETH || currencyBIsETHER) && (
                        <StyledInternalLink
                          replace
                          to={`/remove/${currencyIdA}/${
                            currencyBIsETHER
                              ? currencyId(WETH[chainId], chainId)
                              : currencyId(ETHER, chainId)
                          }/${pairAddress}`}
                        >
                          {currencyBIsETHER
                            ? 'Use Wrapped Token'
                            : 'Use Native Token'}
                        </StyledInternalLink>
                      )}
                  </Flex> */}
                </div>
              </>

              {pair && (
                <DetailWrapper>
                  <AutoRow
                    gap="4px"
                    justify="space-between"
                    style={{ paddingBottom: '12px' }}
                  >
                    <TYPE.subHeader fontSize={12} fontWeight={500}>
                      <UppercaseText>Minimum received</UppercaseText>
                    </TYPE.subHeader>
                  </AutoRow>

                  {amountsMin && (
                    <DetailBox
                      style={{
                        borderBottom: `1px dashed ${theme`colors.gray.200`}`,
                        paddingBottom: '12px',
                      }}
                    >
                      <TokenWrapper>
                        <CurrencyLogo currency={currencyA} size="16px" />
                        <TYPE.black fontSize={12} fontWeight={400}>
                          {formatJSBIValue(
                            amountsMin[Field.CURRENCY_A],
                            currencyA?.decimals
                          )}{' '}
                          {nativeA?.symbol}
                        </TYPE.black>
                      </TokenWrapper>

                      <TokenWrapper>
                        <CurrencyLogo currency={currencyB} size="16px" />
                        <TYPE.black fontSize={12} fontWeight={400}>
                          {formatJSBIValue(
                            amountsMin[Field.CURRENCY_B],
                            currencyB?.decimals
                          )}{' '}
                          {nativeB?.symbol}
                        </TYPE.black>
                      </TokenWrapper>
                    </DetailBox>
                  )}

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

              <div style={{ position: 'relative' }}>
                {!account ? (
                  <ButtonLight onClick={toggleWalletModal}>
                    Connect Wallet
                  </ButtonLight>
                ) : (
                  <RowBetween>
                    {!error && (
                      <ButtonConfirmed
                        confirmed={
                          approval === ApprovalState.APPROVED ||
                          signatureData !== null
                        }
                        disabled={
                          approval !== ApprovalState.NOT_APPROVED ||
                          signatureData !== null ||
                          !userLiquidity ||
                          userLiquidity.equalTo('0')
                        }
                        fontSize={12}
                        fontWeight={500}
                        margin="0 1rem 0 0"
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
                    )}
                    <ButtonError
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
                      <Text fontSize={12} fontWeight={500}>
                        {error || 'REMOVE'}
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
