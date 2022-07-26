import React, { FC } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import tw from 'twin.macro';

import { IIconProps } from '.';
export const BenqiIcon: FC<IIconProps> = ({
  active,
  height,
  isBackground,
  type,
  width,
}) => (
  <svg
    css={[
      isBackground
        ? tw`absolute -bottom-12 -left-20  h-72 w-auto max-w-none opacity-30 z-10`
        : '',
    ]}
    height={height ?? 23}
    viewBox="0 0 471.7 471.7"
    width={width ?? 23}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="st0"
      d="M236.2,325.7h-0.3c-49.6,0-89.9-40.2-89.9-89.8s40.2-89.9,89.8-89.9l0,0l0,0c49.6,0,89.8,40.1,89.9,89.7
	c0,9.7-1.6,19.4-4.6,28.6l40.4,54.2c45.7-69.3,26.5-162.6-42.8-208.3S156,83.7,110.3,153s-26.5,162.6,42.8,208.3
	c36.7,24.2,82.1,31.1,124.3,18.9C275.9,378.6,236.2,325.7,236.2,325.7z"
      fill="#FFFFFF"
    />
    <path
      className="st1"
      d="M384.1,385.8l-51.7-69.4L304.6,279l0,0l-1.8-2.5c-0.5-0.6-1-1.2-1.7-2c-1.4-1.6-3-3.2-4.6-4.6
	c-0.7-0.6-1.5-1.3-2.3-2c-0.4-0.3-0.8-0.7-1.3-1s-0.9-0.7-1.3-1c-0.9-0.7-1.9-1.4-2.9-2c-9.1-6-22.3-11.6-40.1-11.6h-39.2l0.1,0.2
	l-0.1,0.1l51.7,69.4l27.8,37.4l0,0l1.8,2.5c0.5,0.6,1,1.2,1.7,2c1.4,1.6,3,3.2,4.6,4.6c0.7,0.6,1.5,1.3,2.3,2l1.3,1l1.3,1
	c0.9,0.7,1.9,1.4,2.9,2c9.1,6,22.3,11.6,40.1,11.6h39.2L384,386L384.1,385.8z"
      fill={active ? '#00B2EC' : '#FFFFFF'}
    />
  </svg>
);
