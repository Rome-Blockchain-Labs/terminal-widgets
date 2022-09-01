import 'twin.macro';

import React from 'react';
import styled from 'styled-components';

import { ModalWrapper } from '../../../../components/modals';
import { ReactComponent as Close } from '../../assets/images/x.svg';
import { ApplicationModal } from '../../state/application/actions';
import {
  useModalOpen,
  usePoolDetailModalToggle,
} from '../../state/application/hooks';
import { useSelectedPool } from '../../state/pools/hooks';
import { ItemCard } from './ListItem';

const CloseIcon = styled.div`
  position: absolute;
  right: 20px;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const CloseColor = styled(Close)`
  path {
  }
`;

const ModalHeader = styled.div`
  position: relative;
  padding: 20px 20px 0 20px;
`;

export default function PoolDetailModal() {
  const poolDetailModalOpen = useModalOpen(ApplicationModal.POOL_DETAIL);
  const togglePoolDetailModal = usePoolDetailModalToggle();
  const selectedPool = useSelectedPool();

  if (!selectedPool) {
    return null;
  }

  return (
    <ModalWrapper
      noPadding
      isOpen={poolDetailModalOpen}
      onDismiss={togglePoolDetailModal}
    >
      <div tw="bg-green-700 rounded-xl">
        <ModalHeader>
          <div tw="text-xl font-bold">
            {selectedPool?.pool.token0.symbol} /{' '}
            {selectedPool?.pool.token1.symbol}
          </div>
          <CloseIcon onClick={togglePoolDetailModal}>
            <CloseColor />
          </CloseIcon>
        </ModalHeader>
        <ItemCard
          myLiquidity={selectedPool?.myLiquidity}
          pool={selectedPool?.pool}
          subgraphPoolData={selectedPool?.subgraphPoolData}
        />
      </div>
    </ModalWrapper>
  );
}
