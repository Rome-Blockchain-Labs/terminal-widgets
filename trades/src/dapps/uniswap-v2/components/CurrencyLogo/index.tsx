import { Currency, ETHER, Token } from '@rbl/velox-common/uniV2ClonesSDK';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';

import Logo from '../../../../components/logo';
import { NetworkName } from '../../../../constants/networkExchange';
import { getNetworkIcon } from '../../../../constants/networkExchange/icons/networkLogos';
import { DappContext } from '../../../../contexts';
import { WrappedTokenInfo } from '../../../../types';
import { getDefaultCurrencySymbol } from '../../../../utils';
import useHttpLocations from '../../hooks/useHttpLocations';

const getTokenLogoURL = (address: string, network: NetworkName) => {
  switch (network) {
    case NetworkName.AVALANCHE:
      return `https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/${address}/logo.png`;
    case NetworkName.MOONRIVER:
      return `https://raw.githubusercontent.com/solarbeamio/solarbeam-tokenlist/main/assets/moonriver/${address}/logo.png`;
    case NetworkName.BINANCE:
      return `https://pancakeswap.finance/images/tokens/${address}.png`;
    case NetworkName.METIS:
      return `https://raw.githubusercontent.com/Netswap/tokens/master/assets/${address}/logo.png`;
    default:
      //ethereum
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
  }
};

const StyledEthereumLogo = styled.span<{ marginRight?: string }>`
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
  overflow: hidden;
  ${({ marginRight }) => marginRight && `margin-right: ${marginRight};`}
`;

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
`;

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const { network } = useContext(DappContext);
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI : undefined
  );

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return [];

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address, network)];
      }

      return [getTokenLogoURL(currency.address, network)];
    }
    return [];
  }, [currency, uriLocations, network]);

  // @ts-ignore
  // todo use possiblyNativeCurrency
  if (currency.isNative) {
    const nativeCurrencyIcon = getNetworkIcon(network) as any;
    return (
      <StyledEthereumLogo style={style}>
        {React.cloneElement(nativeCurrencyIcon, {
          height: size ? parseInt(size) : undefined,
          width: size ? parseInt(size) : undefined,
        })}
      </StyledEthereumLogo>
    );
  }

  return (
    <StyledLogo
      alt={`${getDefaultCurrencySymbol(currency) ?? 'token'} logo`}
      size={size}
      srcs={srcs}
      style={style}
    />
  );
}
