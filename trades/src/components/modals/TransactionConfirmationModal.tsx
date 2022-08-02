import React from 'react';
import { AlertTriangle, ArrowUpCircle } from 'react-feather';
import { ClipLoader } from 'react-spinners';
import { Text } from 'rebass';
import styled from 'styled-components';
import tw, { css, theme } from 'twin.macro';

import { NetworkChainId } from '../../constants/networkExchange';
import { useWallets } from '../../contexts/WalletsContext/WalletContext';
import { getExplorerLink } from '../../utils';
import { ButtonPrimary, CloseButton } from '../buttons';
import { AutoColumn, ColumnCenter } from '../column';
import { ExternalLink } from '../links';
import { RowBetween } from '../row';

const Wrapper = styled.div`
  ${tw`bg-green-700 px-4 max-w-lg w-11/12 md:w-4/5`};
`;
const Section = styled(AutoColumn)`
  padding: 24px;
`;

const BottomSection = styled(Section)`
  ${tw`text-xl`}
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`;

function ConfirmationPendingContent({
  onDismiss,
  pendingText,
  titleColor = theme`colors.yellow.400`,
}: {
  onDismiss: () => void;
  pendingText: string;
  titleColor?: string;
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <CloseButton color={titleColor} onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <ClipLoader color={theme`colors.blue.500`} size={90} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <span tw="text-xl font-medium">Waiting For Confirmation</span>
          <AutoColumn gap="12px" justify={'center'}>
            <Text
              color={titleColor}
              fontSize={12}
              fontWeight={600}
              textAlign="center"
            >
              {pendingText}
            </Text>
          </AutoColumn>
          <Text color="#565A69" fontSize={12} textAlign="center">
            Confirm this transaction in your wallet
          </Text>
        </AutoColumn>
      </Section>
    </Wrapper>
  );
}

function TransactionSubmittedContent({
  chainId,
  hash,
  onDismiss,
  titleColor = theme`colors.yellow.400`,
}: {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: NetworkChainId;
  titleColor?: string;
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <CloseButton color={titleColor} onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <ArrowUpCircle color={titleColor} size={90} strokeWidth={0.5} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <span tw="text-xl font-medium">Transaction Submitted</span>

          {chainId && hash && (
            <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>
              <Text color={titleColor} fontSize={14} fontWeight={500}>
                View on Block Explorer
              </Text>
            </ExternalLink>
          )}
          <ButtonPrimary
            css={[
              css`
                color: black;
                &:hover {
                  color: ${titleColor};
                }
              `,
            ]}
            style={{ margin: '20px 0 0 0' }}
            tw="hover:bg-dark-900"
            onClick={onDismiss}
          >
            <span tw="text-xl font-medium">CLOSE</span>
          </ButtonPrimary>
        </AutoColumn>
      </Section>
    </Wrapper>
  );
}

export function ConfirmationModalContent({
  bottomContent,
  onDismiss,
  title,
  topContent,
  titleColor = theme`colors.yellow.400`,
}: {
  title: string;
  onDismiss: () => void;
  topContent: React.ReactNode;
  bottomContent: React.ReactNode;
  titleColor?: string;
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <span
            css={[
              tw`text-xl font-medium`,
              css`
                color: ${titleColor};
              `,
            ]}
          >
            {title}
          </span>
          <CloseButton color={titleColor} onClick={onDismiss} />
        </RowBetween>
        {topContent}
      </Section>
      <BottomSection gap="12px">{bottomContent}</BottomSection>
    </Wrapper>
  );
}

export function TransactionErrorContent({
  message,
  onDismiss,
  titleColor = theme`colors.yellow.400`,
}: {
  message: string;
  onDismiss: () => void;
  titleColor?: string;
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <span tw="text-xl font-medium">Error</span>
          <CloseButton color={titleColor} onClick={onDismiss} />
        </RowBetween>
        <AutoColumn
          gap="24px"
          justify="center"
          style={{ marginTop: 20, padding: '2rem 0' }}
        >
          <AlertTriangle
            color={theme`colors.red.400`}
            size={64}
            style={{ strokeWidth: 1.5 }}
          />
          <Text
            color={theme`colors.red.400`}
            fontSize={12}
            fontWeight={500}
            style={{ textAlign: 'center', width: '85%' }}
          >
            {message}
          </Text>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonPrimary
          css={[
            css`
              background: ${titleColor};
              &:hover {
                color: ${titleColor};
                ${tw`bg-dark-400`}
              }
            `,
          ]}
          onClick={onDismiss}
        >
          Dismiss
        </ButtonPrimary>
      </BottomSection>
    </Wrapper>
  );
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  hash: string | undefined;
  content: () => React.ReactNode;
  attemptingTxn: boolean;
  pendingText: string;
  noPadding?: boolean;
  titleColor?: string;
}

export function TransactionConfirmationModal({
  attemptingTxn,
  content,
  hash,
  isOpen,
  noPadding = false,
  onDismiss,
  pendingText,
  titleColor = theme`colors.yellow.400`,
}: ConfirmationModalProps) {
  const { chainId } = useWallets();

  if (!chainId) return null;

  // confirmation screen

  const Container = styled.div<{ isOpen: boolean }>`
    ${tw`fixed top-0 left-0 w-screen h-screen z-50 bg-black bg-opacity-75 overflow-auto hidden place-items-center`}

    ${({ isOpen }) => isOpen && tw`grid`}
  `;

  return (
    <Container isOpen={isOpen}>
      {attemptingTxn ? (
        <ConfirmationPendingContent
          pendingText={pendingText}
          titleColor={titleColor}
          onDismiss={onDismiss}
        />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          titleColor={titleColor}
          onDismiss={onDismiss}
        />
      ) : (
        content()
      )}
    </Container>
  );
}
