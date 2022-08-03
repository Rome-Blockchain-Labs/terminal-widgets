import { createContext, FC, useContext, useState } from 'react';

type ProviderProps = {};
type WalletsContextState = {
  selectingNetwork:any;
  toggleSelectingNetwork:any;
};

const defaultState: WalletsContextState = {
  selectingNetwork: undefined,
  toggleSelectingNetwork:()=>{}
};

const WalletsSelectionContext = createContext<WalletsContextState>(defaultState);

export const WalletSelectionContextProvider: FC<ProviderProps> = (props) => {
  const [ selectingNetwork, setSelectingNetwork ] = useState(false)
  const toggleSelectingNetwork = ()=>{
    setSelectingNetwork(b=>!b)
  }
  return (
    <WalletsSelectionContext.Provider
      value={{selectingNetwork, toggleSelectingNetwork}}
    >
      {props.children}
    </WalletsSelectionContext.Provider>
  );
};

export function useWalletsSelection() {
  const context = useContext(WalletsSelectionContext);
  if (context === undefined) {
    throw new Error('useWalletSelection must be used within a useWalletSelectionProvider');
  }
  return context;
}
