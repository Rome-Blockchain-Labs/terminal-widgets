import {
  Currency,
  ETHER,
  JSBI,
  TokenAmount,
} from '@rbl/velox-common/uniV2ClonesSDK';
import { useWeb3React } from '@romeblockchain/wallet';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import { Text } from 'rebass';
import { theme } from 'twin.macro';

import { ButtonDropdownLight } from '../../../../components/buttons';
import { LightCard } from '../../../../components/card';
import { AutoColumn, ColumnCenter } from '../../../../components/column';
import { FindPoolTabs } from '../../../../components/navigationTabs';
import Row from '../../../../components/row';
import { currencyId, getDefaultCurrencySymbol } from '../../../../utils';
import CurrencyLogo from '../../components/CurrencyLogo';
import { MinimalPositionCard } from '../../components/PositionCard';
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal';
import { PairState, usePair } from '../../data/Reserves';
import { usePairAdder } from '../../state/user/hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import AppBody from '../AppBody';
import { Dots } from '../Pool/styleds';

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

const PoolFinder: FC<{
  onBack: () => void;
  onAddLiquidity: (currencyA?: string, currencyB?: string) => void;
}> = ({ onAddLiquidity, onBack }) => {
  const { account } = useWeb3React();

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER);
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const [pairState, pair] = usePair(
    currency0 ?? undefined,
    currency1 ?? undefined
  );
  const addPair = usePairAdder();
  useEffect(() => {
    if (pair) {
      addPair(pair);
    }
  }, [pair, addPair]);

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    );

  const position: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    pair?.liquidityToken
  );
  const hasPosition = Boolean(
    position && JSBI.greaterThan(position.raw, JSBI.BigInt(0))
  );

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency);
      } else {
        setCurrency1(currency);
      }
    },
    [activeField]
  );

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false);
  }, []);

  const prerequisiteMessage = (
    <LightCard padding="25px 10px">
      <div tw="text-xl text-center w-full">
        {!account
          ? 'Connect to a wallet to find pools'
          : 'Select a token to find your liquidity.'}
      </div>
    </LightCard>
  );

  return (
    <AppBody>
      <CurrencySearchModal
        isOpen={showSearch}
        selectedCurrency={
          (activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined
        }
        onCurrencySelect={handleCurrencySelect}
        onDismiss={handleSearchDismiss}
      />
      <FindPoolTabs onBack={onBack} />
      <AutoColumn gap="md">
        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true);
            setActiveField(Fields.TOKEN0);
          }}
        >
          {currency0 ? (
            <Row>
              <CurrencyLogo currency={currency0} />
              <span tw="text-xl ml-3">
                {getDefaultCurrencySymbol(currency0)}
              </span>
            </Row>
          ) : (
            <span tw="text-xl ml-3">Select a Token</span>
          )}
        </ButtonDropdownLight>

        <ColumnCenter>
          <Plus color={theme`colors.yellow.400`} size="16" />
        </ColumnCenter>

        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true);
            setActiveField(Fields.TOKEN1);
          }}
        >
          {currency1 ? (
            <Row>
              <CurrencyLogo currency={currency1} />
              <span tw="text-xl ml-3">
                {getDefaultCurrencySymbol(currency1)}
              </span>
            </Row>
          ) : (
            <span tw="text-xl ml-3">Select a Token</span>
          )}
        </ButtonDropdownLight>

        {hasPosition && (
          <ColumnCenter
            style={{
              backgroundColor: '',
              borderRadius: '12px',
              justifyItems: 'center',
              padding: '12px 0px',
            }}
          >
            <Text fontWeight={500} textAlign="center">
              Pool Found!
            </Text>
          </ColumnCenter>
        )}

        {currency0 && currency1 ? (
          pairState === PairState.EXISTS ? (
            hasPosition && pair ? (
              <MinimalPositionCard border="1px solid #CED0D9" pair={pair} />
            ) : (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">
                    You don’t have liquidity in this pool yet.
                  </Text>
                  <button onClick={() => onAddLiquidity()}>
                    <Text textAlign="center">Add liquidity.</Text>
                  </button>
                </AutoColumn>
              </LightCard>
            )
          ) : validPairNoLiquidity ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">No pool found.</Text>
                <button
                  tw="text-yellow-400"
                  onClick={() =>
                    onAddLiquidity(currencyId(currency0), currencyId(currency1))
                  }
                >
                  Create pool.
                </button>
              </AutoColumn>
            </LightCard>
          ) : pairState === PairState.INVALID ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text fontWeight={500} textAlign="center">
                  Invalid pair.
                </Text>
              </AutoColumn>
            </LightCard>
          ) : pairState === PairState.LOADING ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">
                  Loading
                  <Dots />
                </Text>
              </AutoColumn>
            </LightCard>
          ) : null
        ) : (
          prerequisiteMessage
        )}
      </AutoColumn>
    </AppBody>
  );
};

export default PoolFinder;
