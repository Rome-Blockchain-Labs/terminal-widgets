import { Currency } from '@rbl/velox-common/uniV2ClonesSDK';
import React, { useCallback, useEffect, useState } from 'react';

import { ModalWrapper } from '../../../../components/modals';
import { useLast } from '../../../../hooks';
import { useSelectedListUrl } from '../../state/lists/hooks';
import { CurrencySearch } from './CurrencySearch';
import ListIntroduction from './ListIntroduction';
import { ListSelect } from './ListSelect';

interface CurrencySearchModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
}

export default function CurrencySearchModal({
  isOpen,
  onCurrencySelect,
  onDismiss,
  otherSelectedCurrency,
  selectedCurrency,
  showCommonBases = false,
}: CurrencySearchModalProps) {
  const [listView, setListView] = useState<boolean>(false);
  const lastOpen = useLast(isOpen);

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false);
    }
  }, [isOpen, lastOpen]);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect]
  );

  const handleClickChangeList = useCallback(() => {
    setListView(true);
  }, []);
  const handleClickBack = useCallback(() => {
    setListView(false);
  }, []);
  const handleSelectListIntroduction = useCallback(() => {
    setListView(true);
  }, []);

  const selectedListUrl = useSelectedListUrl();
  const noListSelected = !selectedListUrl;

  return (
    <ModalWrapper
      isOpen={isOpen}
      maxHeight={450}
      minHeight={listView ? 400 : noListSelected ? 0 : 600}
      onDismiss={onDismiss}
    >
      {listView ? (
        <ListSelect onBack={handleClickBack} onDismiss={onDismiss} />
      ) : noListSelected ? (
        <ListIntroduction onSelectList={handleSelectListIntroduction} />
      ) : (
        <CurrencySearch
          isOpen={isOpen}
          otherSelectedCurrency={otherSelectedCurrency}
          selectedCurrency={selectedCurrency}
          showCommonBases={showCommonBases}
          onChangeList={handleClickChangeList}
          onCurrencySelect={handleCurrencySelect}
          onDismiss={onDismiss}
        />
      )}
    </ModalWrapper>
  );
}
