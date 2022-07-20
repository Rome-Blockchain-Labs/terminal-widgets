import 'twin.macro'

import React from 'react'

import {
  AdvancedSwapDetails,
  AdvancedSwapDetailsProps,
} from './AdvancedSwapDetails'
import { useLastTruthy } from 'hooks/useLast'

export default function AdvancedSwapDetailsDropdown({
  trade,
  ...rest
}: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return (
    <div tw="mt-2">
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </div>
  )
}
