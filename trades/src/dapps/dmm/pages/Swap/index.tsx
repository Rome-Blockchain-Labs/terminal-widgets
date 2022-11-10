import 'twin.macro';

import { CurrencyAmount, JSBI, Token } from '@dynamic-amm/sdk';
import { useWeb3React } from '@romeblockchain/wallet';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AlertTriangle, ArrowDown, X } from 'react-feather';
import { Box, Flex, Text } from 'rebass';
import { styled } from 'twin.macro';

import { ModalWrapper } from '../../../../components/modals';
import { useIsMobile } from '../../../../hooks';
import { DmmContext } from '../../../../widgets/Dmm/DmmContext';
import AddressInputPanel from '../../components/AddressInputPanel';
import {
  ButtonConfirmed,
  ButtonError,
  ButtonLight,
  ButtonPrimary,
} from '../../components/Button';
import Card, { GreyCard } from '../../components/Card';
import Column, { AutoColumn } from '../../components/Column';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { Swap as SwapIcon } from '../../components/Icons';
import InfoHelper from '../../components/InfoHelper';
import Loader from '../../components/Loader';
import ProgressSteps from '../../components/ProgressSteps';
import { AutoRow, RowBetween } from '../../components/Row';
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal';
import Routing from '../../components/swap/Routing';
import { Container, PageWrapper } from '../../components/swap/styleds';
import {
  ArrowWrapper,
  BottomGrouping,
  Dots,
  KyberTag,
  PriceImpactHigh,
  SwapCallbackError,
  Wrapper,
} from '../../components/swap/styleds';
import TradePrice from '../../components/swap/TradePrice';
import TradeTypeSelection from '../../components/swap/TradeTypeSelection';
import TokenWarningModal from '../../components/TokenWarningModal';
import { INITIAL_ALLOWED_SLIPPAGE } from '../../constants';
import { useAllTokens, useCurrency } from '../../hooks/Tokens';
import {
  ApprovalState,
  useApproveCallbackFromTradeV2,
} from '../../hooks/useApproveCallback';
import { useSwapV2Callback } from '../../hooks/useSwapV2Callback';
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback';
import {
  useToggleTransactionSettingsMenu,
  useWalletModalToggle,
} from '../../state/application/hooks';
import { Field } from '../../state/swap/actions';
import {
  useDefaultsFromURLSearch,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import { useDerivedSwapInfoV2 } from '../../state/swap/useAggregator';
import {
  useExpertModeManager,
  useUserSlippageTolerance,
} from '../../state/user/hooks';
import { TYPE } from '../../theme';
import { formattedNum } from '../../utils';
import { Aggregator } from '../../utils/aggregator';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import AppBody from '../AppBody';
import { ClickableText } from '../Pool/styleds';

const AppBodyWrapped = styled(AppBody)`
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.04);
  z-index: 1;
  padding: 1.875rem 3rem;
`;

export default function Swap() {
  const [rotate, setRotate] = useState(false);
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const [showRoute, setShowRoute] = useState<boolean>(false);

  const toggleShowRoute = () => setShowRoute((prev) => !prev);

  const loadedUrlParams = useDefaultsFromURLSearch();

  const { currencyIdA, currencyIdB } = useContext(DmmContext);

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(currencyIdA ? currencyIdA : loadedUrlParams?.inputCurrencyId),
    useCurrency(currencyIdB ? currencyIdB : loadedUrlParams?.outputCurrencyId),
  ];

  const [dismissTokenWarning, setDismissTokenWarning] =
    useState<boolean>(false);
  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c instanceof Token
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // dismiss warning if all imported tokens are in networkLogos lists
  const defaultTokens = useAllTokens();
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens);
    });

  const { account } = useWeb3React();

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // for expert mode
  const toggleSettings = useToggleTransactionSettingsMenu();
  const [isExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance();

  // swap state
  const { independentField, recipient, typedValue } = useSwapState();

  const isMobile = useIsMobile();

  const {
    currencies,
    currencyBalances,
    inputError: swapInputError,

    parsedAmount,
    tradeComparer,
    v2Trade,
  } = useDerivedSwapInfoV2();
  const {
    execute: onWrap,
    inputError: wrapInputError,
    wrapType,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const trade = showWrap ? undefined : v2Trade;

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]:
          independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]:
          independentField === Field.OUTPUT
            ? parsedAmount
            : trade?.outputAmount,
      };

  const {
    onChangeRecipient,
    onCurrencySelection,
    onSwitchTokensV2,
    onUserInput,
  } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback((): void => {
    // ...
  }, []);

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // modal and loading
  const [
    { attemptingTxn, showConfirm, swapErrorMessage, tradeToConfirm, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    tradeToConfirm: Aggregator | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    attemptingTxn: false,
    showConfirm: false,
    swapErrorMessage: undefined,
    tradeToConfirm: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    [independentField]: typedValue,
  };

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );
  const noRoute = !trade?.swaps?.length;

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTradeV2(
    trade,
    allowedSlippage
  );

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(
    currencyBalances[Field.INPUT]
  );

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } =
    useSwapV2Callback(trade, allowedSlippage, recipient);
  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return;
    }
    setSwapState({
      attemptingTxn: true,
      showConfirm,
      swapErrorMessage: undefined,
      tradeToConfirm,
      txHash: undefined,
    });
    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          showConfirm,
          swapErrorMessage: undefined,
          tradeToConfirm,
          txHash: hash,
        });
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          showConfirm,
          swapErrorMessage: error.message,
          tradeToConfirm,
          txHash: undefined,
        });
      });
  }, [tradeToConfirm, showConfirm, swapCallback]);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode

  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED));

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({
      attemptingTxn,
      showConfirm: false,
      swapErrorMessage,
      tradeToConfirm,
      txHash,
    });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '');
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      attemptingTxn,
      showConfirm,
      swapErrorMessage,
      tradeToConfirm: trade,
      txHash,
    });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact());
  }, [maxAmountInput, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

  const isLoading =
    (!currencyBalances[Field.INPUT] || !currencyBalances[Field.OUTPUT]) &&
    userHasSpecifiedInputOutput &&
    !v2Trade;

  return (
    <>
      <TokenWarningModal
        isOpen={
          importTokensNotInDefault.length > 0 &&
          !dismissTokenWarning &&
          !!account
        }
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
        onDismiss={handleDismissTokenWarning}
      />
      <PageWrapper tw="max-w-2xl relative">
        {/* <AggregatorStatsContainer>
          <AggregatorStatsItem>
            <AggregatorStatsItemTitle>
              Total Trading Volume
            </AggregatorStatsItemTitle>
            <AggregatorStatsItemValue>
              {aggregatorVolume ? (
                formatBigLiquidity(aggregatorVolume.totalVolume, 2, true)
              ) : (
                <Loader />
              )}
            </AggregatorStatsItemValue>
          </AggregatorStatsItem>

          <AggregatorStatsItem>
            <AggregatorStatsItemTitle>
              24H Trading Volume
            </AggregatorStatsItemTitle>
            <AggregatorStatsItemValue>
              {aggregatorVolume ? (
                formattedNum(aggregatorVolume.last24hVolume, true)
              ) : (
                <Loader />
              )}
            </AggregatorStatsItemValue>
          </AggregatorStatsItem>
        </AggregatorStatsContainer> */}

        <Container>
          <div>
            <AppBodyWrapped tw="relative">
              <div tw="absolute w-full h-full bg-green-700 left-0 top-0 opacity-80 rounded-xl"></div>
              {/* <RowBetween mb={'16px'}>
                <TYPE.black fontSize={20} fontWeight={500}>
                  Swap
                </TYPE.black>
                <SwapFormActions>
                  <RefreshButton
                    isConfirming={showConfirm}
                    trade={trade}
                    onClick={onRefresh}
                  />
                  <TransactionSettings />
                </SwapFormActions>
              </RowBetween> */}

              <Wrapper id="swap-page">
                <ConfirmSwapModal
                  allowedSlippage={allowedSlippage}
                  attemptingTxn={attemptingTxn}
                  isOpen={showConfirm}
                  originalTrade={tradeToConfirm}
                  recipient={recipient}
                  swapErrorMessage={swapErrorMessage}
                  tokenAddtoMetaMask={currencies[Field.OUTPUT]}
                  trade={trade}
                  txHash={txHash}
                  onAcceptChanges={handleAcceptChanges}
                  onConfirm={handleSwap}
                  onDismiss={handleConfirmDismiss}
                />

                <div tw="max-w-md mx-auto">
                  <CurrencyInputPanel
                    showMaxButton
                    currency={currencies[Field.INPUT]}
                    estimatedUsd={
                      trade?.amountInUsd
                        ? `${formattedNum(trade.amountInUsd, true)}`
                        : undefined
                    }
                    id="swap-currency-input"
                    label={
                      independentField === Field.OUTPUT && !showWrap && trade
                        ? 'From (estimated)'
                        : 'From'
                    }
                    otherCurrency={currencies[Field.OUTPUT]}
                    positionMax="top"
                    showCommonBases={true}
                    value={formattedAmounts[Field.INPUT]}
                    onCurrencySelect={handleInputSelect}
                    onMax={handleMaxInput}
                    onUserInput={handleTypeInput}
                  />
                  <AutoColumn justify="space-between" tw="mt-2">
                    <AutoRow
                      justify={isExpertMode ? 'space-between' : 'center'}
                      style={{ padding: '0 1rem' }}
                    >
                      <ArrowWrapper
                        clickable
                        rotated={rotate}
                        onClick={() => {
                          setApprovalSubmitted(false); // reset 2 step UI for approvals
                          setRotate((prev) => !prev);
                          onSwitchTokensV2();
                        }}
                      >
                        <SwapIcon size={22} />
                      </ArrowWrapper>
                      {recipient === null && !showWrap && isExpertMode ? (
                        <button
                          id="add-recipient-button"
                          onClick={() => onChangeRecipient('')}
                        >
                          + Add Recipient (optional)
                        </button>
                      ) : null}
                    </AutoRow>
                  </AutoColumn>
                  <Box sx={{ position: 'relative' }}>
                    {tradeComparer?.tradeSaved?.usd && (
                      <KyberTag>
                        You Save{' '}
                        {formattedNum(tradeComparer.tradeSaved.usd, true)}
                        <InfoHelper
                          size={14}
                          text={
                            <Text>
                              The amount you save compared to{' '}
                              <Text as="span">
                                {tradeComparer.comparedDex.name}
                              </Text>
                              .{' '}
                              <Text as="span" fontWeight={500}>
                                KyberSwap
                              </Text>{' '}
                              gets you the best token rates
                            </Text>
                          }
                        />
                      </KyberTag>
                    )}

                    <CurrencyInputPanel
                      disabledInput
                      currency={currencies[Field.OUTPUT]}
                      estimatedUsd={
                        trade?.amountOutUsd
                          ? `${formattedNum(trade.amountOutUsd, true)}`
                          : undefined
                      }
                      id="swap-currency-output"
                      label={
                        independentField === Field.INPUT && !showWrap && trade
                          ? 'To (estimated)'
                          : 'To'
                      }
                      otherCurrency={currencies[Field.INPUT]}
                      showCommonBases={true}
                      showMaxButton={false}
                      value={formattedAmounts[Field.OUTPUT]}
                      onCurrencySelect={handleOutputSelect}
                      onUserInput={handleTypeOutput}
                    />
                  </Box>

                  {recipient !== null && !showWrap ? (
                    <>
                      <AutoRow
                        justify="space-between"
                        style={{ padding: '0 1rem' }}
                      >
                        <ArrowWrapper clickable={false}>
                          <ArrowDown size="16" />
                        </ArrowWrapper>
                        <button
                          id="remove-recipient-button"
                          onClick={() => onChangeRecipient(null)}
                        >
                          - Remove Recipient
                        </button>
                      </AutoRow>
                      <AddressInputPanel
                        id="recipient"
                        value={recipient}
                        onChange={onChangeRecipient}
                      />
                    </>
                  ) : null}

                  {showWrap ? null : (
                    <Card
                      borderRadius={'20px'}
                      padding={'0 .75rem 0 .25rem'}
                      tw="mt-1"
                    >
                      <AutoColumn gap="4px">
                        <TradePrice
                          price={trade?.executionPrice}
                          setShowInverted={setShowInverted}
                          showInverted={showInverted}
                        />

                        {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                          <Flex
                            alignItems="center"
                            fontSize={12}
                            width="fit-content"
                            onClick={toggleSettings}
                          >
                            <ClickableText fontWeight={500}>
                              Max Slippage:&nbsp;
                              {allowedSlippage / 100}%
                            </ClickableText>
                          </Flex>
                        )}
                      </AutoColumn>
                    </Card>
                  )}
                </div>

                {trade?.priceImpact && trade.priceImpact > 5 && (
                  <PriceImpactHigh veryHigh={trade?.priceImpact > 15}>
                    <AlertTriangle
                      // color={
                      //   trade?.priceImpact > 15 ? theme.red : theme.warning
                      // }
                      size={16}
                      style={{ marginRight: '10px' }}
                    />
                    {trade?.priceImpact > 15 ? (
                      <>
                        Price Impact is Very High
                        <InfoHelper text="Turn on Advanced Mode for high slippage trades" />
                      </>
                    ) : (
                      'Price Impact is High'
                    )}
                  </PriceImpactHigh>
                )}
                <div tw="flex justify-center items-center w-full h-full gap-3 mt-5">
                  <TradeTypeSelection />

                  <BottomGrouping>
                    {!account ? (
                      <ButtonLight onClick={toggleWalletModal}>
                        Connect Wallet
                      </ButtonLight>
                    ) : isLoading ? (
                      <GreyCard
                        style={{ borderRadius: '5.5px', textAlign: 'center' }}
                      >
                        <TYPE.main mb="4px">
                          <Dots>Calculating best route</Dots>
                        </TYPE.main>
                      </GreyCard>
                    ) : showWrap ? (
                      <ButtonPrimary
                        disabled={Boolean(wrapInputError)}
                        onClick={onWrap}
                      >
                        {wrapInputError ??
                          (wrapType === WrapType.WRAP
                            ? 'Wrap'
                            : wrapType === WrapType.UNWRAP
                            ? 'Unwrap'
                            : null)}
                      </ButtonPrimary>
                    ) : noRoute && userHasSpecifiedInputOutput ? (
                      <GreyCard
                        style={{ borderRadius: '5.5px', textAlign: 'center' }}
                      >
                        Insufficient liquidity for this trade.
                      </GreyCard>
                    ) : showApproveFlow ? (
                      <RowBetween>
                        <ButtonConfirmed
                          altDisabledStyle={approval === ApprovalState.PENDING}
                          confirmed={approval === ApprovalState.APPROVED}
                          disabled={
                            approval !== ApprovalState.NOT_APPROVED ||
                            approvalSubmitted
                          }
                          width="48%" // show solid button while waiting
                          onClick={approveCallback}
                        >
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              Approving <Loader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted &&
                            approval === ApprovalState.APPROVED ? (
                            'Approved'
                          ) : (
                            `Approve ${currencies[Field.INPUT]?.symbol}`
                          )}
                        </ButtonConfirmed>
                        <ButtonError
                          disabled={
                            !isValid || approval !== ApprovalState.APPROVED
                          }
                          id="swap-button"
                          width="48%"
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap();
                            } else {
                              setSwapState({
                                attemptingTxn: false,
                                showConfirm: true,
                                swapErrorMessage: undefined,
                                tradeToConfirm: trade,
                                txHash: undefined,
                              });
                            }
                          }}
                        >
                          {trade && trade.priceImpact > 5
                            ? 'Swap Anyway'
                            : 'Swap '}
                        </ButtonError>
                      </RowBetween>
                    ) : (
                      <ButtonError
                        disabled={
                          !isValid ||
                          !!swapCallbackError ||
                          approval !== ApprovalState.APPROVED ||
                          (!isExpertMode && trade && trade.priceImpact > 15)
                        }
                        id="swap-button"
                        style={{
                          border: 'none',
                          ...(!(
                            !isValid ||
                            !!swapCallbackError ||
                            approval !== ApprovalState.APPROVED ||
                            (!isExpertMode && trade && trade.priceImpact > 15)
                          ) &&
                          trade &&
                          trade.priceImpact > 5
                            ? {}
                            : // ? { background: theme.red, color: theme.white }
                              {}),
                        }}
                        onClick={() => {
                          if (isExpertMode) {
                            handleSwap();
                          } else {
                            setSwapState({
                              attemptingTxn: false,
                              showConfirm: true,
                              swapErrorMessage: undefined,
                              tradeToConfirm: trade,
                              txHash: undefined,
                            });
                          }
                        }}
                      >
                        {swapInputError
                          ? swapInputError
                          : approval !== ApprovalState.APPROVED
                          ? 'Checking allowance...'
                          : trade && trade.priceImpact > 5
                          ? 'Swap Anyway'
                          : 'Swap'}
                      </ButtonError>
                    )}
                    {showApproveFlow && (
                      <Column style={{ marginTop: '1rem' }}>
                        <ProgressSteps
                          steps={[approval === ApprovalState.APPROVED]}
                        />
                      </Column>
                    )}
                    {isExpertMode && swapErrorMessage ? (
                      <SwapCallbackError error={swapErrorMessage} />
                    ) : null}
                  </BottomGrouping>
                </div>
              </Wrapper>
              {/* <AdvancedSwapDetailsDropdown
                toggleRoute={toggleShowRoute}
                trade={trade}
              /> */}
            </AppBodyWrapped>
          </div>
        </Container>
      </PageWrapper>
      {/* <Modal
        isOpen={showRoute}
        maxHeight="80vh"
        maxWidth={900}
        onDismiss={toggleShowRoute}
        {...(isMobile && { minHeight: 60 })}
      > */}
      <ModalWrapper
        noPadding
        isOpen={showRoute}
        onDismiss={toggleShowRoute}
        {...(isMobile && { minHeight: 60 })}
      >
        <Flex flexDirection="column" padding="28px 24px" width="100%">
          <RowBetween>
            <Text fontSize={18} fontWeight={500}>
              Your trade route
            </Text>
            <button onClick={toggleShowRoute}>
              <X />
            </button>
          </RowBetween>
          <Routing
            currencies={currencies}
            parsedAmounts={parsedAmounts}
            trade={trade}
          />
        </Flex>
      </ModalWrapper>
      {/* </Modal> */}
    </>
  );
}
