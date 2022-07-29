import React, { FC, memo } from 'react';

import { Kyber } from '../../components/icons';
import DmmApp from '../../dapps/dmm';
import { WidgetCommonState } from '../../types';

export const widgetNameKyber = 'KYBERSWAP';

const Widget: FC<WidgetCommonState> = memo(() => {
  // const widget = useSelector((state) => widgetByIdSelector(state)(uid));

  // const widget = {
  //   blockchain: NetworkName.AVALANCHE,
  //   pair: {
  //     address: '0x1',
  //     blockchain: NetworkName.AVALANCHE,
  //     token0: {
  //       address: 'string',
  //       decimals: 18,
  //       name: 'string',
  //       symbol: 'string',
  //     },
  //     token1: {
  //       address: 'string',
  //       decimals: 18,
  //       name: 'string',
  //       symbol: 'string',
  //     },
  //   },
  //   targetPosition: 3,
  //   uid: 'kyber',
  // };

  return (
    <div tw="w-full h-full relative bg-dark-500">
      <Kyber active isBackground />

      <div tw="h-full overflow-auto relative">
        <div tw="flex justify-center items-center p-4 min-h-full">
          <DmmApp />
        </div>
      </div>
    </div>
  );
});

export default Widget;
