import 'twin.macro';

import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'react-feather';
import { usePopper } from 'react-popper';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';

import {
  ButtonOutlined,
  ButtonPrimary,
  ButtonSecondary,
  CloseButton,
  LinkStyledButton,
} from '../../../../components/buttons';
import Column from '../../../../components/column';
import { ExternalLink } from '../../../../components/links';
import QuestionHelper from '../../../../components/questionHelper';
import Row, { RowBetween } from '../../../../components/row';
import { useToggle } from '../../../../hooks';
import {
  listVersionLabel,
  parseENSAddress,
  uriToHttp,
} from '../../../../utils';
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg';
import { useFetchListCallback } from '../../hooks/useFetchListCallback';
import { AppDispatch, AppState } from '../../state';
import {
  acceptListUpdate,
  removeList,
  selectList,
} from '../../state/lists/actions';
import { useSelectedListUrl } from '../../state/lists/hooks';
import { TYPE } from '../../theme';
import ListLogo from '../ListLogo';
import { PaddedColumn, SearchInput, Separator, SeparatorDark } from './styleds';

const UnpaddedLinkStyledButton = styled(LinkStyledButton)`
  padding: 0;
  font-size: 1rem;
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
`;

const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 100;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  color: ${({ theme }) => theme.text2};
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

const StyledListUrlText = styled.div`
  max-width: 160px;
  opacity: 0.6;
  margin-right: 0.5rem;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function ListOrigin({ listUrl }: { listUrl: string }) {
  const ensName = useMemo(() => parseENSAddress(listUrl)?.ensName, [listUrl]);
  const host = useMemo(() => {
    if (ensName) return undefined;
    const lowerListUrl = listUrl.toLowerCase();
    if (
      lowerListUrl.startsWith('ipfs://') ||
      lowerListUrl.startsWith('ipns://')
    ) {
      return listUrl;
    }
    try {
      const url = new URL(listUrl);
      return url.host;
    } catch (error) {
      return undefined;
    }
  }, [listUrl, ensName]);
  return <>{ensName ?? host}</>;
}

function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, '-')}`;
}

const ListRow = memo(function ListRow({
  listUrl,
  onBack,
}: {
  listUrl: string;
  onBack: () => void;
}) {
  const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>(
    (state) => state.lists.byUrl
  );
  const selectedListUrl = useSelectedListUrl();
  const dispatch = useDispatch<AppDispatch>();
  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl];

  const isSelected = listUrl === selectedListUrl;

  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement | null>(null);
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement>();
  const [popperElement, setPopperElement] = useState<HTMLDivElement>();

  const { attributes, styles } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'offset', options: { offset: [8, 8] } }],
    placement: 'auto',
    strategy: 'fixed',
  });

  useOnClickOutside(node, () => {
    if (open) {
      toggle();
    }
  });

  const selectThisList = useCallback(() => {
    if (isSelected) return;
    dispatch(selectList(listUrl));
    onBack();
  }, [dispatch, isSelected, listUrl, onBack]);

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

  if (!list) return null;

  return (
    <Row
      key={listUrl}
      align="center"
      id={listUrlRowHTMLId(listUrl)}
      padding="16px"
    >
      {list.logoURI ? (
        <ListLogo
          alt={`${list.name} list logo`}
          logoURI={list.logoURI}
          style={{ marginRight: '1rem' }}
        />
      ) : (
        <div style={{ height: '24px', marginRight: '1rem', width: '24px' }} />
      )}
      <Column style={{ flex: '1' }}>
        <Row>
          {/* <Text
            fontSize={16}
            fontWeight={isSelected ? 500 : 400}
            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          > */}
          <span tw="text-xl">{list.name}</span>
        </Row>
        <Row
          style={{
            marginTop: '4px',
          }}
        >
          <StyledListUrlText title={listUrl}>
            <ListOrigin listUrl={listUrl} />
          </StyledListUrlText>
        </Row>
      </Column>
      <StyledMenu ref={node as any}>
        <ButtonOutlined
          ref={setReferenceElement}
          style={{
            borderRadius: '12px',
            fontSize: '14px',
            marginRight: '0.5rem',
            padding: '.8rem .35rem',
            width: '2rem',
          }}
          onClick={toggle}
        >
          <DropDown />
        </ButtonOutlined>

        {open && (
          <PopoverContainer
            ref={setPopperElement as any}
            show={true}
            style={styles.popper}
            {...attributes.popper}
          >
            <div>{list && listVersionLabel(list.version)}</div>
            <SeparatorDark />
            <ExternalLink
              href={`https://tokenlists.org/token-list?url=${listUrl}`}
            >
              View list
            </ExternalLink>
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
      {isSelected ? (
        <ButtonPrimary
          className="select-button"
          disabled={true}
          style={{
            borderRadius: '12px',
            fontSize: '14px',
            minWidth: '5rem',
            padding: '0.5rem .35rem',
            width: '5rem',
          }}
        >
          Selected
        </ButtonPrimary>
      ) : (
        <>
          <ButtonPrimary
            className="select-button"
            style={{
              borderRadius: '12px',
              fontSize: '14px',
              minWidth: '4.5rem',
              padding: '0.5rem .35rem',
              width: '5rem',
            }}
            tw="hover:bg-dark-900 hover:text-yellow-400 hover:border-yellow-400"
            // tw="rounded-xl text-xl py-1 w-20"
            onClick={selectThisList}
          >
            SELECT
          </ButtonPrimary>
        </>
      )}
    </Row>
  );
});

