import { Currency, Token } from '@dynamic-amm/sdk';
import { useWeb3React } from '@romeblockchain/wallet';
import { TokenList } from '@uniswap/token-lists';
import React from 'react';
import { AlertCircle, ArrowLeft } from 'react-feather';
import styled from 'styled-components';

import { ButtonPrimary } from '../../components/Button';
import Card from '../../components/Card';
import { AutoColumn } from '../../components/Column';
import CurrencyLogo from '../../components/CurrencyLogo';
import ListLogo from '../../components/ListLogo';
import { RowBetween, RowFixed } from '../../components/Row';
import { SectionBreak } from '../../components/swap/styleds';
import { useAddUserToken } from '../../state/user/hooks';
import { TYPE } from '../../theme';
import { getEtherscanLink } from '../../utils';
import { PaddedColumn } from './styleds';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`;

const WarningWrapper = styled(Card)<{ highWarning: boolean }>`
  width: fit-content;
`;

const AddressText = styled(TYPE.blue)`
  font-size: 12px;
`;

interface ImportProps {
  tokens: Token[];
  onBack?: () => void;
  list?: TokenList;
  onDismiss?: () => void;
  handleCurrencySelect?: (currency: Currency) => void;
}

export function ImportToken({
  handleCurrencySelect,
  list,
  onBack,
  onDismiss,
  tokens,
}: ImportProps) {
  const { chainId } = useWeb3React();

  const addToken = useAddUserToken();

  return (
    <Wrapper>
      <PaddedColumn gap="14px" style={{ flex: '1 1', width: '100%' }}>
        <RowBetween>
          {onBack ? (
            <ArrowLeft style={{ cursor: 'pointer' }} onClick={onBack} />
          ) : (
            <div></div>
          )}
          <TYPE.mediumHeader>
            {tokens.length > 1 ? 'Import Tokens' : 'Import Token'}
          </TYPE.mediumHeader>
          {/* {onDismiss ? <CloseIcon onClick={onDismiss} /> : <div></div>} */}
        </RowBetween>
      </PaddedColumn>
      <SectionBreak />
      <AutoColumn gap="md" style={{ marginBottom: '32px', padding: '1rem' }}>
        <AutoColumn
          justify="center"
          style={{ gap: '16px', padding: '1rem', textAlign: 'center' }}
        >
          <AlertCircle size={48} strokeWidth={1} />
          <span>
            This token doesn't appear on the active token list(s). Make sure
            this is the token that you want to trade.
          </span>
        </AutoColumn>
        {tokens.map((token) => {
          return (
            <Card
              key={'import' + token.address}
              className=".token-warning-container"
              padding="2rem"
            >
              <AutoColumn gap="10px" justify="center">
                <CurrencyLogo currency={token} size={'32px'} />

                <AutoColumn gap="4px" justify="center">
                  <span>{token.symbol}</span>
                  <span>{token.name}</span>
                </AutoColumn>
                {chainId && (
                  <a href={getEtherscanLink(chainId, token.address, 'address')}>
                    <AddressText fontSize={12}>{token.address}</AddressText>
                  </a>
                )}
                {list !== undefined ? (
                  <RowFixed>
                    {list.logoURI && (
                      <ListLogo logoURI={list.logoURI} size="16px" />
                    )}
                    <span>via {list.name} token list</span>
                  </RowFixed>
                ) : (
                  <WarningWrapper
                    borderRadius="4px"
                    highWarning={true}
                    padding="4px"
                  >
                    <RowFixed>
                      <AlertCircle />
                      <span>Unknown Source</span>
                    </RowFixed>
                  </WarningWrapper>
                )}
              </AutoColumn>
            </Card>
          );
        })}

        <ButtonPrimary
          altDisabledStyle={true}
          borderRadius="20px"
          className=".token-dismiss-button"
          padding="10px 1rem"
          onClick={() => {
            tokens.map((token) => addToken(token));
            handleCurrencySelect && handleCurrencySelect(tokens[0]);
          }}
        >
          Import
        </ButtonPrimary>
      </AutoColumn>
    </Wrapper>
  );
}
