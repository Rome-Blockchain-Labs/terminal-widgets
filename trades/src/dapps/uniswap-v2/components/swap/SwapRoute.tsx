import { Trade } from '@rbl/velox-common/uniV2ClonesSDK';
import React, { Fragment, memo, useContext } from 'react';
import { ChevronRight } from 'react-feather';
import { Flex } from 'rebass';
import { ThemeContext } from 'styled-components';

import { getDefaultCurrencySymbol } from '../../../../utils';
import { TYPE } from '../../theme';
import CurrencyLogo from '../CurrencyLogo';

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  const theme = useContext(ThemeContext);
  return (
    <Flex
      alignItems="center"
      flexWrap="wrap"
      justifyContent="space-evenly"
      my="0.5rem"
      px="1rem"
      py="0.5rem"
      style={{ border: `1px solid ${theme.bg3}`, borderRadius: '1rem' }}
      width="100%"
    >
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1;
        return (
          <Fragment key={i}>
            <Flex alignItems="center" my="0.5rem" style={{ flexShrink: 0 }}>
              <CurrencyLogo currency={token} size="1.5rem" />
              <TYPE.black color={theme.text1} fontSize={14} ml="0.5rem">
                {getDefaultCurrencySymbol(token)}
              </TYPE.black>
            </Flex>
            {isLastItem ? null : <ChevronRight color={theme.text2} />}
          </Fragment>
        );
      })}
    </Flex>
  );
});
