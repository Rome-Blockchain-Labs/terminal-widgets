import 'twin.macro';

import { FC } from 'react';

interface Props {
  title?: string;
}

const TokenSymbol: FC<Props> = ({ children, title }) => {
  return <span title={title} tw="text-xl text-white font-semibold max-w-[80px] overflow-ellipsis overflow-hidden">{children}</span>;
};

export default TokenSymbol;
