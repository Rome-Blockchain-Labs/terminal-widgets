import { useWeb3React } from '@romeblockchain/wallet';
import React from 'react';
import { AlertCircle, CheckCircle } from 'react-feather';
import styled from 'styled-components';
import tw from 'twin.macro';

import { getEtherscanLink, getEtherscanLinkText } from '../../utils';
import { AutoColumn } from '../Column';
import { AutoRow } from '../Row';

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
  ${tw`bg-dark-400`}
`;

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string;
  success?: boolean;
  summary?: string;
}) {
  const { chainId } = useWeb3React();

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
      </div>
      <AutoColumn gap="8px">
        <span>
          {summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}
        </span>
        {chainId && (
          <a href={getEtherscanLink(chainId, hash, 'transaction')}>
            {getEtherscanLinkText(chainId)}
          </a>
        )}
      </AutoColumn>
    </RowNoFlex>
  );
}
