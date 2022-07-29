import React, { useCallback } from 'react';
import styled from 'styled-components';
import tw, { theme } from 'twin.macro';

const StyledRangeInput = styled.input<{ size: number }>`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &::-moz-focus-outer {
    border: 0;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    background-color: #565a69;
    border-radius: 100%;
    border: none;
    transform: translateY(-50%);
    ${tw`text-green-700`}

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1),
        0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-moz-range-thumb {
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    background-color: #565a69;
    border-radius: 100%;
    border: none;
    ${tw`text-green-700`}

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1),
        0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-ms-thumb {
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    background-color: #565a69;
    border-radius: 100%;
    ${tw`text-green-700`}

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1),
        0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-webkit-slider-runnable-track {
    background: linear-gradient(
      90deg,
      ${theme`colors.gray.500`},
      ${theme`colors.gray.300`}
    );
    height: 2px;
  }

  &::-moz-range-track {
    background: linear-gradient(
      90deg,
      ${theme`colors.gray.500`},
      ${theme`colors.gray.300`}
    );
    height: 2px;
  }

  &::-ms-track {
    width: 100%;
    border-color: transparent;
    color: transparent;

    background: ${theme`colors.gray.500`};
    height: 2px;
  }
  &::-ms-fill-lower {
    background: ${theme`colors.gray.500`};
  }
  &::-ms-fill-upper {
    background: ${theme`colors.gray.300`};
  }
`;

interface InputSliderProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  size?: number;
}

export default function Slider({
  max = 100,
  min = 0,
  onChange,
  size = 28,
  step = 1,
  value,
}: InputSliderProps) {
  const changeCallback = useCallback(
    (e) => {
      onChange(parseInt(e.target.value));
    },
    [onChange]
  );

  return (
    <StyledRangeInput
      aria-labelledby="input slider"
      max={max}
      min={min}
      size={size}
      step={step}
      style={{
        marginLeft: 15,
        marginRight: 15,
        padding: '15px 0',
        width: '90%',
      }}
      type="range"
      value={value}
      onChange={changeCallback}
    />
  );
}
