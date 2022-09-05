import 'twin.macro';

import React from 'react';

import { useLastTruthy } from '../../../../hooks';
import {
  AdvancedSwapDetails,
  AdvancedSwapDetailsProps,
} from './AdvancedSwapDetails';

export default function AdvancedSwapDetailsDropdown({
  trade,
  ...rest
}: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade);

  return (
    <div tw="mt-2">
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </div>
  );
}
