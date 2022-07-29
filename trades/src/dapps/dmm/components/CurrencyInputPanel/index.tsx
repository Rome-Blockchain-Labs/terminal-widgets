// @ts-ignore
import { Currency, CurrencyAmount, Pair } from '@dynamic-amm/sdk';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Flex, Text } from 'rebass';
import styled from 'styled-components';
import tw from 'twin.macro';

import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg';
import { ReactComponent as SwitchIcon } from '../../assets/svg/switch.svg';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import { useCurrencyConvertedToNative } from '../../utils/dmm';
import { ButtonEmpty } from '../Button';
import Card from '../Card';
import CurrencyLogo from '../CurrencyLogo';
import DoubleCurrencyLogo from '../DoubleLogo';
import Wallet from '../Icons/Wallet';
import { Input as NumericalInput } from '../NumericalInput';
import CurrencySearchModal from '../SearchModal/CurrencySearchModal';

const InputRow = tw.div`flex flex-nowrap items-center px-4 py-2`;

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  height: 35%;

  path {
    stroke-width: 1.5px;
  }
`;

const StyledSwitchIcon = styled(SwitchIcon)<{ selected: boolean }>`
  height: 35%;

  path {
    stroke-width: 1.5px;
  }
`;

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;

  ${tw`text-xl font-semibold`}

  border-radius: 4px;
  box-shadow: ${({ selected }) =>
    selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)'};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
  }
  :hover ${StyledDropDown}, :focus ${StyledDropDown} {
    path {
      stroke-width: 1.5px;
    }
  }
`;
const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InputPanel = styled.div<{ hideInput?: boolean }>`
  position: relative;
  z-index: 1;
`;

const Container = styled.div<{ selected: boolean; hideInput: boolean }>`
  border-radius: 8px;

  padding: ${({ selected }) =>
    selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem'};
`;

const StyledTokenName = styled.span<{ active?: boolean; fontSize?: string }>`
  margin: 0 0.375rem 0 0.5rem;
  ${tw`text-xl`}
`;

const StyledBalanceMax = styled.button`
  height: 18px;

  border: none;
  border-radius: 0.125rem;
  font-size: 0.625rem;
  font-weight: 500;
  cursor: pointer;

  :hover {
  }
  :focus {
    outline: none;
  }
`;

const Card2 = styled(Card)<{ balancePosition: string }>`
  padding: 0 0.25rem 0.5rem;
  text-align: ${({ balancePosition }) => `${balancePosition}`};
`;

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  positionMax?: 'inline' | 'top';
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  onSwitchCurrency?: () => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  disabledInput?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
  customBalanceText?: string;
  balancePosition?: string;
  hideLogo?: boolean;
  fontSize?: string;
  customNode?: ReactNode;
  estimatedUsd?: string;
  isSwitchMode?: boolean;
}

