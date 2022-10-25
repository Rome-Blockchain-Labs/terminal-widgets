import {
  BeamSwap,
  PancakeswapIcon,
  PangolinIcon,
  Solarbeam,
  SushiswapIcon,
  TraderJoeIcon,
  UniswapIcon,
} from '../components/icons';
import { CrystalValeIcon } from '../components/icons/CrystalVale';
import { WidgetType } from '../types';
import { ExchangeType } from './networkExchange';

export type Exchange = {
  icon: any;
  iconAlt: any;
  name: ExchangeType;
  title: string;
  widgetType: WidgetType;
  exchangeType: ExchangeType;
};

export const EXCHANGES: Array<Exchange> = [
  {
    exchangeType: ExchangeType.PANGOLIN,
    icon: PangolinIcon,
    iconAlt: PangolinIcon,
    name: ExchangeType.PANGOLIN,
    title: 'PANGOLIN',
    widgetType: WidgetType.PANGOLIN,
  },
  {
    exchangeType: ExchangeType.TRADERJOE,
    icon: TraderJoeIcon,
    iconAlt: TraderJoeIcon,
    name: ExchangeType.TRADERJOE,
    title: 'TRADERJOE',
    widgetType: WidgetType.TRADERJOE,
  },
  {
    exchangeType: ExchangeType.PANCAKESWAP,
    icon: PancakeswapIcon,
    iconAlt: PancakeswapIcon,
    name: ExchangeType.PANCAKESWAP,
    title: 'PANCAKESWAP',
    widgetType: WidgetType.PANCAKESWAP,
  },
  {
    exchangeType: ExchangeType.BEAMSWAP,
    icon: BeamSwap,
    iconAlt: BeamSwap,
    name: ExchangeType.BEAMSWAP,
    title: 'BEAMSWAP',
    widgetType: WidgetType.BEAMSWAP,
  },
  {
    exchangeType: ExchangeType.SOLARBEAM,
    icon: Solarbeam,
    iconAlt: Solarbeam,
    name: ExchangeType.SOLARBEAM,
    title: 'SOLARBEAM',
    widgetType: WidgetType.SOLARBEAM,
  },
  {
    exchangeType: ExchangeType.SUSHISWAP,
    icon: SushiswapIcon,
    iconAlt: SushiswapIcon,
    name: ExchangeType.SUSHISWAP,
    title: 'SUSHISWAP',
    widgetType: WidgetType.SUSHISWAP,
  },
  {
    exchangeType: ExchangeType.UNISWAPV2,
    icon: UniswapIcon,
    iconAlt: UniswapIcon,
    name: ExchangeType.UNISWAPV2,
    title: 'UNISWAPV2',
    widgetType: WidgetType.UNISWAPV2,
  },
  {
    exchangeType: ExchangeType.CRYSTALVALE,
    icon: CrystalValeIcon,
    iconAlt: CrystalValeIcon,
    name: ExchangeType.CRYSTALVALE,
    title: 'CRYSTALVALE',
    widgetType: WidgetType.CRYSTALVALE,
  },
];

export const EXCHANGE_TITLE: { [key: string]: string } = {
  beamswap: 'BEAMSWAP',
  pancakeswap: 'PANCAKESWAP',
  pangolin: 'PANGOLIN',
  safeswap: 'SAFESWAP',
  solarbeam: 'SOLARBEAM',
  sushiswap: 'SUSHISWAP',
  traderjoe: 'TRADER JOE',
  uniswapv2: 'UNISWAPV2',
  uniswapv3: 'UNISWAPV3',
};
