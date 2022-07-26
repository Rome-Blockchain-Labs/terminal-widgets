import React from 'react';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';
import styled from 'styled-components';

import { PinkTooltip } from '../../../components/Icons';
import { PartnerStrategyDeployed } from '../../../model/strategy';
import { firstAndLast } from '../../../utils/firstAndLast';
import {
  composeEtherscanTxUrl,
  detailsByChain,
} from '../../../utils/network-mapping';

const TxLink = styled.div`
  color: #1d7c82;
  font-family: 'Fira Code', monospace;
  cursor: pointer;
  :hover {
    color: #08333c;
  }
`;

const TxHashIcon = (props: { strategy: PartnerStrategyDeployed }) => {
  const { strategy } = props;
  const uniqueId = 'id' + String(strategy.id);
  const { transactionHash } = strategy;
  const Icon = detailsByChain(strategy.chainId).explorerIcon;

  /** todo the contents of this if below can be removed when non array string type is deprecated **/
  if (!transactionHash || typeof transactionHash === 'string') {
    if (!transactionHash) {
      return null;
    }
    const navigateToEtherScan = () => {
      let url = composeEtherscanTxUrl(strategy.chainId, transactionHash);
      window.open(url, '_blank');
    };
    return (
      <PinkTooltip title={'View transaction record'}>
        <img
          alt={'IconInfo'}
          src={Icon}
          style={{ cursor: 'pointer' }}
          width={20}
          onClick={navigateToEtherScan}
        />
      </PinkTooltip>
    );
  }
  if (!Array.isArray(transactionHash)) {
    return null;
  }
  /** todo the contents of the if above can be removed when non array string type is deprecated **/

  // don't show if there are no links
  if (!transactionHash.length) {
    return null;
  }
  // a single link doesn't need a popover
  if (transactionHash.length === 1) {
    const navigateToEtherScan = () => {
      let url = composeEtherscanTxUrl(strategy.chainId, transactionHash[0]);
      window.open(url, '_blank');
    };
    return (
      <PinkTooltip title={'View transaction record'}>
        <img
          alt={'IconInfo'}
          src={Icon}
          style={{ cursor: 'pointer' }}
          width={20}
          onClick={navigateToEtherScan}
        />
      </PinkTooltip>
    );
  }
  return (
    <span>
      <PinkTooltip title={'View transaction record'}>
        <img
          alt={'IconInfo'}
          id={uniqueId}
          src={Icon}
          style={{ cursor: 'pointer' }}
          width={20}
        />
      </PinkTooltip>
      <UncontrolledPopover
        placement={'left'}
        target={uniqueId}
        trigger="legacy"
      >
        <PopoverBody>
          {transactionHash.map((hash) => {
            const navigateToEtherScan = () => {
              let url = composeEtherscanTxUrl(strategy.chainId, hash);
              window.open(url, '_blank');
            };
            return (
              <TxLink key={hash} onClick={navigateToEtherScan}>
                {firstAndLast(hash, 6)}
                <br />
              </TxLink>
            );
          })}
        </PopoverBody>
      </UncontrolledPopover>
    </span>
  );
};
export default TxHashIcon;