export default function CurrencyInputPanel({
  balancePosition = 'right',
  currency,
  customNode,
  disableCurrencySelect = false,
  disabledInput = false,
  estimatedUsd,
  fontSize,
  hideBalance = false,
  hideInput = false,
  hideLogo = false,
  id,
  isSwitchMode = false, // used for double token logo
  label = '',
  onCurrencySelect,
  onMax,
  onSwitchCurrency,
  onUserInput,
  otherCurrency,
  pair = null,
  positionMax = 'inline',
  showCommonBases,
  showMaxButton,
  value,
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { account, chainId } = useWallets();

  const [selectedCurrencyBalanceHasValue, setSelectedCurrencyBalanceHasValue] =
    useState<CurrencyAmount | undefined>(undefined);

  useEffect(() => {
    setSelectedCurrencyBalanceHasValue(undefined);
  }, [chainId]);

  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  );
  const selectedCurrencyBalanceDep = selectedCurrencyBalance?.toSignificant(20);

  useEffect(() => {
    if (!!selectedCurrencyBalance) {
      setSelectedCurrencyBalanceHasValue(selectedCurrencyBalance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrencyBalanceDep]);

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const nativeCurrency = useCurrencyConvertedToNative(currency || undefined);

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <Card2 balancePosition={balancePosition} borderRadius={'20px'}>
          <Flex
            alignItems="center"
            justifyContent={label ? 'space-between' : 'end'}
          >
            {label && (
              <Text fontSize={12} fontWeight={500}>
                {label}:
              </Text>
            )}
          </Flex>
        </Card2>
      )}
      <InputPanel hideInput={hideInput} id={id} tw="bg-dark-600 rounded-xl">
        <Container hideInput={hideInput} selected={disableCurrencySelect}>
          {!hideBalance && (
            <Flex
              alignItems="center"
              fontSize="12px"
              justifyContent="space-between"
              marginBottom="8px"
            >
              {showMaxButton && positionMax === 'top' && currency && account ? (
                <ButtonEmpty padding="0" width="fit-content" onClick={onMax}>
                  Select Max
                </ButtonEmpty>
              ) : (
                <div />
              )}
              <Flex>
                <Wallet />
                <span tw="text-xl ml-1 font-medium">
                  {selectedCurrencyBalanceHasValue?.toSignificant(10) || 0}
                </span>
              </Flex>
            </Flex>
          )}
          <InputRow
            style={hideInput ? { borderRadius: '8px', padding: '0' } : {}}
          >
            {!hideInput && (
              <>
                <NumericalInput
                  className="token-amount-input"
                  disabled={disabledInput}
                  value={value}
                  onUserInput={(val) => {
                    onUserInput(val);
                  }}
                />
                {estimatedUsd ? (
                  <span tw="text-base font-medium">~{estimatedUsd}</span>
                ) : (
                  account &&
                  currency &&
                  showMaxButton &&
                  positionMax === 'inline' && (
                    <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
                  )
                )}
              </>
            )}
            <CurrencySelect
              className="open-currency-select-button"
              selected={!!currency}
              onClick={() => {
                if (!disableCurrencySelect && !isSwitchMode) {
                  setModalOpen(true);
                } else if (
                  !disableCurrencySelect &&
                  isSwitchMode &&
                  onSwitchCurrency
                ) {
                  onSwitchCurrency();
                }
              }}
            >
              <Aligner>
                {hideLogo ? null : pair ? (
                  <DoubleCurrencyLogo
                    currency0={pair.token0}
                    currency1={pair.token1}
                    margin={true}
                    size={24}
                  />
                ) : currency ? (
                  <CurrencyLogo
                    currency={currency || undefined}
                    size={'18px'}
                  />
                ) : null}
                {pair ? (
                  <StyledTokenName className="pair-name-container">
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </StyledTokenName>
                ) : (
                  <StyledTokenName
                    active={Boolean(currency && currency.symbol)}
                    className="token-symbol-container"
                    fontSize={fontSize}
                  >
                    {(nativeCurrency &&
                    nativeCurrency.symbol &&
                    nativeCurrency.symbol.length > 20
                      ? nativeCurrency.symbol.slice(0, 4) +
                        '...' +
                        nativeCurrency.symbol.slice(
                          nativeCurrency.symbol.length - 5,
                          nativeCurrency.symbol.length
                        )
                      : nativeCurrency?.symbol) || 'Select a token'}
                  </StyledTokenName>
                )}
                {!disableCurrencySelect && !isSwitchMode && (
                  <StyledDropDown selected={!!currency} />
                )}
                {!disableCurrencySelect && isSwitchMode && (
                  <StyledSwitchIcon selected={!!currency} />
                )}
              </Aligner>
            </CurrencySelect>
          </InputRow>
          {customNode}
        </Container>
        {!disableCurrencySelect && !isSwitchMode && onCurrencySelect && (
          <CurrencySearchModal
            isOpen={modalOpen}
            otherSelectedCurrency={otherCurrency}
            selectedCurrency={currency}
            showCommonBases={showCommonBases}
            onCurrencySelect={onCurrencySelect}
            onDismiss={handleDismissSearch}
          />
        )}
      </InputPanel>
    </div>
  );
}
