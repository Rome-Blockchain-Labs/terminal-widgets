import { useSelector } from 'react-redux';

import { PinkTooltip } from '../../../../components/Icons';
import {
  composeEtherscanAddressUrl,
  detailsByChain,
} from '../../../../utils/network-mapping';

const TokenExternalLink = (props) => {
  const { token } = props;
  const chainHex = useSelector(
    (state) => state?.velox?.wallet.connection.chainHex
  );

  const navigateToBlockExplorer = () => {
    let url = composeEtherscanAddressUrl(chainHex, token.id);
    window.open(url, '_blank');
  };
  const Icon = detailsByChain(chainHex).explorerIcon;

  return (
    <PinkTooltip title={'View contract details'}>
      <img
        alt={'IconInfo'}
        src={Icon}
        style={{ cursor: 'pointer' }}
        width={20}
        onClick={navigateToBlockExplorer}
      />
    </PinkTooltip>
  );
};
export default TokenExternalLink;
