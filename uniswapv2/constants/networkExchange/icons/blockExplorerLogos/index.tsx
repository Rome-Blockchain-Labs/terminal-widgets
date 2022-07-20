import { NetworkName } from '../../index';
import { Avalanche2Icon } from '../networkLogos/Avalanche2';
import { Metis } from '../networkLogos/Metis';
import { Moonbeam } from '../networkLogos/Moonbeam';
import { Moonriver } from '../networkLogos/Moonriver';
import { BSCScanIcon } from './BSCScan';
import { EthScanIcon } from './EthScan';
import { SnowTraceIcon } from './SnowTrace';

export const getNetworkExplorerIconByChainId = (network?: NetworkName) => {
  switch (network) {
    case NetworkName.AVALANCHE:
      return SnowTraceIcon;
    case NetworkName.BINANCE:
      return BSCScanIcon;
    case NetworkName.ETHEREUM:
      return EthScanIcon;
    case NetworkName.FUJI:
      return Avalanche2Icon;
    case NetworkName.MOONBEAM:
      return Moonbeam;
    case NetworkName.MOONRIVER:
      return Moonriver;
    case NetworkName.METIS:
      return Metis;
    default:
      throw new Error(`Could not get icon for ${network}`);
  }
};
