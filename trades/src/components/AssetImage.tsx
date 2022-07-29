import { FC, memo, useEffect, useState } from 'react';
import { styled } from 'twin.macro';

import DefaultAssetSvg from '../assets/svgs/default-asset.svg';
import { NetworkName } from '../constants/networkExchange';
import { getAssetLogoLink } from '../utils';

const StyledImg = styled.img<{ width: string; height: string }>`
  ${({ height, width }) => `
    width: ${width};
    height: ${height};
  `}
`;

const AssetImage: FC<{
  blockchain: NetworkName;
  tokenAddress: string;
  width: string;
  height: string;
}> = memo(({ blockchain, height, tokenAddress, width }) => {
  const [isSafe, setIsSafe] = useState(false);

  useEffect(() => {
    const url = getAssetLogoLink(blockchain, tokenAddress);
    const img = new Image();
    img.src = url;

    if (img.complete) {
      setIsSafe(true);
    } else {
      img.onload = () => {
        setIsSafe(true);
      };

      img.onerror = () => {
        setIsSafe(false);
      };
    }
  }, [blockchain, tokenAddress]);

  if (!isSafe) {
    return (
      <StyledImg
        height={height}
        src={DefaultAssetSvg}
        tw="rounded-full"
        width={width}
      />
    );
  }

  return (
    <StyledImg
      height={height}
      src={getAssetLogoLink(blockchain, tokenAddress)}
      tw="rounded-full"
      width={width}
    />
  );
});

export default AssetImage;
