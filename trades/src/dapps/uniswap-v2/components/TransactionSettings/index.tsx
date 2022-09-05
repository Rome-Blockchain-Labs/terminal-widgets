import { darken } from 'polished';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

import { AutoColumn } from '../../../../components/column';
import QuestionHelper from '../../../../components/questionHelper';
import { RowBetween, RowFixed } from '../../../../components/row';

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

const FancyButton = styled.button`
  color: ${({ theme }) => theme.text1};
  align-items: center;
  height: 2rem;
  border-radius: 0.7rem;
  font-size: 12px;
  width: auto;
  min-width: 3rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  outline: none;
  background: ${({ theme }) => theme.bg1};
  :hover {
    border: 1px solid ${({ theme }) => theme.bg4};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
`;

const Option = styled(FancyButton)<{ active: boolean }>`
  margin-right: 8px;
  :hover {
    cursor: pointer;
  }
  ${({ active }) =>
    active &&
    tw`bg-yellow-400 text-black border-yellow-400 outline-none focus:border-yellow-400 hover:border-yellow-400`};
`;

const Input = styled.input`
  background: ${({ theme }) => theme.bg1};
  font-size: 16px;
  width: auto;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ color, theme }) => (color === 'red' ? theme.red1 : theme.text1)};
  text-align: right;
`;

const OptionCustom = styled(FancyButton)<{
  active?: boolean;
  warning?: boolean;
}>`
  height: 2rem;
  position: relative;
  padding: 0 0.75rem;
  flex: 1;
  border: ${({ active, theme, warning }) =>
    active && `1px solid ${warning ? theme.red1 : theme.primary1}`};
  :hover {
    border: ${({ active, theme, warning }) =>
      active &&
      `1px solid ${
        warning ? darken(0.1, theme.red1) : darken(0.1, theme.primary1)
      }`};
  }

  input {
    width: 100%;
    height: 100%;
    border: 0px;
    border-radius: 1rem;
  }
`;

const SlippageEmojiContainer = styled.span`
  color: #f3841e;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;  
  `}
`;

export interface SlippageTabsProps {
  rawSlippage: number;
  setRawSlippage: (rawSlippage: number) => void;
  deadline: number;
  setDeadline: (deadline: number) => void;
}

export default function SlippageTabs({
  deadline,
  rawSlippage,
  setDeadline,
  setRawSlippage,
}: SlippageTabsProps) {
  const inputRef = useRef<HTMLInputElement>();

  const [slippageInput, setSlippageInput] = useState('');
  const [deadlineInput, setDeadlineInput] = useState('');

  const slippageInputIsValid =
    slippageInput === '' ||
    (rawSlippage / 100).toFixed(2) ===
      Number.parseFloat(slippageInput).toFixed(2);
  const deadlineInputIsValid =
    deadlineInput === '' || (deadline / 60).toString() === deadlineInput;

  let slippageError: SlippageError | undefined;
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput;
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow;
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh;
  } else {
    slippageError = undefined;
  }

  let deadlineError: DeadlineError | undefined;
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput;
  } else {
    deadlineError = undefined;
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value);

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt(
        (Number.parseFloat(value) * 100).toString()
      );
      if (
        !Number.isNaN(valueAsIntFromRoundedFloat) &&
        valueAsIntFromRoundedFloat < 5000
      ) {
        setRawSlippage(valueAsIntFromRoundedFloat);
      }
    } catch {}
  }

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value);

    try {
      const valueAsInt: number = Number.parseInt(value) * 60;
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setDeadline(valueAsInt);
      }
    } catch {}
  }

  return (
    <AutoColumn gap="md">
      <AutoColumn gap="sm">
        <RowFixed>
          <span tw="text-xl font-medium">SLIPPAGE TOLERANCE</span>
          <QuestionHelper text="Your transaction will revert if the price changes unfavorably by more than this percentage." />
        </RowFixed>
        <RowBetween>
          <Option
            active={rawSlippage === 10}
            onClick={() => {
              setSlippageInput('');
              setRawSlippage(10);
            }}
          >
            0.1%
          </Option>
          <Option
            active={rawSlippage === 50}
            onClick={() => {
              setSlippageInput('');
              setRawSlippage(50);
            }}
          >
            0.5%
          </Option>
          <Option
            active={rawSlippage === 100}
            onClick={() => {
              setSlippageInput('');
              setRawSlippage(100);
            }}
          >
            1%
          </Option>
          <OptionCustom
            active={![10, 50, 100].includes(rawSlippage)}
            tabIndex={-1}
            warning={!slippageInputIsValid}
          >
            <RowBetween>
              {!!slippageInput &&
              (slippageError === SlippageError.RiskyLow ||
                slippageError === SlippageError.RiskyHigh) ? (
                <SlippageEmojiContainer>
                  <span aria-label="warning" role="img">
                    ⚠️
                  </span>
                </SlippageEmojiContainer>
              ) : null}
              {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
              <Input
                ref={inputRef as any}
                color={!slippageInputIsValid ? 'red' : ''}
                placeholder={(rawSlippage / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((rawSlippage / 100).toFixed(2));
                }}
                onChange={(e) => parseCustomSlippage(e.target.value)}
              />
              &nbsp;%
            </RowBetween>
          </OptionCustom>
        </RowBetween>
        {!!slippageError && (
          <RowBetween
            style={{
              color:
                slippageError === SlippageError.InvalidInput
                  ? 'red'
                  : '#F3841E',
              paddingTop: '7px',
            }}
            tw="text-xl"
          >
            {slippageError === SlippageError.InvalidInput
              ? 'ENTER A VALID SLIPPAGE PERCENTAGE'
              : slippageError === SlippageError.RiskyLow
              ? 'YOUR TRANSACTION MAY FAIL'
              : 'YOUR TRANSACTION MAY BE FRONTRUN'}
          </RowBetween>
        )}
      </AutoColumn>

      <AutoColumn gap="sm">
        <RowFixed>
          <span tw="text-xl font-medium">TRANSACTION DEADLINE</span>
          <QuestionHelper text="Your transaction will revert if it is pending for more than this long." />
        </RowFixed>
        <RowFixed>
          <OptionCustom style={{ width: '80px' }} tabIndex={-1}>
            <Input
              color={!!deadlineError ? 'red' : undefined}
              placeholder={(deadline / 60).toString()}
              tw="text-xl text-center placeholder-gray-300"
              value={deadlineInput}
              onBlur={() => {
                parseCustomDeadline((deadline / 60).toString());
              }}
              onChange={(e) => parseCustomDeadline(e.target.value)}
            />
          </OptionCustom>
          <span tw="text-xl pl-2">MINUTES</span>
        </RowFixed>
      </AutoColumn>
    </AutoColumn>
  );
}
