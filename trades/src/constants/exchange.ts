import {
  BiswapIcon,
  Kyber,
  MdexIcon,
  PancakeswapIcon,
  PangolinIcon,
  Solarbeam,
  SushiswapIcon,
  TraderJoeIcon,
  UniswapIcon,
  Velox2Icon,
  VeloxIcon,
} from '../components/icons';
import { BeamSwap } from '../components/icons';
import { HermesProtocolIcon } from '../components/icons/HermesProtocol';
import { NetswapIcon } from '../components/icons/Netswap';
import { WidgetType } from '../types';
import { ExchangeName } from './multichain';
import { ExchangeType } from './networkExchange';

export const EXCHANGES: Array<{
  icon: React.ElementType;
  iconAlt: any;
  name: string;
  title: ExchangeName;
  widgetType: WidgetType;
  exchangeType?: ExchangeType;
}> = [
  {
    icon: Velox2Icon,
    iconAlt: VeloxIcon,
    name: 'velox',
    title: 'VELOX',
    widgetType: WidgetType.VELOX,
  },
  {
    exchangeType: ExchangeType.PANGOLIN,
    icon: PangolinIcon,
    iconAlt: PangolinIcon,
    name: 'pangolin',
    title: 'PANGOLIN',
    widgetType: WidgetType.PANGOLIN,
  },
  {
    exchangeType: ExchangeType.TRADERJOE,
    icon: TraderJoeIcon,
    iconAlt: TraderJoeIcon,
    name: 'traderjoe',
    title: 'TRADERJOE',
    widgetType: WidgetType.TRADERJOE,
  },
  {
    exchangeType: ExchangeType.DMM,
    icon: Kyber,
    iconAlt: Kyber,
    name: 'kyberdmm',
    title: 'KYBERSWAP',
    widgetType: WidgetType.KYBERSWAP,
  },
  {
    exchangeType: ExchangeType.BISWAP,
    icon: BiswapIcon,
    iconAlt: BiswapIcon,
    name: 'biswap',
    title: 'BISWAP',
    widgetType: WidgetType.BISWAP,
  },
  {
    exchangeType: ExchangeType.PANCAKESWAP,
    icon: PancakeswapIcon,
    iconAlt: PancakeswapIcon,
    name: 'pancakeswap',
    title: 'PANCAKESWAP',
    widgetType: WidgetType.PANCAKESWAP,
  },
  {
    exchangeType: ExchangeType.MDEX,
    icon: MdexIcon,
    iconAlt: MdexIcon,
    name: 'mdex',
    title: 'MDEX',
    widgetType: WidgetType.MDEX,
  },
  {
    exchangeType: ExchangeType.BEAMSWAP,
    icon: BeamSwap,
    iconAlt: BeamSwap,
    name: 'beamswap',
    title: 'BEAMSWAP',
    widgetType: WidgetType.BEAMSWAP,
  },
  {
    exchangeType: ExchangeType.SOLARBEAM,
    icon: Solarbeam,
    iconAlt: Solarbeam,
    name: 'solarbeam',
    title: 'SOLARBEAM',
    widgetType: WidgetType.SOLARBEAM,
  },
  {
    exchangeType: ExchangeType.NETSWAP,
    icon: NetswapIcon,
    iconAlt: NetswapIcon,
    name: 'netswap',
    title: 'NETSWAP',
    widgetType: WidgetType.NETSWAP,
  },
  {
    exchangeType: ExchangeType.HERMESPROTOCOL,
    icon: HermesProtocolIcon,
    iconAlt: HermesProtocolIcon,
    name: 'hermesprotocol',
    title: 'HERMES',
    widgetType: WidgetType.HERMESPROTOCOL,
  },
  {
    exchangeType: ExchangeType.SUSHISWAP,
    icon: SushiswapIcon,
    iconAlt: SushiswapIcon,
    name: 'sushiswap',
    title: 'SUSHISWAP',
    widgetType: WidgetType.SUSHISWAP,
  },
  {
    exchangeType: ExchangeType.UNISWAPV2,
    icon: UniswapIcon,
    iconAlt: UniswapIcon,
    name: 'uniswapv2',
    title: 'UNISWAPV2',
    widgetType: WidgetType.UNISWAPV2,
  },
  {
    exchangeType: ExchangeType.UNISWAPV3,
    icon: UniswapIcon,
    iconAlt: UniswapIcon,
    name: 'uniswapv3',
    title: 'UNISWAPV3',
    widgetType: WidgetType.UNISWAPV3,
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
