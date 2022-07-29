import { Token } from '@rbl/velox-common/uniV2ClonesSDK';
import { transparentize } from 'polished';
import React, { useCallback, useMemo, useState } from 'react';
import { AlertTriangle } from 'react-feather';
import { styled } from 'twin.macro';

import { AutoColumn } from '../../../../components/column';
import { ExternalLink } from '../../../../components/links';
import { ModalWrapper } from '../../../../components/modals';
import { AutoRow, RowBetween } from '../../../../components/row';
import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import {
  getDefaultCurrencySymbol,
  getExplorerLink,
  shortenAddress,
} from '../../../../utils';
import { useAllTokens } from '../../hooks/Tokens';
import { TYPE } from '../../theme';
import CurrencyLogo from '../CurrencyLogo';

const Wrapper = styled.div<{ error: boolean }>`
  background: ${({ theme }) => transparentize(0.6, theme.bg3)};
  padding: 0.75rem;
  border-radius: 20px;
`;

const WarningContainer = styled.div`
  max-width: 420px;
  width: 100%;
  padding: 1rem;
  overflow: auto;
`;

const StyledWarningIcon = styled(AlertTriangle)`
  stroke: ${({ theme }) => theme.red2};
`;

interface TokenWarningCardProps {
  token?: Token;
}

function TokenWarningCard({ token }: TokenWarningCardProps) {
  const { chainId } = useWallets();

  const tokenSymbol = getDefaultCurrencySymbol(token)?.toLowerCase() ?? '';
  const tokenName = token?.name?.toLowerCase() ?? '';

  const allTokens = useAllTokens();

  const duplicateNameOrSymbol = useMemo(() => {
    if (!token || !chainId) return false;

    return Object.keys(allTokens).some((tokenAddress) => {
      const userToken = allTokens[tokenAddress];
      if (userToken.equals(token)) {
        return false;
      }
      return (
        userToken.symbol?.toLowerCase() === tokenSymbol ||
        userToken.name?.toLowerCase() === tokenName
      );
    });
  }, [token, chainId, allTokens, tokenSymbol, tokenName]);

  if (!token) return null;

  return (
    <Wrapper error={duplicateNameOrSymbol}>
      <AutoRow gap="6px">
        <AutoColumn gap="24px">
          <CurrencyLogo currency={token} size={'16px'} />
          <div> </div>
        </AutoColumn>
        <AutoColumn gap="10px" justify="flex-start">
          <span tw="text-gray-200 text-xl">
            {token && token.name && token.symbol && token.name !== token.symbol
              ? `${token.name} (${getDefaultCurrencySymbol(token)})`
              : token.name || getDefaultCurrencySymbol(token)}{' '}
          </span>
          {chainId && (
            <ExternalLink
              href={getExplorerLink(chainId, token.address, 'token')}
              style={{ fontWeight: 400 }}
            >
              {shortenAddress(token.address)} (View on Block Explorer)
            </ExternalLink>
          )}
        </AutoColumn>
      </AutoRow>
    </Wrapper>
  );
}

export default function TokenWarningModal({
  isOpen,
  onConfirm,
  tokens,
}: {
  isOpen: boolean;
  tokens: Token[];
  onConfirm: () => void;
}) {
  const [understandChecked, setUnderstandChecked] = useState(false);
  const toggleUnderstand = useCallback(
    () => setUnderstandChecked((uc) => !uc),
    []
  );

  const handleDismiss = useCallback(() => null, []);
  return (
    <ModalWrapper isOpen={isOpen} onDismiss={handleDismiss}>
      <WarningContainer className="token-warning-container">
        <AutoColumn gap="md">
          <AutoRow gap="6px">
            <StyledWarningIcon />
            <TYPE.main color={'red2'}>Token imported</TYPE.main>
          </AutoRow>
          <span tw="text-red-600 text-xl">
            Anyone can create an ERC20 token on Ethereum with <em>any</em> name,
            including creating fake versions of existing tokens and tokens that
            claim to represent projects that do not have a token.
          </span>
          <span tw="text-red-600 text-xl">
            This interface can load arbitrary tokens by token addresses. Please
            take extra caution and do your research when interacting with
            arbitrary ERC20 tokens.
          </span>
          <span tw="text-red-600 text-xl">
            If you purchase an arbitrary token,{' '}
            <strong>you may be unable to sell it back.</strong>
          </span>
          {tokens.map((token) => {
            return <TokenWarningCard key={token.address} token={token} />;
          })}
          <RowBetween>
            <div>
              <label tw="cursor-pointer select-none text-gray-200 text-xl">
                <input
                  checked={understandChecked}
                  className="understand-checkbox"
                  tw="mr-2"
                  type="checkbox"
                  onChange={toggleUnderstand}
                />{' '}
                I understand
              </label>
            </div>
            <button
              disabled={!understandChecked}
              tw="text-white text-xl font-medium py-2 px-4"
              onClick={onConfirm}
            >
              Continue
            </button>
          </RowBetween>
        </AutoColumn>
      </WarningContainer>
    </ModalWrapper>
  );
}
