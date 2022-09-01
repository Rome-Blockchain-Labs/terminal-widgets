import { Token } from '@dynamic-amm/sdk';
import { TokenList } from '@uniswap/token-lists';
import React, { useState } from 'react';
import { ArrowLeft } from 'react-feather';
import styled from 'styled-components';
import tw, { theme } from 'twin.macro';

import { CloseButton } from '../../../../components/buttons';
import { RowBetween } from '../Row';
import { CurrencyModalView } from './CurrencySearchModal';
import { ManageLists } from './ManageLists';
import ManageTokens from './ManageTokens';
import { PaddedColumn, Separator } from './styleds';

const Wrapper = styled.div`
  position: relative;
  padding-bottom: 80px;
`;

const ToggleWrapper = styled(RowBetween)`
  border-radius: 12px;
  padding: 6px;
`;

const ToggleOption = styled.div<{ active?: boolean }>`
  width: 48%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  user-select: none;
  ${tw`text-xl text-green-400`}
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

export default function Manage({
  onDismiss,
  setImportList,
  setImportToken,
  setListUrl,
  setModalView,
}: {
  onDismiss: () => void;
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
}) {
  // toggle between tokens and lists
  const [showLists, setShowLists] = useState(true);

  return (
    <Wrapper tw="w-75">
      <PaddedColumn>
        <RowBetween tw="text-green-400">
          <ArrowLeft
            style={{ cursor: 'pointer' }}
            onClick={() => setModalView(CurrencyModalView.search)}
          />
          <div tw="text-xl">MANAGE</div>
          <CloseButton color={theme`colors.green.400`} onClick={onDismiss} />
        </RowBetween>
      </PaddedColumn>
      <Separator />
      <PaddedColumn style={{ paddingBottom: 0 }}>
        <ToggleWrapper>
          <ToggleOption
            active={showLists}
            onClick={() => setShowLists(!showLists)}
          >
            LISTS
          </ToggleOption>
          <ToggleOption
            active={!showLists}
            onClick={() => setShowLists(!showLists)}
          >
            TOKENS
          </ToggleOption>
        </ToggleWrapper>
      </PaddedColumn>
      {showLists ? (
        <ManageLists
          setImportList={setImportList}
          setListUrl={setListUrl}
          setModalView={setModalView}
        />
      ) : (
        <ManageTokens
          setImportToken={setImportToken}
          setModalView={setModalView}
        />
      )}
    </Wrapper>
  );
}
