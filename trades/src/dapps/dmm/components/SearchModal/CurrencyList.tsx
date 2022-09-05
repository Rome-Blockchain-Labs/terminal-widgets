import 'twin.macro';

import {
  Currency,
  CurrencyAmount,
  currencyEquals,
  ETHER,
  Token,
} from '@dynamic-amm/sdk';
import { useWeb3React } from '@romeblockchain/wallet';
import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useMemo,
} from 'react';
import { FixedSizeList } from 'react-window';
import { Text } from 'rebass';
import styled from 'styled-components';

import TokenListLogo from '../../assets/svg/tokenlist.svg';
import { LightGreyCard } from '../../components/Card';
import QuestionHelper from '../../components/QuestionHelper';
import { useIsUserAddedToken } from '../../hooks/Tokens';
import { useCombinedActiveList } from '../../state/lists/hooks';
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo';
import { useCurrencyBalances } from '../../state/wallet/hooks';
import { TYPE } from '../../theme';
import { isAddress, isTokenOnList } from '../../utils';
import { useCurrencyConvertedToNative } from '../../utils/dmm';
import { wrappedCurrency } from '../../utils/wrappedCurrency';
import Column from '../Column';
import CurrencyLogo from '../CurrencyLogo';
import Loader from '../Loader';
import { RowBetween, RowFixed } from '../Row';
import { MouseoverTooltip } from '../Tooltip';
import ImportRow from './ImportRow';
import { MenuItem } from './styleds';

function currencyKey(currency: Currency): string {
  return currency instanceof Token
    ? currency.address
    : currency === ETHER
    ? 'ETHER'
    : '';
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`;

const Tag = styled.div`
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`;

const FixedContentRow = styled.div`
  display: grid;
  grid-gap: 16px;
  align-items: center;
`;

function Balance({ balance }: { balance: CurrencyAmount }) {
  return (
    <StyledBalanceText title={balance.toExact()}>
      {balance.toSignificant(10)}
    </StyledBalanceText>
  );
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TokenListLogoWrapper = styled.img`
  height: 20px;
`;

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />;
  }

  const tags = currency.tags;
  if (!tags || tags.length === 0) return <span />;

  const tag = tags[0];

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ description, name }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  );
}

function CurrencyRow({
  currency,
  currencyBalance,
  isSelected,
  onSelect,
  otherSelected,
  style,
}: {
  currency: Currency;
  currencyBalance: CurrencyAmount;
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
  style: CSSProperties;
}) {
  const { account } = useWeb3React();
  const key = currencyKey(currency);
  const selectedTokenList = useCombinedActiveList();
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency);
  const customAdded = useIsUserAddedToken(currency);
  // const balance = useCurrencyBalance(account ?? undefined, currency)
  const balance = currencyBalance;

  // const showCurrency = currency === ETHER && !!chainId && [137, 800001].includes(chainId) ? WETH[chainId] : currency
  const nativeCurrency = useCurrencyConvertedToNative(currency || undefined);
  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      className={`token-item-${key}`}
      disabled={isSelected}
      selected={otherSelected}
      style={style}
      onClick={() => (isSelected ? null : onSelect())}
    >
      <CurrencyLogo currency={currency} size={'24px'} />
      <Column>
        <span tw="font-bold text-white text-xl ml-1">
          {nativeCurrency?.symbol}
        </span>
        <TYPE.darkGray fontSize={'12px'} fontWeight={300} ml="0px">
          {!isOnSelectedList && customAdded && '• Added by user'}
        </TYPE.darkGray>
      </Column>
      <TokenTags currency={currency} />
      <RowFixed style={{ justifySelf: 'flex-start' }}>
        <span tw="text-xl">
          {balance ? (
            <Balance balance={balance} />
          ) : account ? (
            <Loader />
          ) : null}
        </span>
      </RowFixed>
    </MenuItem>
  );
}

export default function CurrencyList({
  breakIndex,
  currencies,
  fixedListRef,
  height,
  inactiveTokens,
  onCurrencySelect,
  otherCurrency,
  selectedCurrency,
  setImportToken,
  showETH,
  showImportView,
}: {
  height: number;
  currencies: Currency[];
  inactiveTokens: Token[];
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherCurrency?: Currency | null;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
  showETH: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
  breakIndex: number | undefined;
}) {
  const { account, chainId } = useWeb3React();
  const itemCurrencies: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showETH
      ? [Currency.ETHER, ...currencies]
      : currencies;
    if (breakIndex !== undefined) {
      formatted = [
        ...formatted.slice(0, breakIndex),
        undefined,
        ...formatted.slice(breakIndex, formatted.length),
      ];
    }
    return formatted;
  }, [breakIndex, currencies, showETH]);
  const itemCurrencyBalances = useCurrencyBalances(
    account || undefined,
    itemCurrencies
  );
  const itemData = {
    currencies: itemCurrencies,
    currencyBalances: itemCurrencyBalances,
  };

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data.currencies[index];
      const currencyBalance: CurrencyAmount = data.currencyBalances[index];
      const isSelected = Boolean(
        selectedCurrency && currencyEquals(selectedCurrency, currency)
      );
      const otherSelected = Boolean(
        otherCurrency && currencyEquals(otherCurrency, currency)
      );
      const handleSelect = () => onCurrencySelect(currency);

      const token = wrappedCurrency(currency, chainId);

      const showImport =
        inactiveTokens.length &&
        token &&
        inactiveTokens
          .map((inactiveToken) => inactiveToken.address)
          .includes(isAddress(token.address) || token.address);

      if (index === breakIndex || !data) {
        return (
          <FixedContentRow style={style}>
            <LightGreyCard borderRadius="8px" padding="8px 12px">
              <RowBetween>
                <RowFixed>
                  <TokenListLogoWrapper src={TokenListLogo} />
                  <span tw="text-base ml-1">
                    Expanded results from inactive Token Lists
                  </span>
                </RowFixed>
                <QuestionHelper text="Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists." />
              </RowBetween>
            </LightGreyCard>
          </FixedContentRow>
        );
      }

      if (showImport && token) {
        return (
          <ImportRow
            dim={true}
            setImportToken={setImportToken}
            showImportView={showImportView}
            style={style}
            token={token}
          />
        );
      } else {
        return (
          <CurrencyRow
            currency={currency}
            currencyBalance={currencyBalance}
            isSelected={isSelected}
            otherSelected={otherSelected}
            style={style}
            onSelect={handleSelect}
          />
        );
      }
    },
    [
      chainId,
      inactiveTokens,
      onCurrencySelect,
      otherCurrency,
      selectedCurrency,
      setImportToken,
      showImportView,
      breakIndex,
    ]
  );

  const itemKey = useCallback(
    (index: number, data: any) => currencyKey(data.currencies[index]),
    []
  );

  return (
    <FixedSizeList
      ref={fixedListRef as any}
      height={height}
      itemCount={itemData.currencies.length}
      itemData={itemData}
      itemKey={itemKey}
      itemSize={42}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
