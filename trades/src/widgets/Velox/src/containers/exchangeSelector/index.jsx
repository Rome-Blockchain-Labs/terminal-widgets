import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { NetworkName } from '../../../../../constants/networkExchange';
import IconPancakeSwap from '../../assets/icons/icon-pancake.svg';
import IconPangolin from '../../assets/icons/icon-pangolin.svg';
import IconRinkeby from '../../assets/icons/icon-rinkeby.png';
import IconSushi from '../../assets/icons/icon-sushi.svg';
import IconTraderJoe from '../../assets/icons/icon-traderjoe.svg';
import IconUni from '../../assets/icons/icon-uni.svg';
import { SelectableToggleImg } from '../../assets/styled';
import { PinkTooltip } from '../../components/Icons';
import { enableRinkeby } from '../../config';
import { MAIN_NETWORKS, TEST_NETWORKS } from '../../constants';
import { setSelectedExchange } from '../../redux/strategy/strategySlice';
import { useSwitchNetwork } from '../../utils/web3';
import {
  pancakeswap,
  pangolin,
  rinkebyUniswap,
  sushiswap,
  traderjoe,
  uniswapV2,
} from './allowableExchanges';

const Container = styled.div`
  display: flex;
  gap: 10px;
  flex-flow: wrap;
`;

const LabeledImgBox = styled(SelectableToggleImg)`
  position: relative;
  :after {
    content: '${({ label }) => label}';
    position: absolute;
    bottom: -3px;
    right: -3px;
    border-radius: 10px;
    background-color: #1c646c;
    width: 20px;
    height: 20px;
    color: #08333c;
    text-align: center;
    font-weight: bold;
    padding: 1px;
  }
`;

const CenterAligned = styled.div`
  align-self: flex-end;
  flex: 1;
`;

const ExchangeIcon = styled.div`
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const ExchangeSelector = (props) => {
  const dispatch = useDispatch();
  const { switchNetwork } = useSwitchNetwork();
  const { selectedExchange } = useSelector((state) => state?.velox?.strategy);

  const { chainHex } = useSelector((state) => state?.velox?.wallet.connection);

  // useEffect(() => {
  //   const defaultNetwork = getDefaultNetworkName();
  //   const networkParams = getNetworkParams(defaultNetwork.toLowerCase());
  //   switchNetwork(networkParams);
  // }, [switchNetwork]);

  const switchToRinkeby = () => {
    switchNetwork(NetworkName.RINKEBY);
    dispatch(setSelectedExchange(rinkebyUniswap));
  };

  const switchToPangolin = () => {
    switchNetwork(NetworkName.AVALANCHE);
    dispatch(setSelectedExchange(pangolin));
  };
  const switchToTraderJoe = () => {
    switchNetwork(NetworkName.AVALANCHE);
    dispatch(setSelectedExchange(traderjoe));
  };

  const switchToBSC = (exchange) => {
    switchNetwork(NetworkName.BINANCE);
    dispatch(setSelectedExchange(exchange));
  };

  const switchToEthereum = (exchange) => {
    switchNetwork(NetworkName.ETHEREUM);
    dispatch(setSelectedExchange(exchange));
  };

  return (
    <Container>
      {enableRinkeby && (
        <ExchangeIcon
          disabled={parseInt(chainHex) !== TEST_NETWORKS.ethereum.chainId}
        >
          <SelectableToggleImg
            selected={rinkebyUniswap.key === selectedExchange?.key}
            onClick={switchToRinkeby}
          >
            <img
              alt={'rinkeby'}
              height={'50px'}
              src={IconRinkeby}
              style={{ height: '40px', width: '27px' }}
            />
          </SelectableToggleImg>
        </ExchangeIcon>
      )}
      <ExchangeIcon
        disabled={parseInt(chainHex) !== MAIN_NETWORKS.ethereum.chainId}
      >
        <SelectableToggleImg
          label={'Sushiswap'}
          selected={sushiswap.key === selectedExchange?.key}
          onClick={() => switchToEthereum(sushiswap)}
        >
          <PinkTooltip title={'SushiSwap'}>
            <img alt={'sushiswap'} src={IconSushi} />
          </PinkTooltip>
        </SelectableToggleImg>
      </ExchangeIcon>
      <ExchangeIcon
        disabled={parseInt(chainHex) !== MAIN_NETWORKS.ethereum.chainId}
      >
        <LabeledImgBox
          label={'V2'}
          selected={uniswapV2.key === selectedExchange?.key}
          onClick={() => switchToEthereum(uniswapV2)}
        >
          <PinkTooltip title={'Uniswap V2'}>
            <img alt={'uniswap v2'} src={IconUni} />
          </PinkTooltip>
        </LabeledImgBox>
      </ExchangeIcon>
      <ExchangeIcon
        disabled={parseInt(chainHex) !== MAIN_NETWORKS.ethereum.chainId}
      >
        <LabeledImgBox label={'V3'} style={{ cursor: 'default' }}>
          <PinkTooltip title={'Uniswap V3 coming soon!'}>
            <img alt={'uniswap v3'} src={IconUni} />
          </PinkTooltip>
        </LabeledImgBox>
      </ExchangeIcon>
      <ExchangeIcon
        disabled={parseInt(chainHex) !== MAIN_NETWORKS.avalanche.chainId}
      >
        <SelectableToggleImg
          label={'Pangolin'}
          selected={pangolin.key === selectedExchange?.key}
          onClick={switchToPangolin}
        >
          <PinkTooltip title={'Pangolin'}>
            <img alt={'pangolin'} src={IconPangolin} />
          </PinkTooltip>
        </SelectableToggleImg>
      </ExchangeIcon>
      <ExchangeIcon
        disabled={parseInt(chainHex) !== MAIN_NETWORKS.avalanche.chainId}
      >
        <SelectableToggleImg
          label={'TraderJoe'}
          selected={traderjoe.key === selectedExchange.key}
          onClick={switchToTraderJoe}
        >
          <PinkTooltip title={'Trader Joe'}>
            <img alt={'traderjoe'} src={IconTraderJoe} />
          </PinkTooltip>
        </SelectableToggleImg>
      </ExchangeIcon>
      <ExchangeIcon disabled={parseInt(chainHex) !== MAIN_NETWORKS.bsc.chainId}>
        <SelectableToggleImg
          label={'PancakeSwap'}
          selected={pancakeswap.key === selectedExchange.key}
          onClick={() => switchToBSC(pancakeswap)}
        >
          <PinkTooltip title={'PancakeSwap'}>
            <img alt={'pancakeswap'} src={IconPancakeSwap} />
          </PinkTooltip>
        </SelectableToggleImg>
      </ExchangeIcon>
      <CenterAligned>{props.children}</CenterAligned>
    </Container>
  );
};

export default ExchangeSelector;
