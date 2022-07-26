import React from 'react';

import IconPancake from '../../assets/icons/icon-pancake.svg';
import IconPangolin from '../../assets/icons/icon-pangolin.svg';
import IconTraderJoe from '../../assets/icons/icon-traderjoe.svg';
import IconUniV2 from '../../assets/icons/icon-uni.svg';

const ExchangeImage = ({ exchangeName }) => {
  if (exchangeName === 'UniswapV2') {
    return (
      <img
        alt={''}
        src={IconUniV2}
        style={{
          border: 'solid 1px #00D3CF',
          borderRadius: '50px',
          padding: '3px',
        }}
        width={25}
      />
    );
  }
  if (exchangeName === 'Pangolin') {
    return (
      <img
        alt={''}
        src={IconPangolin}
        style={{
          border: 'solid 1px #00D3CF',
          borderRadius: '50px',
          padding: '3px',
        }}
        width={25}
      />
    );
  }
  if (exchangeName === 'PancakeSwap') {
    return (
      <img
        alt={''}
        src={IconPancake}
        style={{
          border: 'solid 1px #00D3CF',
          borderRadius: '50px',
          padding: '3px',
        }}
        width={25}
      />
    );
  }
  if (exchangeName === 'TraderJoe') {
    return (
      <img
        alt={''}
        src={IconTraderJoe}
        style={{
          border: 'solid 1px #00D3CF',
          borderRadius: '50px',
          padding: '3px',
        }}
        width={25}
      />
    );
  }

  return null;
};
export default ExchangeImage;
