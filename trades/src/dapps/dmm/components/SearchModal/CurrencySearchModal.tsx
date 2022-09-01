import { Currency, Token } from '@dynamic-amm/sdk';
import { TokenList } from '@uniswap/token-lists';
import React, { useCallback, useEffect, useState } from 'react';

import { ModalWrapper } from '../../../../components/modals';
import useLast from '../../hooks/useLast';
import usePrevious from '../../hooks/usePrevious';
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo';
import { CurrencySearch } from './CurrencySearch';
import { ImportList } from './ImportList';
import { ImportToken } from './ImportToken';
import Manage from './Manage';

interface CurrencySearchModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
}

export enum CurrencyModalView {
  search,
  manage,
  importToken,
  importList,
}

export default function CurrencySearchModal({
  isOpen,
  onCurrencySelect,
  onDismiss,
  otherSelectedCurrency,
  selectedCurrency,
  showCommonBases = true,
}: CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<CurrencyModalView>(
    CurrencyModalView.manage
  );
  const lastOpen = useLast(isOpen);

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setModalView(CurrencyModalView.search);
    }
  }, [isOpen, lastOpen]);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect]
  );

  // for token import view
  const prevView = usePrevious(modalView);

  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>();

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>();
  const [listURL, setListUrl] = useState<string | undefined>();

  // change min height if not searching
  const minHeight =
    modalView === CurrencyModalView.importToken ||
    modalView === CurrencyModalView.importList
      ? 40
      : 80;

  return (
    // <Modal
    //   isOpen={isOpen}
    //   maxHeight={80}
    //   minHeight={minHeight}
    //   onDismiss={onDismiss}
    // >
    <ModalWrapper
      noPadding
      isOpen={isOpen}
      maxHeight={550}
      minHeight={minHeight}
      onDismiss={onDismiss}
    >
      {modalView === CurrencyModalView.search ? (
        <CurrencySearch
          isOpen={isOpen}
          otherSelectedCurrency={otherSelectedCurrency}
          selectedCurrency={selectedCurrency}
          setImportToken={setImportToken}
          showCommonBases={showCommonBases}
          showImportView={() => setModalView(CurrencyModalView.importToken)}
          showManageView={() => setModalView(CurrencyModalView.manage)}
          onCurrencySelect={handleCurrencySelect}
          onDismiss={onDismiss}
        />
      ) : modalView === CurrencyModalView.importToken && importToken ? (
        <ImportToken
          handleCurrencySelect={handleCurrencySelect}
          list={
            importToken instanceof WrappedTokenInfo
              ? importToken.list
              : undefined
          }
          tokens={[importToken]}
          onBack={() =>
            setModalView(
              prevView && prevView !== CurrencyModalView.importToken
                ? prevView
                : CurrencyModalView.search
            )
          }
          onDismiss={onDismiss}
        />
      ) : modalView === CurrencyModalView.importList &&
        importList &&
        listURL ? (
        <ImportList
          list={importList}
          listURL={listURL}
          setModalView={setModalView}
          onDismiss={onDismiss}
        />
      ) : modalView === CurrencyModalView.manage ? (
        <Manage
          setImportList={setImportList}
          setImportToken={setImportToken}
          setListUrl={setListUrl}
          setModalView={setModalView}
          onDismiss={onDismiss}
        />
      ) : (
        ''
      )}
    </ModalWrapper>
  );
}
