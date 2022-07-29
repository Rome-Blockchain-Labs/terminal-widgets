import 'twin.macro';

import { Token } from '@dynamic-amm/sdk';
import React, { CSSProperties } from 'react';
import { CheckCircle } from 'react-feather';
import styled from 'styled-components';

import { AutoRow, RowFixed } from '../../components/Row';
import { useIsTokenActive, useIsUserAddedToken } from '../../hooks/Tokens';
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo';
import { TYPE } from '../../theme';
import { ButtonPrimary } from '..//Button';
import { AutoColumn } from '..//Column';
import CurrencyLogo from '..//CurrencyLogo';
import ListLogo from '..//ListLogo';

const TokenSection = styled.div<{ dim?: boolean }>`
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? '0.4' : '1')};
`;

const CheckIcon = styled(CheckCircle)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
`;

export default function ImportRow({
  dim,
  setImportToken,
  showImportView,
  style,
  token,
}: {
  token: Token;
  style?: CSSProperties;
  dim?: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
}) {
  // gloabls

  // check if already networkLogos on list or local storage tokens
  const isAdded = useIsUserAddedToken(token);
  const isActive = useIsTokenActive(token);

  const list = token instanceof WrappedTokenInfo ? token.list : undefined;

  return (
    <TokenSection style={style}>
      <CurrencyLogo
        currency={token}
        size={'24px'}
        style={{ opacity: dim ? '0.6' : '1' }}
      />
      <AutoColumn gap="4px" style={{ opacity: dim ? '0.6' : '1' }}>
        <AutoRow>
          <span tw="text-base text-white">{token.symbol}</span>
        </AutoRow>
        {list && list.logoURI && (
          <RowFixed>
            <span tw="text-base">via {list.name}</span>
            <ListLogo logoURI={list.logoURI} size="12px" />
          </RowFixed>
        )}
      </AutoColumn>
      {!isActive && !isAdded ? (
        <ButtonPrimary
          fontSize="14px"
          fontWeight={500}
          padding="6px 12px"
          width="fit-content"
          onClick={() => {
            setImportToken && setImportToken(token);
            showImportView();
          }}
        >
          Import
        </ButtonPrimary>
      ) : (
        <RowFixed style={{ minWidth: 'fit-content' }}>
          <CheckIcon />
          <TYPE.main>Active</TYPE.main>
        </RowFixed>
      )}
    </TokenSection>
  );
}
