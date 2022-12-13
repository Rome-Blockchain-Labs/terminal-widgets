import { NetworkName } from '../../index';
import { Avalanche2Icon } from './Avalanche2';
import { Binance2Icon } from './Binance2';
import { Ethereum2Icon } from './Ethereum2';
import KlaytnIcon from './Klaytn';
import { Metis } from './Metis';
import { Moonbeam } from './Moonbeam';
import { Moonriver } from './Moonriver';

export const getNetworkIcon = (network: NetworkName) => {
  switch (network) {
    case NetworkName.AVALANCHE:
      return <Avalanche2Icon />;
    case NetworkName.BINANCE:
      return <Binance2Icon />;
    case NetworkName.ETHEREUM:
      return <Ethereum2Icon />;
    case NetworkName.FUJI:
      return <Avalanche2Icon />;
    case NetworkName.MOONBEAM:
      return <Moonbeam />;
    case NetworkName.MOONRIVER:
      return <Moonriver />;
    case NetworkName.METIS:
      return <Metis />;
    case NetworkName.KLAYTN:
      return <KlaytnIcon />
    default:
      throw new Error(`Could not get icon for ${network}`);
  }
};
