import { useRef } from 'react';
import { FC } from 'react';
import { theme } from 'twin.macro';

import { Avalanche2Icon, ChevronDown2Icon } from '../icons';

type TokenInputProps = {
  from?: boolean;
  balance?: number;
  onClick: () => void;
};

export const TokenInput: FC<TokenInputProps> = ({
  balance,
  from = true,
  onClick,
}) => {
  const directionLabel = from ? 'From' : 'To';

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div tw="flex-col rounded-xl border-2 border-gray-300 w-full py-2 px-4">
      <div tw="flex justify-between text-gray-200 text-lg mb-1">
        <div>{directionLabel}</div>
        {balance && <div>Balance: {balance}</div>}
      </div>
      <div tw="flex w-full text-gray-100">
        <div tw="flex-1">
          <input
            ref={inputRef}
            defaultValue="0.0"
            tw="bg-transparent text-xl w-full h-full"
          />
        </div>
        <div tw="flex-1 flex justify-end">
          {from && (
            <button tw="bg-yellow-400 rounded-md text-black px-2 text-base font-bold h-full">
              MAX
            </button>
          )}
          <div
            tw="flex pl-3 items-center text-xl cursor-pointer"
            onClick={onClick}
          >
            <Avalanche2Icon height={18} width={18} />
            <div tw="ml-2 w-14 font-bold">AVAX</div>
            <ChevronDown2Icon
              color={theme`colors.white`}
              height={12}
              width={12}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
