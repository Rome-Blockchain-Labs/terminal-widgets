import React, { FC, memo } from 'react';

import { WidgetCommonState } from '../../types';
import { DmmContextProvider } from './DmmContext';
import Widget from './Widget';

export const widgetNameKyberrDMM = 'Kyber DMM';

export const DmmWidget: FC<WidgetCommonState> = memo((props) => {
  return (
    <div id={props.uid}>
      <DmmContextProvider uid={'kyber'}>
        <Widget {...props} />
      </DmmContextProvider>
    </div>
  );
});
