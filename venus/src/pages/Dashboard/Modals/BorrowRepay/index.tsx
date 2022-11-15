/** @jsxImportSource @emotion/react */
import React from 'react';

import { Asset } from 'types';
import { Tabs, Modal, IModalProps } from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../styles';
import Borrow from './Borrow';
import Repay from './Repay';

export interface IBorrowRepayProps {
  onClose: IModalProps['handleClose'];
  isXvsEnabled: boolean;
  asset: Asset;
}

const BorrowRepay: React.FC<IBorrowRepayProps> = ({ onClose, asset, isXvsEnabled }) => {
  const { t } = useTranslation();
  const styles = useStyles();

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
    <Modal isOpened backText="Back to Dashboard" handleClose={onClose}>
      <Tabs tabsContent={tabsContent} css={styles.tabs} />
    </Modal>
  );
};

export default BorrowRepay;
