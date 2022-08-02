import { useWeb3React } from '@romeblockchain/wallet';
import React, { useContext } from 'react';
import { AlertCircle, CheckCircle } from 'react-feather';
import styled, { ThemeContext } from 'styled-components';

import { AutoColumn } from '../../../../components/column';
import { ExternalLink } from '../../../../components/links';
import { AutoRow } from '../../../../components/row';
import { getExplorerLink } from '../../../../utils';

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
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

  const theme = useContext(ThemeContext);

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? (
          <CheckCircle color={theme.green1} size={24} />
        ) : (
          <AlertCircle color={theme.red1} size={24} />
        )}
      </div>
      <AutoColumn gap="8px">
        <span tw="text-black text-xl font-normal">
          {summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}
        </span>
        {chainId && (
          <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>
            View on Block Explorer
          </ExternalLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  );
}
