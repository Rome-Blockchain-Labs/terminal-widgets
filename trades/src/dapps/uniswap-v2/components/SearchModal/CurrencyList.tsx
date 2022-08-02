import {
  Currency,
  CurrencyAmount,
  currencyEquals,
  ETHER,
  Token,
} from '@rbl/velox-common/uniV2ClonesSDK';
import { useWeb3React } from '@romeblockchain/wallet';
import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { ClipLoader } from 'react-spinners';
import { FixedSizeGrid } from 'react-window';
import { Text } from 'rebass';
import { styled } from 'twin.macro';

import { LinkStyledButton } from '../../../../components/buttons';
import Column from '../../../../components/column';
import { RowFixed } from '../../../../components/row';
import TokenSymbol from '../../../../components/TokenSymbol';
import { MouseoverTooltip } from '../../../../components/tooltip';
import { getNativeTokenFromNetworkName } from '../../../../constants/networkExchange';
import { DappContext } from '../../../../contexts';
import { WrappedTokenInfo } from '../../../../types';
import { getDefaultCurrencySymbol, isTokenOnList } from '../../../../utils';
import { useIsUserAddedToken } from '../../hooks/Tokens';
import { useSelectedTokenList } from '../../state/lists/hooks';
import {
  useAddUserToken,
  useRemoveUserAddedToken,
} from '../../state/user/hooks';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import { TYPE } from '../../theme';
import CurrencyLogo from '../CurrencyLogo';
import { FadedSpan, MenuItem } from './styleds';

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
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
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

function Balance({ balance }: { balance: CurrencyAmount }) {
  return (
    <StyledBalanceText title={balance.toExact()}>
      {balance.toSignificant(4)}
    </StyledBalanceText>
  );
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
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

function CurrencyCell({
  currency,
  isSelected,
  onSelect,
  otherSelected,
  style,
}: {
  currency: Currency & { isNative?: boolean };
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
  style: CSSProperties;
}) {
  const { account, chainId } = useWeb3React();
  const key = currencyKey(currency);
  const selectedTokenList = useSelectedTokenList();
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency);
  const customAdded = useIsUserAddedToken(currency);
  const balance = useCurrencyBalance(account ?? undefined, currency);

  const removeToken = useRemoveUserAddedToken();
  const addToken = useAddUserToken();

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
        <TokenSymbol>{getDefaultCurrencySymbol(currency)}</TokenSymbol>
        <FadedSpan>
          {!currency.isNative && !isOnSelectedList && customAdded ? (
            <TYPE.main fontWeight={500}>
              Added by user
              <LinkStyledButton
                onClick={(event) => {
                  event.stopPropagation();
                  if (chainId && currency instanceof Token)
                    removeToken(chainId, currency.address);
                }}
              >
                (Remove)
              </LinkStyledButton>
            </TYPE.main>
          ) : null}
          {!currency.isNative && !isOnSelectedList && !customAdded ? (
            <TYPE.main fontWeight={500}>
              Found by address
              <LinkStyledButton
                onClick={(event) => {
                  event.stopPropagation();
                  if (currency instanceof Token) addToken(currency);
                }}
              >
                (Add)
              </LinkStyledButton>
            </TYPE.main>
          ) : null}
        </FadedSpan>
      </Column>
      <TokenTags currency={currency} />
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {balance ? (
          <Balance balance={balance} />
        ) : account ? (
          <ClipLoader size={16} />
        ) : null}
      </RowFixed>
    </MenuItem>
  );
}

export default function CurrencyList({
  currencies,
  fixedListRef,
  height,
  onCurrencySelect,
  otherCurrency,
  selectedCurrency,
  showETH,
}: {
  height: number;
  currencies: Currency[];
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherCurrency?: Currency | null;
  fixedListRef?: MutableRefObject<FixedSizeGrid | undefined>;
  showETH: boolean;
}) {
  const { network } = useContext(DappContext);
  const itemData = useMemo(
    () =>
      showETH
        ? [getNativeTokenFromNetworkName(network), ...currencies]
        : currencies,
    [currencies, showETH, network]
  );

  const Cell = useCallback(
    ({ columnIndex, data, rowIndex, style }) => {
      const dataIndex = rowIndex * 2 + columnIndex;

      if (dataIndex >= data.length) {
        return null;
      }

      const currency: Currency = data[dataIndex];
      const isSelected = Boolean(
        selectedCurrency && currencyEquals(selectedCurrency, currency)
      );
      const otherSelected = Boolean(
        otherCurrency && currencyEquals(otherCurrency, currency)
      );
      const handleSelect = () => onCurrencySelect(currency);
      return (
        <CurrencyCell
          currency={currency}
          isSelected={isSelected}
          otherSelected={otherSelected}
          style={style}
          onSelect={handleSelect}
        />
      );
    },
    [onCurrencySelect, otherCurrency, selectedCurrency]
  );

  const itemKey = useCallback(({ columnIndex, data, rowIndex }) => {
    return currencyKey(data[rowIndex * 2 + columnIndex]);
  }, []);

  return (
    <FixedSizeGrid
      ref={fixedListRef as any}
      columnCount={2}
      columnWidth={190}
      height={height}
      itemData={itemData}
      itemKey={itemKey}
      rowCount={itemData.length / 2}
      rowHeight={56}
      width={400}
    >
      {Cell}
    </FixedSizeGrid>
  );
}
