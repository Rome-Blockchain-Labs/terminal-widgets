import { Token } from '@dynamic-amm/sdk';
import React from 'react';

import { ModalWrapper } from '../../../../components/modals';
import { ImportToken } from '../SearchModal/ImportToken';

export default function TokenWarningModal({
  isOpen,
  onConfirm,
  onDismiss,
  tokens,
}: {
  isOpen: boolean;
  tokens: Token[];
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  return (
    <ModalWrapper noPadding isOpen={isOpen} onDismiss={onDismiss}>
      <ImportToken handleCurrencySelect={onConfirm} tokens={tokens} />
    </ModalWrapper>
  );
}
