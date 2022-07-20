import { AutoColumn } from 'components/shared/column'
import { AutoRow } from 'components/shared/row'
import React, { useContext } from 'react'
import { AlertCircle, CheckCircle, ExternalLink } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { getExplorerLink } from 'utils/dapp'

import { useWallets } from '../../../../contexts/WalletsContext/WalletContext'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useWallets()

  const theme = useContext(ThemeContext)

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
  )
}
