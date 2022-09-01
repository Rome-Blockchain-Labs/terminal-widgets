import 'twin.macro';

import { TokenList } from '@uniswap/token-lists';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CheckCircle, Settings } from 'react-feather';
import { usePopper } from 'react-popper';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch, AppState } from '../../../../store';
import Card from '../../components/Card';
import { HIDE_LIST, UNSUPPORTED_LIST_URLS } from '../../constants/lists';
import { useListColor } from '../../hooks/useColor';
import { useFetchListCallback } from '../../hooks/useFetchListCallback';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import useToggle from '../../hooks/useToggle';
import {
  acceptListUpdate,
  disableList,
  enableList,
  removeList,
} from '../../state/lists/actions';
import {
  useActiveListUrls,
  useAllListsByChainId,
  useIsListActive,
} from '../../state/lists/hooks';
import { TYPE } from '../../theme';
import listVersionLabel from '../../utils/listVersionLabel';
import { parseENSAddress } from '../../utils/parseENSAddress';
import uriToHttp from '../../utils/uriToHttp';
import { ButtonEmpty, ButtonPrimary } from '../Button';
import Column, { AutoColumn } from '../Column';
import ListLogo from '../ListLogo';
import Row, { RowBetween, RowFixed } from '../Row';
import ListToggle from '../Toggle/ListToggle';
import { CurrencyModalView } from './CurrencySearchModal';
import { PaddedColumn, SearchInput, Separator, SeparatorDark } from './styleds';

const TOKEN_LIST_FAILED_VALIDATION = 'Token list failed validation';

const Wrapper = styled(Column)`
  width: 100%;
  height: 100%;
`;

const UnpaddedLinkStyledButton = styled.button`
  padding: 0;
  font-size: 1rem;
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
`;

const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 100;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;

  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);

  border-radius: 0.5rem;
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 8px;
  font-size: 1rem;
  text-align: left;
`;

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
`;

const StyledTitleText = styled.div<{ active: boolean }>`
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
`;

const StyledListUrlText = styled(TYPE.main)<{ active: boolean }>`
  font-size: 12px;
`;

const RowWrapper = styled(Row)<{ bgColor: string; active: boolean }>`
  transition: 200ms;
  align-items: center;
  padding: 1rem;
  border-radius: 20px;
`;

function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, '-')}`;
}

const ListRow = memo(function ListRow({ listUrl }: { listUrl: string }) {
  const listsByUrl = useSelector<
    AppState,
    AppState['dapps']['dmm']['lists']['byUrl']
  >((state) => state.dapps.dmm.lists.byUrl);
  const dispatch = useDispatch<AppDispatch>();
  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl];

  const listColor = useListColor(list?.logoURI);
  const isActive = useIsListActive(listUrl);

  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement>();
  const [popperElement, setPopperElement] = useState<HTMLDivElement>();

  const { attributes, styles } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'offset', options: { offset: [8, 8] } }],
    placement: 'auto',
    strategy: 'fixed',
  });

  useOnClickOutside(node, open ? toggle : undefined);

  const handleAcceptListUpdate = useCallback(() => {
    if (!pending) return;

    dispatch(acceptListUpdate(listUrl));
  }, [dispatch, listUrl, pending]);

  const handleRemoveList = useCallback(() => {
    if (
      window.prompt(
        'Please confirm you would like to remove this list by typing REMOVE'
      ) === 'REMOVE'
    ) {
      dispatch(removeList(listUrl));
    }
  }, [dispatch, listUrl]);

  const handleEnableList = useCallback(() => {
    dispatch(enableList(listUrl));
  }, [dispatch, listUrl]);

  const handleDisableList = useCallback(() => {
    dispatch(disableList(listUrl));
  }, [dispatch, listUrl]);

  if (!list || HIDE_LIST.includes(listUrl)) return null;

  return (
    <RowWrapper
      key={listUrl}
      active={isActive}
      bgColor={listColor}
      id={listUrlRowHTMLId(listUrl)}
    >
      {list.logoURI ? (
        <ListLogo
          alt={`${list.name} list logo`}
          logoURI={list.logoURI}
          size="40px"
          style={{ marginRight: '1rem' }}
        />
      ) : (
        <div style={{ height: '24px', marginRight: '1rem', width: '24px' }} />
      )}
      <Column style={{ flex: '1' }}>
        <Row>
          <StyledTitleText active={isActive}>{list.name}</StyledTitleText>
        </Row>
        <RowFixed mt="4px">
          <StyledListUrlText active={isActive} mr="6px">
            {list.tokens.length} tokens
          </StyledListUrlText>
          <StyledMenu ref={node as any}>
            <ButtonEmpty ref={setReferenceElement} padding="0" onClick={toggle}>
              <Settings size={12} />
            </ButtonEmpty>
            {open && (
              <PopoverContainer
                ref={setPopperElement as any}
                show={true}
                style={styles.popper}
                {...attributes.popper}
              >
                <div>{list && listVersionLabel(list.version)}</div>
                <SeparatorDark />
                <a href={`https://tokenlists.org/token-list?url=${listUrl}`}>
                  View list
                </a>
                <UnpaddedLinkStyledButton
                  disabled={Object.keys(listsByUrl).length === 1}
                  onClick={handleRemoveList}
                >
                  Remove list
                </UnpaddedLinkStyledButton>
                {pending && (
                  <UnpaddedLinkStyledButton onClick={handleAcceptListUpdate}>
                    Update list
                  </UnpaddedLinkStyledButton>
                )}
              </PopoverContainer>
            )}
          </StyledMenu>
        </RowFixed>
      </Column>
      <ListToggle
        bgColor={listColor}
        isActive={isActive}
        toggle={() => {
          isActive ? handleDisableList() : handleEnableList();
        }}
      />
    </RowWrapper>
  );
});

