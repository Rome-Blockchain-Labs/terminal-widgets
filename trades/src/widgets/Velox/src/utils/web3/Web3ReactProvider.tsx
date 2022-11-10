import { FC } from 'react';

type Web3ReactProviderProps = {
  pollingInterval: number; // 12000 miliseconds by default
};

export const Web3ReactProvider: FC<Web3ReactProviderProps> = ({ children }) => {
  return <>{children}</>;
};
