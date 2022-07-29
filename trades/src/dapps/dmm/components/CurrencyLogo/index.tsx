import { ChainId, Currency, ETHER } from '@dynamic-amm/sdk';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import BnbLogo from '../../assets/images/bnb-logo.png';
import EthereumLogo from '../../assets/images/ethereum-logo.png';
import AvaxLogo from '../../assets/networks/avax-network.png';
import FtmLogo from '../../assets/networks/fantom-network.png';
import MaticLogo from '../../assets/networks/polygon-network.png';
import useHttpLocations from '../../hooks/useHttpLocations';
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo';
import { getTokenLogoURL } from '../../utils';
import Logo from '../Logo';

const StyledNativeCurrencyLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`;

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  object-fit: contain;
`;

const logo: { readonly [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: EthereumLogo,
  [ChainId.ROPSTEN]: EthereumLogo,
  [ChainId.RINKEBY]: EthereumLogo,
  [ChainId.GÖRLI]: EthereumLogo,
  [ChainId.KOVAN]: EthereumLogo,
  [ChainId.MATIC]: MaticLogo,
  [ChainId.MUMBAI]: MaticLogo,
  [ChainId.BSCTESTNET]: BnbLogo,
  [ChainId.BSCMAINNET]: BnbLogo,
  [ChainId.AVAXTESTNET]: AvaxLogo,
  [ChainId.AVAXMAINNET]: AvaxLogo,
  [ChainId.FANTOM]: FtmLogo,
};

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const { chainId } = useWallets();
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI : undefined
  );

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return [];

    if (!!(currency as any)?.address) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address, chainId)];
      }

      return [getTokenLogoURL((currency as any)?.address, chainId)];
    }

    return [];
  }, [chainId, currency, uriLocations]);

  if (currency === ETHER && chainId) {
    return (
      <StyledNativeCurrencyLogo
        alt={`${currency.symbol}Logo`}
        size={size}
        src={logo[chainId as keyof typeof logo]}
        style={style}
      />
    );
  }

  return (
    <StyledLogo
      alt={`${currency?.symbol ?? 'token'} logo`}
      size={size}
      srcs={srcs}
      style={style}
    />
  );
}
