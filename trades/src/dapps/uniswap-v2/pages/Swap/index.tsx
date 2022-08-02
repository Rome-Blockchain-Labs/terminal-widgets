import {
  CurrencyAmount,
  JSBI,
  Token,
  Trade,
} from '@rbl/velox-common/uniV2ClonesSDK';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ArrowDown } from 'react-feather';
import { ClipLoader } from 'react-spinners';
import tw, { theme } from 'twin.macro';

import {
  ButtonConfirmed,
  ButtonError,
  ButtonLight,
  ButtonPrimary,
  LinkStyledButton,
} from '../../../../components/buttons';
import Card from '../../../../components/card';
import { AutoColumn } from '../../../../components/column';
import ProgressSteps from '../../../../components/progressSteps';
import { AutoRow, RowBetween } from '../../../../components/row';
import { INITIAL_ALLOWED_SLIPPAGE } from '../../../../constants';
import { DappContext, useGtagContext } from '../../../../contexts';
import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { Pair } from '../../../../types';
import { maxAmountSpend } from '../../../../utils';
import AddressInputPanel from '../../components/AddressInputPanel';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown';
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee';
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal';
import { ArrowWrapper, SwapCallbackError } from '../../components/swap/styleds';
import TradePrice from '../../components/swap/TradePrice';
import TokenWarningModal from '../../components/TokenWarningModal';
import { useCurrency } from '../../hooks/Tokens';
import {
  ApprovalState,
  useApproveCallbackFromTrade,
} from '../../hooks/useApproveCallback';
import { useSwapCallback } from '../../hooks/useSwapCallback';
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback';
import { PageContext } from '../../PageContext';
import { useSettingsModalToggle } from '../../state/application/hooks';
import { Field } from '../../state/swap/actions';
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import {
  useExpertModeManager,
  useUserDeadline,
  useUserSlippageTolerance,
} from '../../state/user/hooks';
import {
  computeTradePriceBreakdown,
  warningSeverity,
} from '../../utils/prices';
import { ClickableText } from '../Pool/styleds';

