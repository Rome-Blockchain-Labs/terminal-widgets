import { createContext, FC, useContext, useState } from 'react';

import { UniswapPage } from './App';
type PageContextState = {
  page: any;
  setPage: any;
  walletVisibility: boolean;
  setWalletVisibility: (visibility: boolean) => void;
};

const defaultContextState: PageContextState = {
  page: 0,
  setPage: () => {},
  setWalletVisibility: () => {},
  walletVisibility: false,
};

export const PageContext = createContext<PageContextState>(defaultContextState);

export const PageContextProvider: FC = ({ children }) => {
  const [page, setPage] = useState(UniswapPage.SWAP);
  const [walletVisibility, setWalletVisibility] = useState(false);

  return (
    <PageContext.Provider
      value={{ page, setPage, setWalletVisibility, walletVisibility }}
    >
      {children}
    </PageContext.Provider>
  );
};

export function usePageContext() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePageContext must be used within a PageContextProvider');
  }
  return context;
}
