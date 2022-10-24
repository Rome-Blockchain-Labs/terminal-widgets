import {
  BeamSwap,
  BiswapIcon,
  HermesProtocolIcon,
  Kyber,
  MdexIcon,
  NetswapIcon,
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
    exchangeType: ExchangeType.DMM,
    icon: Kyber,
    iconAlt: Kyber,
    name: ExchangeType.DMM,
    title: 'KYBERSWAP',
    widgetType: WidgetType.KYBERSWAP,
  },
  {
    exchangeType: ExchangeType.BISWAP,
    icon: BiswapIcon,
    iconAlt: BiswapIcon,
    name: ExchangeType.BISWAP,
    title: 'BISWAP',
    widgetType: WidgetType.BISWAP,
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
    exchangeType: ExchangeType.MDEX,
    icon: MdexIcon,
    iconAlt: MdexIcon,
    name: ExchangeType.MDEX,
    title: 'MDEX',
    widgetType: WidgetType.MDEX,
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
    exchangeType: ExchangeType.NETSWAP,
    icon: NetswapIcon,
    iconAlt: NetswapIcon,
    name: ExchangeType.NETSWAP,
    title: 'NETSWAP',
    widgetType: WidgetType.NETSWAP,
  },
  {
    exchangeType: ExchangeType.HERMESPROTOCOL,
    icon: HermesProtocolIcon,
    iconAlt: HermesProtocolIcon,
    name: ExchangeType.HERMESPROTOCOL,
    title: 'HERMES PROTOCOL',
    widgetType: WidgetType.HERMESPROTOCOL,
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
    title: 'UNISWAP V2',
    widgetType: WidgetType.UNISWAPV2,
  },
  {
    exchangeType: ExchangeType.UNISWAPV3,
    icon: UniswapIcon,
    iconAlt: UniswapIcon,
    name: ExchangeType.UNISWAPV3,
    title: 'UNISWAP V3',
    widgetType: WidgetType.UNISWAPV3,
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
  biswap: 'BISWAP',
  'ellipsis.finance': 'ELLIPSIS.FINANCE',
  hermesprotocol: 'Hermes',
  kyberdmm: 'KYBERSWAP',
  mdex: 'MDEX',
  netswap: 'NETSWAP',
  pancakeswap: 'PANCAKESWAP',
  pangolin: 'PANGOLIN',
  safeswap: 'SAFESWAP',
  solarbeam: 'SOLARBEAM',
  sushiswap: 'SUSHISWAP',
  traderjoe: 'TRADER JOE',
  uniswapv2: 'UNISWAPV2',
  uniswapv3: 'UNISWAPV3',
};
