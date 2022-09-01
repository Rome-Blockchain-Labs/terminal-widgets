import 'twin.macro';

import { Currency, ETHER, Token } from '@rbl/velox-common/uniV2ClonesSDK';
import React, {
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid } from 'react-window';

import { CloseButton, LinkStyledButton } from '../../../../components/buttons';
import Card from '../../../../components/card';
import Column from '../../../../components/column';
import QuestionHelper from '../../../../components/questionHelper';
import Row, { RowBetween } from '../../../../components/row';
import { getDefaultCurrencySymbol, isAddress } from '../../../../utils';
import { useAllTokens, useToken } from '../../hooks/Tokens';
import { useSelectedListInfo } from '../../state/lists/hooks';
import ListLogo from '../ListLogo';
import CurrencyList from './CurrencyList';
import { filterTokens } from './filtering';
import SortButton from './SortButton';
import { useTokenComparator } from './sorting';
import { PaddedColumn, SearchInput, Separator } from './styleds';

interface CurrencySearchProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  onChangeList: () => void;
}

export function CurrencySearch({
  isOpen,
  onChangeList,
  onCurrencySelect,
  onDismiss,
  otherSelectedCurrency,
  selectedCurrency,
  showCommonBases,
}: CurrencySearchProps) {
  const fixedList = useRef<FixedSizeGrid>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false);
  const allTokens = useAllTokens();

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery);
  const searchToken = useToken(searchQuery);

  const showETH: boolean = useMemo(() => {
    const s = searchQuery.toLowerCase().trim();
    return s === '' || s === 'e' || s === 'et' || s === 'eth';
  }, [searchQuery]);

  const tokenComparator = useTokenComparator(invertSearchOrder);

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : [];
    return filterTokens(Object.values(allTokens), searchQuery);
  }, [isAddressSearch, searchToken, allTokens, searchQuery]);

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken];
    const sorted = filteredTokens.sort(tokenComparator);
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0);
    if (symbolMatch.length > 1) return sorted;

    return [
      ...(searchToken ? [searchToken] : []),
      // sort any exact symbol matches first
      ...sorted.filter(
        (token) =>
          getDefaultCurrencySymbol(token)?.toLowerCase() === symbolMatch[0]
      ),
      ...sorted.filter(
        (token) =>
          getDefaultCurrencySymbol(token)?.toLowerCase() !== symbolMatch[0]
      ),
    ];
  }, [filteredTokens, searchQuery, searchToken, tokenComparator]);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect]
  );

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('');
  }, [isOpen]);

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
    fixedList.current?.scrollTo({ scrollLeft: 0, scrollTop: 0 });
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim();
        if (s === 'eth') {
          handleCurrencySelect(ETHER);
        } else if (filteredSortedTokens.length > 0) {
          if (
            getDefaultCurrencySymbol(filteredSortedTokens[0])?.toLowerCase() ===
              searchQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0]);
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, searchQuery]
  );

  const selectedListInfo = useSelectedListInfo();

  return (
    <Column style={{ flex: '1 1', width: '100%' }}>
      <PaddedColumn gap="8px">
        <RowBetween>
          <div tw="text-xl text-yellow-400 flex items-center">
            SELECT A TOKEN
            <QuestionHelper text="Find a token by searching for its name or symbol or by pasting its address below." />
          </div>
          <CloseButton onClick={onDismiss} />
        </RowBetween>
        <SearchInput
          ref={inputRef as RefObject<HTMLInputElement>}
          placeholder="Search name or paste address"
          type="text"
          value={searchQuery}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
        <RowBetween>
          <span tw="text-yellow-400 text-xl">TOKEN NAME</span>
          <SortButton
            ascending={invertSearchOrder}
            toggleSortOrder={() => setInvertSearchOrder((iso) => !iso)}
          />
        </RowBetween>
      </PaddedColumn>

      <Separator tw="bg-gray-300" />

      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CurrencyList
              currencies={filteredSortedTokens}
              fixedListRef={fixedList}
              height={height}
              otherCurrency={otherSelectedCurrency}
              selectedCurrency={selectedCurrency}
              showETH={showETH}
              onCurrencySelect={handleCurrencySelect}
            />
          )}
        </AutoSizer>
      </div>

      <Separator tw="bg-gray-300" />
      <Card>
        <RowBetween>
          {selectedListInfo.current ? (
            <Row>
              {selectedListInfo.current.logoURI ? (
                <ListLogo
                  alt={`${selectedListInfo.current.name} list logo`}
                  logoURI={selectedListInfo.current.logoURI}
                  style={{ marginRight: 12 }}
                />
              ) : null}
              <span
                id="currency-search-selected-list-name"
                tw="text-xl font-semibold text-gray-200"
              >
                {selectedListInfo.current.name}
              </span>
            </Row>
          ) : null}
          <LinkStyledButton
            id="currency-search-change-list-button"
            tw="text-xl text-yellow-400 font-medium"
            onClick={onChangeList}
          >
            {selectedListInfo.current ? 'Change' : 'Select a list'}
          </LinkStyledButton>
        </RowBetween>
      </Card>
    </Column>
  );
}