const AddListButton = styled(ButtonSecondary)`
  /* height: 1.8rem; */
  max-width: 4rem;
  margin-left: 1rem;
  border-radius: 12px;
  padding: 10px 18px;
`;

const ListContainer = styled.div`
  flex: 1;
  overflow: auto;
`;

export function ListSelect({
  onBack,
  onDismiss,
}: {
  onDismiss: () => void;
  onBack: () => void;
}) {
  const [listUrlInput, setListUrlInput] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(
    (state) => state.lists.byUrl
  );
  const adding = Boolean(lists[listUrlInput]?.loadingRequestId);
  const [addError, setAddError] = useState<string | null>(null);

  const handleInput = useCallback((e) => {
    setListUrlInput(e.target.value);
    setAddError(null);
  }, []);
  const fetchList = useFetchListCallback();

  const handleAddList = useCallback(() => {
    if (adding) return;
    setAddError(null);
    fetchList(listUrlInput)
      .then(() => {
        setListUrlInput('');
      })
      .catch((error) => {
        setAddError(error.message);
        dispatch(removeList(listUrlInput));
      });
  }, [adding, dispatch, fetchList, listUrlInput]);

  const validUrl: boolean = useMemo(() => {
    return (
      uriToHttp(listUrlInput).length > 0 ||
      Boolean(parseENSAddress(listUrlInput))
    );
  }, [listUrlInput]);

  const handleEnterKey = useCallback(
    (e) => {
      if (validUrl && e.key === 'Enter') {
        handleAddList();
      }
    },
    [handleAddList, validUrl]
  );

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists);
    return listUrls
      .filter((listUrl) => {
        return Boolean(lists[listUrl].current);
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1];
        const { current: l2 } = lists[u2];
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
  }, [lists]);

  return (
    <Column style={{ flex: '1 1', width: '100%' }}>
      <PaddedColumn>
        <RowBetween>
          <button onClick={onBack}>
            <ArrowLeft height={20} tw="text-yellow-400" width={20} />
          </button>
          <span tw="font-medium text-yellow-400 text-xl">MANAGE LISTS</span>
          <CloseButton onClick={onDismiss} />
        </RowBetween>
      </PaddedColumn>

      <Separator />

      <PaddedColumn gap="14px">
        <span tw="text-yellow-400 text-xl">
          ADD A LIST{' '}
          <QuestionHelper text="Token lists are an open specification for lists of ERC20 tokens. You can use any token list by entering its URL below. Beware that third party token lists can contain fake or malicious ERC20 tokens." />
        </span>
        <Row>
          <SearchInput
            id="list-add-input"
            placeholder="https:// or ipfs:// or ENS name"
            style={{ borderRadius: 12, height: '2.75rem', padding: '12px' }}
            type="text"
            value={listUrlInput}
            onChange={handleInput}
            onKeyDown={handleEnterKey}
          />
          <AddListButton disabled={!validUrl} onClick={handleAddList}>
            ADD
          </AddListButton>
        </Row>
        {addError ? (
          <TYPE.error
            error
            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
            title={addError}
          >
            {addError}
          </TYPE.error>
        ) : null}
      </PaddedColumn>

      <Separator />

      <ListContainer>
        {sortedLists.map((listUrl) => (
          <ListRow key={listUrl} listUrl={listUrl} onBack={onBack} />
        ))}
      </ListContainer>
      <Separator />

      <div style={{ padding: '16px', textAlign: 'center' }}>
        <ExternalLink href="https://tokenlists.org">
          <span tw="text-xl">BROWSE LISTS</span>
        </ExternalLink>
      </div>
    </Column>
  );
}
