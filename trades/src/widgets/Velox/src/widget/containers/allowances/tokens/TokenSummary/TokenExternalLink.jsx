import React from 'react';
import { useSelector } from 'react-redux';

import IconAvascan from '../../../../../assets/icons/icon-avascan.svg';
import IconEtherscan from '../../../../../assets/icons/icon-Etherscan.svg';
import { composeEtherscanAddressUrl } from '../../../../../utils/network-mapping';
import { PinkTooltip } from '../../../../components/Icons';

const TokenExternalLink = (props) => {
  const { token } = props;
  const chainHex = useSelector(
    (state) => state?.velox?.wallet.connection.chainHex
  );

  const navigateToBlockExplorer = () => {
    let url = composeEtherscanAddressUrl(chainHex, token.id);
    window.open(url, '_blank');
  };
  const Icon = chainHex === '0xa86a' ? IconAvascan : IconEtherscan; //todo abstract this

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
