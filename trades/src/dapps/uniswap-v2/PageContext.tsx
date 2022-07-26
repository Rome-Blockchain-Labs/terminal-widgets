import { createContext, FC, useContext, useState } from 'react';

import { UniswapPage } from './App';
type PageContextState = {
  page: any;
  setPage: any;
};

const defaultContextState: PageContextState = {
  page: 0,
  setPage: () => {},
};

export const PageContext = createContext<PageContextState>(defaultContextState);

export const PageContextProvider: FC = ({ children }) => {
  const [page, setPage] = useState(UniswapPage.SWAP);

  return (
    <PageContext.Provider value={{ page, setPage }}>
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
