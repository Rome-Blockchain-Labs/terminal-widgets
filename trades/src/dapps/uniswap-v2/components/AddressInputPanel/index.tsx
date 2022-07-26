import React, { useCallback, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

import { AutoColumn } from '../../../../components/column';
import { ExternalLink } from '../../../../components/links';
import { RowBetween } from '../../../../components/row';
import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { getExplorerLink } from '../../../../utils';
import useENS from '../../hooks/useENS';
import { TYPE } from '../../theme';

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 1;
  width: 100%;
`;

const ContainerRow = styled.div<{ error: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.25rem;
  border: 1px solid ${({ error, theme }) => (error ? theme.red1 : theme.bg2)};
  transition: border-color 300ms
      ${({ error }) => (error ? 'step-end' : 'step-start')},
    color 500ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  background-color: ${({ theme }) => theme.bg1};
`;

const InputContainer = styled.div`
  flex: 1;
  padding: 1rem;
`;

const Input = styled.input<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.red1 : theme.primary1)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`;

export default function AddressInputPanel({
  id,
  onChange,
  value,
}: {
  id?: string;
  // the typed string value
  value: string;
  // triggers whenever the typed value changes
  onChange: (value: string) => void;
}) {
  const { chainId } = useWallets();
  const theme = useContext(ThemeContext);

  const { address, loading, name } = useENS(value);

  const handleInput = useCallback(
    (event) => {
      const input = event.target.value;
      const withoutSpaces = input.replace(/\s+/g, '');
      onChange(withoutSpaces);
    },
    [onChange]
  );

  const error = Boolean(value.length > 0 && !loading && !address);

  return (
    <InputPanel id={id}>
      <ContainerRow error={error}>
        <InputContainer>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.black color={theme.text2} fontSize={14} fontWeight={500}>
                Recipient
              </TYPE.black>
              {address && chainId && (
                <ExternalLink
                  href={getExplorerLink(chainId, name ?? address, 'address')}
                  style={{ fontSize: '14px' }}
                >
                  (View on Block Explorer)
                </ExternalLink>
              )}
            </RowBetween>
            <Input
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="recipient-address-input"
              error={error}
              pattern="^(0x[a-fA-F0-9]{40})$"
              placeholder="Wallet Address or ENS name"
              spellCheck="false"
              type="text"
              value={value}
              onChange={handleInput}
            />
          </AutoColumn>
        </InputContainer>
      </ContainerRow>
    </InputPanel>
  );
}
