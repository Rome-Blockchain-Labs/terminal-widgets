import 'twin.macro';

import { Token } from '@dynamic-amm/sdk';
import React, {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { useToken } from '../../hooks/Tokens';
import {
  useRemoveUserAddedToken,
  useUserAddedTokens,
} from '../../state/user/hooks';
import { TYPE } from '../../theme';
import { getEtherscanLink, isAddress } from '../../utils';
import Card from '../Card';
import Column from '../Column';
import CurrencyLogo from '../CurrencyLogo';
import Row, { RowBetween, RowFixed } from '../Row';
import { CurrencyModalView } from './CurrencySearchModal';
import ImportRow from './ImportRow';
import { PaddedColumn, SearchInput, Separator } from './styleds';

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  padding-bottom: 60px;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 20px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  padding: 20px;
  text-align: center;
`;

export default function ManageTokens({
  setImportToken,
  setModalView,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
}) {
  const { chainId } = useWallets();

  const [searchQuery, setSearchQuery] = useState<string>('');

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
  }, []);

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery);
  const searchToken = useToken(searchQuery);

  // all tokens for local lisr
  const userAddedTokens: Token[] = useUserAddedTokens();
  const removeToken = useRemoveUserAddedToken();

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map((token) => {
        return removeToken(chainId, token.address);
      });
    }
  }, [removeToken, userAddedTokens, chainId]);

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <RowBetween key={token.address} width="100%">
          <RowFixed>
            <CurrencyLogo currency={token} size={'20px'} />
            <a href={getEtherscanLink(chainId, token.address, 'address')}>
              <TYPE.main fontWeight={600} ml={'10px'}>
                {token.symbol}
              </TYPE.main>
            </a>
          </RowFixed>
          <RowFixed>
            {/* <TrashIcon onClick={() => removeToken(chainId, token.address)} /> */}
            {/* <aIcon href={getEtherscanLink(chainId, token.address, 'address')} /> */}
          </RowFixed>
        </RowBetween>
      ))
    );
  }, [userAddedTokens, chainId]);

  return (
    <Wrapper>
      <Column style={{ flex: '1 1', width: '100%' }}>
        <PaddedColumn gap="14px">
          <Row>
            <SearchInput
              ref={inputRef as RefObject<HTMLInputElement>}
              autoComplete="off"
              id="token-search-input"
              placeholder={'0x0000'}
              type="text"
              value={searchQuery}
              onChange={handleInput}
            />
          </Row>
          {searchQuery !== '' && !isAddressSearch && (
            <span tw="text-xl text-red-400">Enter valid token address</span>
          )}
          {searchToken && (
            <Card padding="10px 0">
              <ImportRow
                setImportToken={setImportToken}
                showImportView={() =>
                  setModalView(CurrencyModalView.importToken)
                }
                style={{ height: 'fit-content' }}
                token={searchToken}
              />
            </Card>
          )}
        </PaddedColumn>
        <Separator />
        <PaddedColumn gap="lg">
          <RowBetween>
            <span tw="text-xl font-semibold">
              {userAddedTokens?.length} Custom{' '}
              {userAddedTokens.length === 1 ? 'Token' : 'Tokens'}
            </span>
            {userAddedTokens.length > 0 && (
              <button onClick={handleRemoveAll}>
                <span tw="text-xl text-gray-400">Clear all</span>
              </button>
            )}
          </RowBetween>
          {tokenList}
        </PaddedColumn>
      </Column>
      <Footer>
        <span tw="text-xl text-gray-400">
          Tip: Custom tokens are stored locally in your browser
        </span>
      </Footer>
    </Wrapper>
  );
}
