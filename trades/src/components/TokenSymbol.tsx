import 'twin.macro';

import { FC } from 'react';

const TokenSymbol: FC = ({ children }) => {
  return <span tw="text-xl text-white font-semibold">{children}</span>;
};

export default TokenSymbol;
