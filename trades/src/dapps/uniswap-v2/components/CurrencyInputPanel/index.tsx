import { Currency, Pair } from '@rbl/velox-common/uniV2ClonesSDK';
import React, { useState } from 'react';
import tw, { styled, theme } from 'twin.macro';

import { NumericalInput } from '../../../../components/inputs';
import { RowBetween } from '../../../../components/row';
import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { getDefaultCurrencySymbol } from '../../../../utils';
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import CurrencyLogo from '../CurrencyLogo';
import DoubleCurrencyLogo from '../DoubleLogo';
import CurrencySearchModal from '../SearchModal/CurrencySearchModal';

const InputRow = tw.div`flex flex-nowrap items-center px-4 py-2`;

const CurrencySelect = tw.button`items-center text-xl font-bold text-white select-none`;

const LabelRow = tw.div`flex flex-nowrap items-center text-gray-200 text-lg pt-3 px-4`;

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  ${tw`mr-1 ml-2 h-1/3`}

  path {
    stroke: ${({ selected }) =>
      selected ? theme`colors.white` : theme`colors.gray.300`};
    ${tw`stroke-2`}
  }
`;

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${tw`mr-1 ml-2`}

  ${({ active }) => !active && tw`text-lg text-gray-300`}
`;

const StyledBalanceMax = tw.button`inline-flex items-center bg-yellow-400 h-4 text-sm rounded-md text-dark-700 px-2 font-medium mr-2`;

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
}

export default function CurrencyInputPanel({
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  hideInput = false,
  id,
  label = 'Input',
  onCurrencySelect,
  onMax,
  onUserInput,
  otherCurrency, // used for double token logo
  pair = null,
  showCommonBases,
  showMaxButton,
  value,
}: CurrencyInputPanelProps) {
  const { account } = useWallets();
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  );
  const [isSearchModalOpened, setIsSearchModalOpened] = useState(false);
  const currencySymbol = getDefaultCurrencySymbol(currency);

  return (
    <div id={id} tw="relative">
      <div tw="rounded-lg border border-solid border-gray-300">
        {onCurrencySelect && (
          <CurrencySearchModal
            isOpen={isSearchModalOpened}
            otherSelectedCurrency={otherCurrency}
            selectedCurrency={currency}
            showCommonBases={showCommonBases}
            onCurrencySelect={onCurrencySelect}
            onDismiss={() => setIsSearchModalOpened(false)}
          />
        )}
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <span tw="hover:cursor-pointer">{label}</span>

              {account && (
                <span tw="hover:cursor-pointer font-bold" onClick={onMax}>
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? 'Balance: ' + selectedCurrencyBalance?.toSignificant(6)
                    : ' -'}
                </span>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={(val) => {
                  onUserInput(val);
                }}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
              )}
            </>
          )}
          <CurrencySelect
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect && onCurrencySelect) {
                setIsSearchModalOpened(true);
              }
            }}
          >
            <div tw="flex justify-between items-center">
              {pair ? (
                <DoubleCurrencyLogo
                  currency0={pair.token0}
                  currency1={pair.token1}
                  margin={true}
                  size={14}
                />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'14px'} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {getDefaultCurrencySymbol(pair?.token0)}:
                  {getDefaultCurrencySymbol(pair?.token1)}
                </StyledTokenName>
              ) : (
                <StyledTokenName
                  active={Boolean(
                    currency && getDefaultCurrencySymbol(currency)
                  )}
                  className="token-symbol-container"
                >
                  {(currency && currencySymbol && currencySymbol.length > 20
                    ? currencySymbol.slice(0, 4) +
                      '...' +
                      currencySymbol.slice(
                        currencySymbol.length - 5,
                        currencySymbol.length
                      )
                    : currencySymbol) || 'Select a token'}
                </StyledTokenName>
              )}
              {!disableCurrencySelect && (
                <StyledDropDown selected={!!currency} />
              )}
            </div>
          </CurrencySelect>
        </InputRow>
      </div>
    </div>
  );
}
