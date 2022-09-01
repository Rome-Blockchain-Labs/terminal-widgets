import { FC, useCallback, useRef, useState } from 'react';
import tw, { theme } from 'twin.macro';
import { useDebouncedCallback } from 'use-debounce';
import useOnClickOutside from 'use-onclickoutside';

import { EXCHANGES } from '../../constants';
import { ExchangeType, NetworkName } from '../../constants/networkExchange';
import { EventGroups, sendStatelessEvent } from '../../contexts';
import { usePairs } from '../../gql/hooks';
import { Pair } from '../../types';
import AssetImage from '../AssetImage';
import { SearchIcon } from '../icons';
type DropdownSearchInputProps = {
  exchange: ExchangeType;
  placeholder?: string;
  selectedPair?: Pair;
  onSelect: (pair: Pair) => void;
  blockchain: NetworkName;
};

export const DropdownSearchInput: FC<DropdownSearchInputProps> = ({
  blockchain,
  exchange,
  onSelect,
  placeholder,
  selectedPair,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [keyword, setKeyword] = useState('');
  const { data } = usePairs(blockchain, exchange, keyword);

  const updateDropDownOpened = (
    valOrFunc: boolean | ((b: boolean) => boolean)
  ) => {
    setIsDropdownOpened(valOrFunc);
    sendStatelessEvent(
      `Widget_PairDropdown_${isDropdownOpened ? 'Close' : 'Open'}`,
      EventGroups.TransactionWidgets
    );
  };
  useOnClickOutside(ref, () => {
    if (isDropdownOpened) {
      updateDropDownOpened(false);
    }
  });

  const handleSearchChange = useDebouncedCallback((value: string) => {
    setKeyword(value);
    sendStatelessEvent(
      'Widget_PairDropdown_Search',
      EventGroups.TransactionWidgets
    );
  }, 300);

  const handlePairSelect = useCallback(
    (pair: Pair) => {
      sendStatelessEvent('Widget_Pair_Switch', EventGroups.TransactionWidgets);
      onSelect(pair);
      setIsDropdownOpened(false);
    },
    [onSelect]
  );

  const ExchangeIcon = EXCHANGES.filter((item) => item.name === exchange)[0]
    .iconAlt;

  return (
    <div ref={ref} tw="relative h-full w-full">
      <div tw="w-full h-full flex items-center border-r border-l border-solid border-dark-500 px-1.5">
        {selectedPair && !isDropdownOpened ? (
          <button
            tw="flex-1 flex items-center px-1.5"
            onClick={() => updateDropDownOpened(true)}
          >
            <div tw="text-sm flex items-center text-gray-200">
              <span tw="flex gap-1 items-center w-12">
                <AssetImage
                  blockchain={blockchain}
                  height={theme`height.3`}
                  tokenAddress={selectedPair.token1?.address || ''}
                  width={theme`width.3`}
                />
                {selectedPair.token1?.symbol}
              </span>
              <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
              <span tw="w-16 flex gap-1 items-center">
                <AssetImage
                  blockchain={blockchain}
                  height={theme`height.3`}
                  tokenAddress={selectedPair.token0?.address || ''}
                  width={theme`width.3`}
                />
                {selectedPair.token0?.symbol}
              </span>
            </div>
            <div tw="px-2">
              <ExchangeIcon
                color={theme`colors.gray.200`}
                height={12}
                width={12}
              />
            </div>
          </button>
        ) : (
          <input
            ref={inputRef}
            defaultValue={keyword}
            placeholder={placeholder}
            tw="flex-1 placeholder-gray-200 text-sm bg-white bg-opacity-0 text-gray-100 px-2"
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => updateDropDownOpened(true)}
          />
        )}
        <button onClick={() => updateDropDownOpened((b) => !b)}>
          <SearchIcon
            activeColor={theme`colors.yellow.400`}
            color={theme`colors.gray.200`}
            height={12}
            width={12}
          />
        </button>
      </div>

      {isDropdownOpened && data.pairs?.length && (
        <div tw="max-h-56 overflow-auto absolute top-full bg-gray-500 px-2 pb-2 whitespace-nowrap min-w-full z-50 w-full">
          {data.pairs.map((pair: any, index: number) => (
            <div
              key={index}
              css={[
                tw`border-b border-solid border-gray-400 flex items-center text-gray-300 py-2 cursor-pointer`,
                index === 0 && tw`border-t border-solid border-gray-400`,
              ]}
              onClick={() =>
                handlePairSelect({
                  address: pair.pair_address || '',
                  blockchain: pair.blockchain || '',
                  exchange: pair.exchange || '',
                  token0: {
                    address: pair.token0_address || '',
                    decimals: pair.token0?.decimals || 18,
                    name: pair.token0?.name || '',
                    symbol: pair.token0?.symbol || '',
                  },
                  token1: {
                    address: pair.token1_address || '',
                    decimals: pair.token0?.decimals || 18,
                    name: pair.token1?.name || '',
                    symbol: pair.token1?.symbol || '',
                  },
                })
              }
            >
              <div tw="text-sm flex items-center text-gray-200">
                <span tw="w-12 flex gap-1 items-center">
                  <AssetImage
                    blockchain={blockchain}
                    height={theme`height.3`}
                    tokenAddress={pair.token1_address || ''}
                    width={theme`width.3`}
                  />
                  {pair.token1?.symbol}
                </span>
                <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
                <span tw="w-16 flex gap-1 items-center">
                  <AssetImage
                    blockchain={blockchain}
                    height={theme`height.3`}
                    tokenAddress={pair.token0_address || ''}
                    width={theme`width.3`}
                  />
                  {pair.token0?.symbol}
                </span>
              </div>
              <div tw="px-2">
                <ExchangeIcon
                  color={theme`colors.gray.200`}
                  height={12}
                  width={12}
                />
              </div>
              <div tw="flex text-xs">
                <div tw="mr-2">
                  <p tw="mb-0.5">Pair Volume:</p>
                  <p>Pair:</p>
                </div>
                <div tw="text-gray-200">
                  <p tw="mb-0.5">
                    {Number(pair.last_24hour_usd_volume || 0).toFixed(2)} USD
                  </p>
                  <p>
                    {pair.pair_address?.slice(0, 10)}...
                    {pair.pair_address?.substr(pair.pair_address?.length - 10)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
