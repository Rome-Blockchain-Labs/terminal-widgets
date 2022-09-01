import { Currency, ETHER, Token } from '@dynamic-amm/sdk';
import { useWeb3React } from '@romeblockchain/wallet';
import React, {
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Edit } from 'react-feather';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components';
import tw, { theme } from 'twin.macro';

import { CloseButton } from '../../../../components/buttons';
import {
  useAllTokens,
  useIsTokenActive,
  useIsUserAddedToken,
  useSearchInactiveTokenLists,
  useToken,
} from '../../hooks/Tokens';
import useDebounce from '../../hooks/useDebounce';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import useToggle from '../../hooks/useToggle';
import { isAddress } from '../../utils';
import Column from '../Column';
import QuestionHelper from '../QuestionHelper';
import Row, { RowBetween, RowFixed } from '../Row';
import CommonBases from './CommonBases';
import CurrencyList from './CurrencyList';
import { filterTokens } from './filtering';
import ImportRow from './ImportRow';
import SortButton from './SortButton';
import { useTokenComparator } from './sorting';
import { PaddedColumn, SearchInput, Separator } from './styleds';

const ContentWrapper = styled(Column)`
  flex: 1 1;
  position: relative;
  width: 600px;
  ${tw`bg-green-700 rounded`}
`;

const Footer = styled.div`
  width: 100%;
  border-radius: 20px;
  ${tw`py-4`}
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

interface CurrencySearchProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  showManageView: () => void;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
}

export function CurrencySearch({
  isOpen,
  onCurrencySelect,
  onDismiss,
  otherSelectedCurrency,
  selectedCurrency,
  setImportToken,
  showCommonBases,
  showImportView,
  showManageView,
}: CurrencySearchProps) {
  const { chainId } = useWeb3React();

  const fixedList = useRef<FixedSizeList>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedQuery = useDebounce(searchQuery, 200);

  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false);
  const allTokens = useAllTokens();

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery);
  const searchToken = useToken(searchQuery);

  const searchTokenIsAdded = useIsUserAddedToken(searchToken);
  const isSearchTokenActive = useIsTokenActive(searchToken);

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
        (token) => token.symbol?.toLowerCase() === symbolMatch[0]
      ),
      ...sorted.filter(
        (token) => token.symbol?.toLowerCase() !== symbolMatch[0]
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
    fixedList.current?.scrollTo(0);
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim();
        if (s === 'eth') {
          handleCurrencySelect(ETHER);
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() ===
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

  // menu ui
  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  useOnClickOutside(node, open ? toggle : undefined);

  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens: Token[] =
    useSearchInactiveTokenLists(debouncedQuery);

  return (
    <ContentWrapper>
      <PaddedColumn gap="14px">
        <RowBetween>
          <div tw="text-xl text-green-400 font-bold flex items-center">
            SELECT A TOKEN
            <QuestionHelper
              text={
                'Find a token by searching for its name or symbol or by pasting its address below.'
              }
            />
          </div>
          <CloseButton color={theme`colors.green.400`} onClick={onDismiss} />
        </RowBetween>
        <SearchInput
          ref={inputRef as RefObject<HTMLInputElement>}
          id="token-search-input"
          placeholder={'Search name or paste address'}
          type="text"
          value={searchQuery}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
        <div tw="flex items-baseline">
          {showCommonBases && (
            <CommonBases
              chainId={chainId}
              selectedCurrency={selectedCurrency}
              onSelect={handleCurrencySelect}
            />
          )}
          <div tw="text-green-400 w-full h-full overflow-hidden">
            <div tw="border-b border-gray-400 flex items-center pb-1">
              <span tw="text-xl">TOKEN NAME</span>
              <SortButton
                ascending={invertSearchOrder}
                toggleSortOrder={() => setInvertSearchOrder((iso) => !iso)}
              />
            </div>
            {searchToken && !searchTokenIsAdded && !isSearchTokenActive ? (
              <Column style={{ height: '100%', padding: '20px 0' }}>
                <ImportRow
                  setImportToken={setImportToken}
                  showImportView={showImportView}
                  token={searchToken}
                />
              </Column>
            ) : filteredSortedTokens?.length > 0 ||
              filteredInactiveTokens?.length > 0 ? (
              <div tw="w-full h-full">
                <AutoSizer disableWidth>
                  {({ height }) => (
                    <CurrencyList
                      breakIndex={
                        filteredInactiveTokens.length && filteredSortedTokens
                          ? filteredSortedTokens.length
                          : undefined
                      }
                      currencies={
                        filteredInactiveTokens.length
                          ? filteredSortedTokens.concat(filteredInactiveTokens)
                          : filteredSortedTokens
                      }
                      fixedListRef={fixedList}
                      height={height}
                      inactiveTokens={filteredInactiveTokens}
                      otherCurrency={otherSelectedCurrency}
                      selectedCurrency={selectedCurrency}
                      setImportToken={setImportToken}
                      showETH={showETH}
                      showImportView={showImportView}
                      onCurrencySelect={handleCurrencySelect}
                    />
                  )}
                </AutoSizer>
              </div>
            ) : (
              <Column style={{ height: '100%', padding: '20px' }}>
                <span tw="text-xl">No results found.</span>
              </Column>
            )}
          </div>
        </div>
      </PaddedColumn>

      <Separator />

      <Footer>
        <Row justify="center">
          <button className="list-token-manage-button" onClick={showManageView}>
            <RowFixed tw="text-green-400">
              <Edit />
              {/* <IconWrapper marginRight="6px" size="16px"></IconWrapper> */}
              <span tw="text-xl">MANAGE TOKEN LIST</span>
            </RowFixed>
          </button>
        </Row>
      </Footer>
    </ContentWrapper>
  );
}
