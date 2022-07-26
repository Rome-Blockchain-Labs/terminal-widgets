import tw, { styled } from 'twin.macro';

export interface IIconProps {
  color?: string;
  className?: string;
  activeColor?: string;
  active?: boolean;
  grayscale?: boolean;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  activeBackgroundColor?: string;
  ref?: any;
  type?: any;
  isBackground?: boolean;
}

export const SVG = styled.svg<{
  hoverColor?: string;
  hoverStrokeColor?: string;
}>`
  &:hover {
    * {
      ${({ hoverColor, hoverStrokeColor }) =>
        `fill: ${hoverColor}; stroke: ${hoverStrokeColor}`}
    }
  }
`;

export const pickFillColor = (
  regularColor: string,
  active?: boolean,
  activeColor?: string,
  grayscale?: boolean,
  grayscaleColor?: string
): string => {
  if (active && activeColor) return activeColor;
  if (grayscale && grayscaleColor) return grayscaleColor;
  return regularColor;
};

export const TransitionPath = tw.path`transition`;
export const TransitionCircle = tw.circle`transition`;
export const TransitionEllipse = tw.ellipse`transition`;
export const TransitionG = tw.g`transition`;
export const TransitionText = tw.text`transition`;
export const TransitionRect = tw.rect`transition`;

export * from '../../constants/networkExchange/icons/blockExplorerLogos/SnowTrace';
export * from '../../constants/networkExchange/icons/networkLogos/Avalanche2';
export * from '../../constants/networkExchange/icons/networkLogos/Binance2';
export * from '../../constants/networkExchange/icons/networkLogos/Ethereum2';
export * from '../../constants/networkExchange/icons/networkLogos/Moonbeam';
export * from '../../constants/networkExchange/icons/networkLogos/Moonriver';
export * from './AboutUs';
export * from './Algorand';
export * from './Algorand2';
export * from './ArrowCircleDown';
export * from './ArrowCircleLeft';
export * from './ArrowCircleUp';
export * from './ArrowDown';
export * from './ArrowUp';
export * from './AssetBridge';
export * from './Avalanche';
export * from './AvaxBridge';
export * from './BeamSwap';
export * from './Benqi';
export * from './BenqiBridge';
export * from './Binance';
export * from './Biswap';
export * from './Cardano';
export * from './Cardano2';
export * from './CChain';
export * from './Chart';
export * from './Chart2';
export * from './Check';
export * from './ChevronDown';
export * from './ChevronDown2';
export * from './ChevronUp';
export * from './Clipboard';
export * from './Close';
export * from './Coinmarketcap';
export * from './Column1';
export * from './Column2';
export * from './Column3';
export * from './ConnectWallet';
export * from './ContactUs';
export * from './Cosmos';
export * from './Cosmos2';
export * from './Cream';
export * from './Dashboard';
export * from './Dexter';
export * from './EllipsisFinance';
export * from './EllipsisFinance2';
export * from './Email';
export * from './Eos';
export * from './Eos2';
export * from './Ethereum';
export * from './Evodex';
export * from './Exchange';
export * from './Extend';
export * from './Eye';
export * from './EyeHide';
export * from './Faqs';
export * from './Favorites';
export * from './FilledStar';
export * from './GravityDex';
export * from './Hand';
export * from './Hedera';
export * from './Hedera2';
export * from './HermesProtocol';
export * from './Info';
export * from './Kuu';
export * from './KuuLogo';
export * from './Kyber';
export * from './Lending';
export * from './Link';
export * from './Lunadex';
export * from './Market';
export * from './Mdex';
export * from './Menu';
export * from './MoreActions';
export * from './MyPool';
export * from './Ndex';
export * from './Netswap';
export * from './Nuls';
export * from './Nuls2';
export * from './Overview';
export * from './Pancakeswap';
export * from './Pangolin';
export * from './Polkadot';
export * from './Polkadot2';
export * from './Polkaswap';
export * from './Polygon';
export * from './Polygon2';
export * from './Pool';
export * from './PreferredToken';
export * from './Quickswap';
export * from './Raydium';
export * from './RectPlus';
export * from './Rewards';
export * from './Safeswap';
export * from './Safeswap2';
export * from './Search';
export * from './Serumdex';
export * from './Settings';
export * from './Sigmadex';
export * from './SignIn';
export * from './Solana';
export * from './Solana2';
export * from './SolarBeam';
export * from './Sort';
export * from './Star';
export * from './Stellar';
export * from './Stellar2';
export * from './Stellarterm';
export * from './Sundaeswap';
export * from './Sushiswap';
export * from './Swap';
export * from './Table';
export * from './Table2';
export * from './Telegram';
export * from './Tezos';
export * from './Tezos2';
export * from './TraderJoe';
export * from './TradingBot';
export * from './TransactionIn';
export * from './TransactionOut';
export * from './Tron';
export * from './Tron2';
export * from './Troscan';
export * from './Twitter';
export * from './Uniswap';
export * from './Velox';
export * from './Velox2';
export * from './VeloxLogo';
export * from './WalletTracker';
export * from './Widget';
export * from './YieldFarm';
