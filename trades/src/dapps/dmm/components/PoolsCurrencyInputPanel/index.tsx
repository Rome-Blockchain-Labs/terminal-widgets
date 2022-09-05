import { Currency, Pair } from '@dynamic-amm/sdk';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg';
import { useCurrencyConvertedToNative } from '../../utils/dmm';
import CurrencyLogo from '../CurrencyLogo';
import DoubleCurrencyLogo from '../DoubleLogo';
import CurrencySearchModal from '../SearchModal/CurrencySearchModal';

const InputRow = styled.div<{ selected: boolean }>`
  ${tw`bg-dark-400 border border-gray-200`}
  align-items: center;
  padding: ${({ selected }) =>
    selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem'};
`;

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.25rem;
  font-size: 20px;
  font-weight: 500;

  border-radius: 4px;
  box-shadow: ${({ selected }) =>
    selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)'};
  outline: none;
  cursor: pointer;
  user-select: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
  }
`;

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledDropDown = styled(DropDown)`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke-width: 1.5px;
  }
`;

const InputPanel = styled.div`
  position: relative;
  border-radius: 4px;
  background-color: transparent;
  z-index: 1;
`;

const Container = styled.div`
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: transparent;
`;

const LogoNameWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${tw`text-xl`}
  ${({ active }) =>
    active
      ? '  margin: 0 0.25rem 0 0.75rem;'
      : '  margin: 0 0.25rem 0 0.25rem;'}
`;

interface CurrencyInputPanelProps {
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  pair?: Pair | null;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
}

export default function CurrencyInputPanel({
  currency,
  disableCurrencySelect = false,
  id,
  onCurrencySelect, // used for double token logo
  otherCurrency,
  pair = null,
  showCommonBases,
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const nativeCurrency = useCurrencyConvertedToNative(currency || undefined);
  return (
    <InputPanel id={id}>
      <Container>
        <InputRow
          selected={disableCurrencySelect}
          style={{ borderRadius: '8px', padding: '0' }}
        >
          <CurrencySelect
            className="open-currency-select-button"
            selected={!!currency}
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true);
              }
            }}
          >
            <Aligner>
              <LogoNameWrapper>
                {pair ? (
                  <DoubleCurrencyLogo
                    currency0={pair.token0}
                    currency1={pair.token1}
                    margin={true}
                    size={24}
                  />
                ) : currency ? (
                  <CurrencyLogo
                    currency={currency || undefined}
                    size={'24px'}
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
              </LogoNameWrapper>
              {!disableCurrencySelect && <StyledDropDown />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
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
  );
}
