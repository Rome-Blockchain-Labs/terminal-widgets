import { TokenList } from '@uniswap/token-lists';
import React, { useCallback, useState } from 'react';
import { AlertTriangle, ArrowLeft } from 'react-feather';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch } from '../../../../store';
import { ButtonPrimary } from '../../components/Button';
import Card from '../../components/Card';
import { AutoColumn } from '../../components/Column';
import ListLogo from '../../components/ListLogo';
import { AutoRow, RowBetween, RowFixed } from '../../components/Row';
import { SectionBreak } from '../../components/swap/styleds';
import { useFetchListCallback } from '../../hooks/useFetchListCallback';
import { enableList, removeList } from '../../state/lists/actions';
import { useAllLists } from '../../state/lists/hooks';
import { TYPE } from '../../theme';
import { CurrencyModalView } from './CurrencySearchModal';
import { Checkbox, PaddedColumn, TextDot } from './styleds';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`;

interface ImportProps {
  listURL: string;
  list: TokenList;
  onDismiss: () => void;
  setModalView: (view: CurrencyModalView) => void;
}

export function ImportList({
  list,
  listURL,
  onDismiss,
  setModalView,
}: ImportProps) {
  const dispatch = useDispatch<AppDispatch>();

  // user must accept
  const [confirmed, setConfirmed] = useState(false);

  const lists = useAllLists();
  const fetchList = useFetchListCallback();

  // monitor is list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddList = useCallback(() => {
    if (adding) return;
    setAddError(null);
    fetchList(listURL)
      .then(() => {
        // turn list on
        dispatch(enableList(listURL));
        // go back to lists
        setModalView(CurrencyModalView.manage);
      })
      .catch((error) => {
        setAddError(error.message);
        dispatch(removeList(listURL));
      });
  }, [adding, dispatch, fetchList, listURL, setModalView]);

  return (
    <Wrapper>
      <PaddedColumn gap="14px" style={{ flex: '1 1', width: '100%' }}>
        <RowBetween>
          <ArrowLeft
            style={{ cursor: 'pointer' }}
            onClick={() => setModalView(CurrencyModalView.manage)}
          />
          <TYPE.mediumHeader>Import List</TYPE.mediumHeader>
          {/* <CloseIcon onClick={onDismiss} /> */}
        </RowBetween>
      </PaddedColumn>
      <SectionBreak />
      <PaddedColumn gap="md">
        <AutoColumn gap="md">
          <Card padding="12px 20px">
            <RowBetween>
              <RowFixed>
                {list.logoURI && (
                  <ListLogo logoURI={list.logoURI} size="40px" />
                )}
                <AutoColumn gap="sm" style={{ marginLeft: '20px' }}>
                  <RowFixed>
                    <span>{list.name}</span>
                    <TextDot />
                    <TYPE.main fontSize={'16px'} ml="6px">
                      {list.tokens.length} tokens
                    </TYPE.main>
                  </RowFixed>
                  <a href={`https://tokenlists.org/token-list?url=${listURL}`}>
                    <TYPE.main fontSize={'12px'}>{listURL}</TYPE.main>
                  </a>
                </AutoColumn>
              </RowFixed>
            </RowBetween>
          </Card>
          <Card>
            <AutoColumn
              justify="center"
              style={{ gap: '16px', marginBottom: '12px', textAlign: 'center' }}
            >
              <AlertTriangle size={32} />
              <span>Import at your own risk </span>
            </AutoColumn>

            <AutoColumn
              style={{ gap: '16px', marginBottom: '12px', textAlign: 'center' }}
            >
              <span>
                By adding this list you are implicitly trusting that the data is
                correct. Anyone can create a list, including creating fake
                versions of existing lists and lists that claim to represent
                projects that do not have one.
              </span>
              <span>
                If you purchase a token from this list, you may not be able to
                sell it back.
              </span>
            </AutoColumn>
            <AutoRow
              justify="center"
              style={{ cursor: 'pointer' }}
              onClick={() => setConfirmed(!confirmed)}
            >
              <Checkbox
                checked={confirmed}
                name="confirmed"
                type="checkbox"
                onChange={() => setConfirmed(!confirmed)}
              />
              <span>I understand</span>
            </AutoRow>
          </Card>

          <ButtonPrimary
            altDisabledStyle={true}
            borderRadius="20px"
            disabled={!confirmed}
            padding="10px 1rem"
            onClick={handleAddList}
          >
            Import
          </ButtonPrimary>
          {addError ? (
            <TYPE.error
              error
              style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              title={addError}
            >
              {addError}
            </TYPE.error>
          ) : null}
        </AutoColumn>
        {/* </Card> */}
      </PaddedColumn>
    </Wrapper>
  );
}
