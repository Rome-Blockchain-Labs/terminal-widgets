/** @jsxImportSource @emotion/react */
import React from 'react';

import { Asset } from 'types';
import { Tabs, Modal, IModalProps } from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../styles';
import Borrow from './Borrow';
import Repay from './Repay';
import { useIsSmDown } from '../../../../hooks/responsive';

export interface IBorrowRepayProps {
  onClose: IModalProps['handleClose'];
  isXvsEnabled: boolean;
  asset: Asset;
}

const BorrowRepay: React.FC<IBorrowRepayProps> = ({ onClose, asset, isXvsEnabled }) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const isSmDown = useIsSmDown();

  const tabsContent = [
    {
      title: t('borrowRepayModal.borrowTabTitle'),
      content: (
        <div css={styles.container}>
          <Borrow asset={asset} onClose={onClose} isXvsEnabled={isXvsEnabled} />
        </div>
      ),
    },
    {
      title: t('borrowRepayModal.repayTabTitle'),
      content: (
        <div css={styles.container}>
          <Repay asset={asset} onClose={onClose} isXvsEnabled={isXvsEnabled} />
        </div>
      ),
    },
  ];

  return (
    <Modal isOpened title={isSmDown ? 'Back to Dashboard' : undefined} handleClose={onClose}>
      <Tabs tabsContent={tabsContent} css={styles.tabs} />
    </Modal>
  );
};

export default BorrowRepay;
