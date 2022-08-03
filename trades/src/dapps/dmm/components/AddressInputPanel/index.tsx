import { useWeb3React } from '@romeblockchain/wallet';
import React, { useCallback } from 'react';
import styled from 'styled-components';

import useENS from '../../hooks/useENS';
import { TYPE } from '../../theme';
import { getEtherscanLink, getEtherscanLinkText } from '../../utils';
import { AutoColumn } from '../Column';
import { RowBetween } from '../Row';

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 8px;
  z-index: 1;
  width: 100%;
`;

const ContainerRow = styled.div<{ error: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  transition: border-color 300ms
      ${({ error }) => (error ? 'step-end' : 'step-start')},
    color 500ms ${({ error }) => (error ? 'step-end' : 'step-start')};
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
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
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
  const { chainId } = useWeb3React();

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
              <TYPE.black fontSize={14} fontWeight={500}>
                Recipient
              </TYPE.black>
              {address && chainId && (
                <a
                  href={getEtherscanLink(chainId, name ?? address, 'address')}
                  style={{ fontSize: '14px' }}
                >
                  ({getEtherscanLinkText(chainId)})
                </a>
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