const Swap: FC<{ defaultPair?: Pair }> = ({ defaultPair }) => {
  useDefaultsFromURLSearch(defaultPair?.token1, defaultPair?.token0);

  // dapp context
  const { setWalletVisibility } = useContext(PageContext);
  const { network } = useContext(DappContext);

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(defaultPair?.token1.address, network),
    useCurrency(defaultPair?.token0.address, network),
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

  const { account } = useWallets();

  // toggle wallet when disconnected
  const toggleWalletModal = () => {
    setWalletVisibility(true);
  };
  // for expert mode
  const toggleSettings = useSettingsModalToggle();
  const [isExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [deadline] = useUserDeadline();
  const [allowedSlippage] = useUserSlippageTolerance();

  // swap state
  const { independentField, recipient, typedValue } = useSwapState();
  const {
    currencies,
    currencyBalances,
    inputError: swapInputError,
    parsedAmount,
    v2Trade,
  } = useDerivedSwapInfo(network);
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
    onSwitchTokens,
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
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  // modal and loading
  const [
    { attemptingTxn, showConfirm, swapErrorMessage, tradeToConfirm, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    tradeToConfirm: Trade | undefined;
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

  const route = trade?.route;
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );
  const noRoute = !route;

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(
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
  const atMaxAmountInput = Boolean(
    maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput)
  );

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient
  );
  const { sendStatelessEvent } = useGtagContext();
  const { exchange = 'UNISWAPV2' } = useContext(DappContext);
  const { priceImpactWithoutFee } = computeTradePriceBreakdown(exchange, trade);

  const handleSwap = useCallback(() => {
    if (
      priceImpactWithoutFee &&
      !confirmPriceImpactWithoutFee(priceImpactWithoutFee)
    ) {
      return;
    }
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
    sendStatelessEvent('swapAttempt', exchange.toUpperCase(), trade);
    swapCallback()
      .then((hash) => {
        sendStatelessEvent('swapSuccess', exchange.toUpperCase(), trade);
        setSwapState({
          attemptingTxn: false,
          showConfirm,
          swapErrorMessage: undefined,
          tradeToConfirm,
          txHash: hash,
        });
      })
      .catch((error) => {
        sendStatelessEvent('swapFail', exchange.toUpperCase(), trade);
        setSwapState({
          attemptingTxn: false,
          showConfirm,
          swapErrorMessage: error.message,
          tradeToConfirm,
          txHash: undefined,
        });
      });
  }, [
    tradeToConfirm,
    priceImpactWithoutFee,
    showConfirm,
    swapCallback,
    sendStatelessEvent,
    trade,
    exchange,
  ]);

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

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

  return (
    <div tw="w-full max-w-sm">
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <div tw="relative w-full rounded-lg px-5 py-6 bg-gray-500 bg-opacity-75">
        <div tw="relative">
          <ConfirmSwapModal
            allowedSlippage={allowedSlippage}
            attemptingTxn={attemptingTxn}
            isOpen={showConfirm}
            originalTrade={tradeToConfirm}
            recipient={recipient}
            swapErrorMessage={swapErrorMessage}
            trade={trade}
            txHash={txHash}
            onAcceptChanges={handleAcceptChanges}
            onConfirm={handleSwap}
            onDismiss={handleConfirmDismiss}
          />
          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              currency={currencies[Field.INPUT]}
              id="swap-currency-input"
              label={
                independentField === Field.OUTPUT && !showWrap && trade
                  ? 'From (estimated)'
                  : 'From'
              }
              otherCurrency={currencies[Field.OUTPUT]}
              showMaxButton={!atMaxAmountInput}
              value={formattedAmounts[Field.INPUT]}
              onCurrencySelect={handleInputSelect}
              onMax={handleMaxInput}
              onUserInput={handleTypeInput}
            />
            <AutoColumn justify="space-between">
              <AutoRow
                justify={isExpertMode ? 'space-between' : 'center'}
                style={{ padding: '0 1rem' }}
              >
                <ArrowWrapper clickable>
                  <ArrowDown
                    color={theme`colors.yellow.400`}
                    size="16"
                    onClick={() => {
                      setApprovalSubmitted(false); // reset 2 step UI for approvals
                      onSwitchTokens();
                    }}
                  />
                </ArrowWrapper>
                {recipient === null && !showWrap && isExpertMode ? (
                  <LinkStyledButton
                    id="add-recipient-button"
                    onClick={() => onChangeRecipient('')}
                  >
                    + Add a send (optional)
                  </LinkStyledButton>
                ) : null}
              </AutoRow>
            </AutoColumn>
            <CurrencyInputPanel
              currency={currencies[Field.OUTPUT]}
              id="swap-currency-output"
              label={
                independentField === Field.INPUT && !showWrap && trade
                  ? 'To (estimated)'
                  : 'To'
              }
              otherCurrency={currencies[Field.INPUT]}
              showMaxButton={false}
              value={formattedAmounts[Field.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              onUserInput={handleTypeOutput}
            />

            {recipient !== null && !showWrap ? (
              <>
                <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable={false}>
                    <ArrowDown color={theme`colors.yellow.400`} size="16" />
                  </ArrowWrapper>
                  <LinkStyledButton
                    id="remove-recipient-button"
                    onClick={() => onChangeRecipient(null)}
                  >
                    - Remove send
                  </LinkStyledButton>
                </AutoRow>
                <AddressInputPanel
                  id="recipient"
                  value={recipient}
                  onChange={onChangeRecipient}
                />
              </>
            ) : null}

            {showWrap ? null : (
              <Card borderRadius={'20px'} padding={'.25rem .75rem 0 .75rem'}>
                <AutoColumn gap="4px">
                  {Boolean(trade) && (
                    <RowBetween align="center">
                      <span tw="text-gray-200 text-lg uppercase font-medium">
                        Price
                      </span>

                      <TradePrice
                        price={trade?.executionPrice}
                        setShowInverted={setShowInverted}
                        showInverted={showInverted}
                      />
                    </RowBetween>
                  )}
                  {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                    <RowBetween align="center">
                      <ClickableText
                        color={theme`colors.gray.200`}
                        fontSize={12}
                        fontWeight={500}
                        onClick={toggleSettings}
                      >
                        Slippage Tolerance
                      </ClickableText>
                      <ClickableText
                        color={'#FFF'}
                        fontSize={12}
                        fontWeight={500}
                        onClick={toggleSettings}
                      >
                        {allowedSlippage / 100}%
                      </ClickableText>
                    </RowBetween>
                  )}
                </AutoColumn>
              </Card>
            )}
          </AutoColumn>
          <div tw="mt-3 flex justify-center">
            <div tw="w-full">
              {!account ? (
                <ButtonLight onClick={toggleWalletModal}>
                  CONNECT WALLET
                </ButtonLight>
              ) : showWrap ? (
                <ButtonPrimary
                  disabled={Boolean(wrapInputError)}
                  onClick={onWrap}
                >
                  {wrapInputError ??
                    (wrapType === WrapType.WRAP
                      ? 'WRAP'
                      : wrapType === WrapType.UNWRAP
                      ? 'UNWRAP'
                      : null)}
                </ButtonPrimary>
              ) : noRoute && userHasSpecifiedInputOutput ? (
                <ButtonError disabled>
                  <span tw="text-xl">
                    Insufficient liquidity for this trade.
                  </span>
                </ButtonError>
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
                    <span tw="text-xl">
                      {approval === ApprovalState.PENDING ? (
                        <RowBetween>
                          <span tw="mr-1">Approving</span>{' '}
                          <ClipLoader
                            color={theme`colors.dark.400`}
                            size={16}
                          />
                        </RowBetween>
                      ) : approvalSubmitted &&
                        approval === ApprovalState.APPROVED ? (
                        'Approved'
                      ) : (
                        'Approve ' + currencies[Field.INPUT]?.symbol
                      )}
                    </span>
                  </ButtonConfirmed>
                  <ButtonError
                    disabled={
                      !isValid ||
                      approval !== ApprovalState.APPROVED ||
                      (priceImpactSeverity > 3 && !isExpertMode)
                    }
                    error={isValid && priceImpactSeverity > 2}
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
                    <span tw="text-xl">
                      {priceImpactSeverity > 3 && !isExpertMode
                        ? 'PRICE IMPACT HIGH'
                        : `SWAP${priceImpactSeverity > 2 ? ' ANYWAY' : ''}`}
                    </span>
                  </ButtonError>
                </RowBetween>
              ) : (
                <ButtonError
                  css={[
                    !(
                      !isValid ||
                      (priceImpactSeverity > 3 && !isExpertMode) ||
                      !!swapCallbackError
                    ) &&
                      tw`hover:bg-dark-900 hover:text-yellow-400 hover:border-yellow-400`,
                  ]}
                  disabled={
                    !isValid ||
                    (priceImpactSeverity > 3 && !isExpertMode) ||
                    !!swapCallbackError
                  }
                  error={
                    isValid && priceImpactSeverity > 2 && !swapCallbackError
                  }
                  id="swap-button"
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
                  <span tw="text-xl">
                    {swapInputError
                      ? swapInputError
                      : priceImpactSeverity > 3 && !isExpertMode
                      ? 'Price Impact Too High'
                      : `SWAP${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                  </span>
                </ButtonError>
              )}
              {showApproveFlow && (
                <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
              )}
              {isExpertMode && swapErrorMessage ? (
                <SwapCallbackError error={swapErrorMessage} />
              ) : null}
            </div>
          </div>
        </div>

        <AdvancedSwapDetailsDropdown trade={trade} />
      </div>
    </div>
  );
};

export default Swap;
