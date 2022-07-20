import { ONE_BIPS } from 'constants/blockchain'
import React from 'react'
import { Percent } from 'uniV2ClonesSDK'

import { warningSeverity } from '../../utils/prices'
import { ErrorText } from './styleds'

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({
  priceImpact,
}: {
  priceImpact?: Percent
}) {
  return (
    <ErrorText
      fontSize={12}
      fontWeight={500}
      severity={warningSeverity(priceImpact)}
    >
      {priceImpact
        ? priceImpact.lessThan(ONE_BIPS)
          ? '<0.01%'
          : `${priceImpact.toFixed(2)}%`
        : '-'}
    </ErrorText>
  )
}
