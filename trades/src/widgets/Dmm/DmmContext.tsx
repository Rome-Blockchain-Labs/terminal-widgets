import { createContext, FC, ReactNode, useState } from 'react';

export enum DmmPage {
  SWAP,
  POOL,
  POOLFINDER,
  POOLS,
  CREATEPOOL,
  ADDLIQUIDITY,
  REMOVELIQUIDITY,
}

type DmmContextState = {
  page: DmmPage;
  setPage: (page: DmmPage) => void;
  setCurrencyIdA: (currencyId: string | undefined) => void;
  setCurrencyIdB: (currencyId: string | undefined) => void;
  setPairAddress: (pairAddress: string) => void;
  widgetId: string;
  currencyIdA: string | undefined;
  currencyIdB: string | undefined;
  pairAddress: string;
};

const initialState: DmmContextState = {
  currencyIdA: '',
  currencyIdB: '',
  page: DmmPage.SWAP,
  pairAddress: '',
  setCurrencyIdA: () => {},
  setCurrencyIdB: () => {},
  setPage: () => {},
  setPairAddress: () => {},
  widgetId: '',
};

export const DmmContext = createContext<DmmContextState>(initialState);

type DmmContextProviderProps = {
  children: ReactNode;
  uid: string;
};

export const DmmContextProvider: FC<DmmContextProviderProps> = ({
  children,
  uid,
}) => {
  const [page, setPage] = useState<DmmPage>(DmmPage.SWAP);
  const [currencyIdA, setCurrencyIdA] = useState<string | undefined>(undefined);
  const [currencyIdB, setCurrencyIdB] = useState<string | undefined>(undefined);
  const [pairAddress, setPairAddress] = useState<string>('');

  return (
    <DmmContext.Provider
      value={{
        currencyIdA,
        currencyIdB,
        page,
        pairAddress,
        setCurrencyIdA,
        setCurrencyIdB,
        setPage,
        setPairAddress,
        widgetId: uid,
      }}
    >
      {children}
    </DmmContext.Provider>
  );
};