const ListContainer = styled.div`
  padding: 1rem;
  height: 100%;
  overflow: auto;
  padding-bottom: 80px;
`;

export function ManageLists({
  setImportList,
  setListUrl,
  setModalView,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
}) {
  const [listUrlInput, setListUrlInput] = useState<string>('');

  const lists = useAllListsByChainId();
  // sort by networkLogos but only if not visible
  const activeListUrls = useActiveListUrls();
  const [activeCopy, setActiveCopy] = useState<string[] | undefined>();
  useEffect(() => {
    if (!activeCopy && activeListUrls) {
      setActiveCopy(activeListUrls);
    }
  }, [activeCopy, activeListUrls]);

  const handleInput = useCallback((e) => {
    setListUrlInput(e.target.value);
  }, []);

  const fetchList = useFetchListCallback();

  const validUrl: boolean = useMemo(() => {
    return (
      uriToHttp(listUrlInput).length > 0 ||
      Boolean(parseENSAddress(listUrlInput))
    );
  }, [listUrlInput]);

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists);

    return listUrls
      .filter((listUrl) => {
        // only show loaded lists, hide unsupported lists
        return (
          Boolean(lists[listUrl].current) &&
          !Boolean(UNSUPPORTED_LIST_URLS.includes(listUrl))
        );
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1];
        const { current: l2 } = lists[u2];

        // first filter on networkLogos lists
        if (activeCopy?.includes(u1) && !activeCopy?.includes(u2)) {
          return -1;
        }
        if (!activeCopy?.includes(u1) && activeCopy?.includes(u2)) {
          return 1;
        }

        if (l1 && l2) {
          return l1.name.toLowerCase() < l2.name.toLowerCase()
            ? -1
            : l1.name.toLowerCase() === l2.name.toLowerCase()
            ? 0
            : 1;
        }
        if (l1) return -1;
        if (l2) return 1;
        return 0;
      });
  }, [lists, activeCopy]);

  // temporary fetched list for import flow
  const [tempList, setTempList] = useState<TokenList>();
  const [addError, setAddError] = useState<string | undefined>();

  useEffect(() => {
    async function fetchTempList() {
      fetchList(listUrlInput, false)
        .then((list) => setTempList(list))
        .catch((err: Error) => {
          if (err.message.includes(TOKEN_LIST_FAILED_VALIDATION)) {
            setAddError(TOKEN_LIST_FAILED_VALIDATION);
          } else {
            setAddError('Error importing list');
          }
        });
    }
    // if valid url, fetch details for card
    if (validUrl) {
      fetchTempList();
    } else {
      setTempList(undefined);
      listUrlInput !== '' && setAddError('Enter valid list location');
    }

    // reset error
    if (listUrlInput === '') {
      setAddError(undefined);
    }
  }, [fetchList, listUrlInput, validUrl]);

  // check if list is already imported
  const isImported = Object.keys(lists).includes(listUrlInput);

  // set list values and have parent modal switch to import list view
  const handleImport = useCallback(() => {
    if (!tempList) return;
    setImportList(tempList);
    setModalView(CurrencyModalView.importList);
    setListUrl(listUrlInput);
  }, [listUrlInput, setImportList, setListUrl, setModalView, tempList]);

  return (
    <Wrapper>
      <PaddedColumn gap="14px">
        <Row>
          <SearchInput
            id="list-add-input"
            placeholder={'https:// or ipfs:// or ENS name'}
            type="text"
            value={listUrlInput}
            onChange={handleInput}
          />
        </Row>
        {addError ? <span tw="text-xl text-red-400">{addError}</span> : null}
      </PaddedColumn>
      {tempList && (
        <PaddedColumn style={{ paddingTop: 0 }}>
          <Card padding="12px 20px">
            <RowBetween>
              <RowFixed>
                {tempList.logoURI && (
                  <ListLogo logoURI={tempList.logoURI} size="40px" />
                )}
                <AutoColumn gap="4px" style={{ marginLeft: '20px' }}>
                  <span>{tempList.name}</span>
                  <span tw="text-xl">{tempList.tokens.length} tokens</span>
                </AutoColumn>
              </RowFixed>
              {isImported ? (
                <RowFixed>
                  {/* <IconWrapper
                    marginRight={'10px'}
                    size="16px"
                    stroke={theme.text2}
                  > */}
                  <CheckCircle />
                  {/* </IconWrapper> */}
                  <span>Loaded</span>
                </RowFixed>
              ) : (
                <ButtonPrimary
                  padding="6px 8px"
                  tw="text-xl text-green-400"
                  width="fit-content"
                  onClick={handleImport}
                >
                  Import
                </ButtonPrimary>
              )}
            </RowBetween>
          </Card>
        </PaddedColumn>
      )}
      <Separator />
      <ListContainer>
        <AutoColumn gap="md">
          {sortedLists.map((listUrl) => (
            <ListRow key={listUrl} listUrl={listUrl} />
          ))}
        </AutoColumn>
      </ListContainer>
    </Wrapper>
  );
}
