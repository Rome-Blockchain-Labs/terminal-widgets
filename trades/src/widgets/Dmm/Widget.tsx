import {RomeEventType, widgetBridge} from '@romeblockchain/bridge';
import React, {FC, memo, useContext, useEffect} from 'react';

import {Kyber} from '../../components/icons';
import DmmApp from '../../dapps/dmm';
import {useToggleSettingsMenu} from '../../dapps/dmm/state/application/hooks';
import {WidgetCommonState} from '../../types';
import {DmmContext, DmmPage} from './DmmContext';


enum Tabs {
  SETTINGS='settings',
  SWAP='swap',
  POOL='pool',
  POOLFINDER='poolfinder',
  POOLS='pools',
  CREATEPOOL='createpool',
  ADDLIQUIDITY='addliquidity',
  REMOVELIQUIDITY='removeliquidity',
}

export const widgetNameKyber = 'KYBERSWAP';

const Widget: FC<WidgetCommonState> = memo(() => {

  const { setPage } = useContext(DmmContext);
  const toggle = useToggleSettingsMenu();
  useEffect(()=>{

    // setTimeout(()=>{setPage(DmmPage.POOLS)},5000)
    // setPage(DmmPage.POOLS)

      widgetBridge.init()
      widgetBridge.subscribe(RomeEventType.TERMINAL_CLICK_BUTTON,(action:any)=>{
        switch (action.payload.id) {

          case Tabs.SETTINGS:
            toggle()
            break;
          case Tabs.SWAP:
            setPage(DmmPage.SWAP)
            break;
          case Tabs.POOLS:
            setPage(DmmPage.POOLS)
            break;
          case Tabs.POOL:
            setPage(DmmPage.POOL)
            break;
          default:
            break;
        }
      })

  },[setPage,toggle])
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
