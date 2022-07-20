import {
  ButtonSecondary,
  CloseButton,
  LinkStyledButton,
} from 'components/shared/buttons'
import Identicon from 'components/shared/identicon'
import { AutoRow } from 'components/shared/row'
import React, { useCallback } from 'react'
import { ExternalLink, ExternalLink as LinkIcon } from 'react-feather'
import { useDispatch } from 'react-redux'
import tw, { styled } from 'twin.macro'
import { shortenAddress, getExplorerLink } from 'utils/dapp'

// import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
// import { AppDispatch } from '../../../../store';
// import { clearAllTransactions } from '../../state/transactions/actions';
import Copy from './Copy'
import Transaction from './Transaction'

const HeaderRow = tw.div`flex justify-between items-center py-4 text-yellow-400 text-lg border-b-2 border-gray-400`

const UpperSection = styled.div`
  position: relative;
`

const InfoCard = styled.div`
  ${tw`bg-gray-600`}
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const AccountSection = styled.div`
  padding: 1rem 1rem 0;
  ${({ theme }) =>
    theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`

const LowerSection = styled.div`
  ${tw`flex-col flex-nowrap`}
  padding: 1.5rem;
  flex-grow: 1;
  overflow: auto;
`

const AccountControl = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;

  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const AddressLink = styled(ExternalLink)<{ hasENS: boolean; isENS: boolean }>`
  color: ${({ theme }) => theme.text3};
  margin-left: 1rem;

  :hover {
    color: ${({ theme }) => theme.text2};
  }
`

const WalletName = styled.div`
  width: initial;
  font-size: 0.825rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text3};
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`

const WalletAction = styled(ButtonSecondary)`
  width: fit-content;
  margin-left: 8px;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

function renderTransactions(transactions: string[]) {
  return (
    <TransactionListWrapper>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />
      })}
    </TransactionListWrapper>
  )
}

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  ENSName?: string
  openOptions: () => void
}

export default function AccountDetails({
  ENSName,
  confirmedTransactions,
  openOptions,
  pendingTransactions,
  toggleWalletModal,
}: AccountDetailsProps) {
  const dispatch = useDispatch<AppDispatch>()

  const { account, active, chainId, walletName } = useWallets()
  function formatConnectorName() {
    return <WalletName>Connected with {walletName}</WalletName>
  }

  function getStatusIcon() {
    if (active) {
      return (
        <IconWrapper size={16}>
          <Identicon />
        </IconWrapper>
      )
    }
    return null
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <div tw="w-full">
      <UpperSection>
        <HeaderRow>
          <span tw="text-xl">ACCOUNT</span>
          <CloseButton width={14} onClick={toggleWalletModal} />
        </HeaderRow>
        <AccountSection>
          <InfoCard>
            <AccountGroupingRow>
              {formatConnectorName()}
              <div>
                <WalletAction
                  tw="text-lg p-2 hover:bg-dark-900 hover:text-yellow-400 hover:border-yellow-400 hover:no-underline"
                  onClick={() => {
                    openOptions()
                  }}
                >
                  CHANGE
                </WalletAction>
              </div>
            </AccountGroupingRow>
            <AccountGroupingRow id="web3-account-identifier-row">
              <AccountControl>
                {ENSName ? (
                  <>
                    <div>
                      {getStatusIcon()}
                      <p> {ENSName}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      {getStatusIcon()}
                      <p tw="text-lg">
                        {' '}
                        {account && shortenAddress(account).toUpperCase()}
                      </p>
                    </div>
                  </>
                )}
              </AccountControl>
            </AccountGroupingRow>
            <AccountGroupingRow>
              {ENSName ? (
                <>
                  <AccountControl>
                    <div>
                      {account && (
                        <Copy toCopy={account}>
                          <span tw="text-xl ml-1">Copy Address</span>
                        </Copy>
                      )}
                      {chainId && account && (
                        <AddressLink
                          hasENS={!!ENSName}
                          href={getExplorerLink(chainId, ENSName, 'address')}
                          isENS={true}
                          tw="flex items-center"
                        >
                          <LinkIcon size={16} />
                          <span tw="text-xl ml-1">View on Block Explorer</span>
                        </AddressLink>
                      )}
                    </div>
                  </AccountControl>
                </>
              ) : (
                <>
                  <AccountControl>
                    <div>
                      {account && (
                        <Copy toCopy={account}>
                          <span tw="text-xl ml-1">Copy Address</span>
                        </Copy>
                      )}
                      {chainId && account && (
                        <AddressLink
                          hasENS={!!ENSName}
                          href={getExplorerLink(chainId, account, 'address')}
                          isENS={false}
                          tw="flex items-center"
                        >
                          <LinkIcon size={16} />
                          <span tw="text-xl ml-1">View on Block Explorer</span>
                        </AddressLink>
                      )}
                    </div>
                  </AccountControl>
                </>
              )}
            </AccountGroupingRow>
          </InfoCard>
        </AccountSection>
      </UpperSection>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <LowerSection>
          <AutoRow mb={'1rem'} style={{ justifyContent: 'space-between' }}>
            <span tw="text-xl font-normal">Recent Transactions</span>
            <LinkStyledButton
              tw="text-xl"
              onClick={clearAllTransactionsCallback}
            >
              (CLEAR ALL)
            </LinkStyledButton>
          </AutoRow>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </LowerSection>
      ) : (
        <LowerSection>
          <span tw="text-xl font-normal">
            Your transactions will appear here...
          </span>
        </LowerSection>
      )}
    </div>
  )
}
