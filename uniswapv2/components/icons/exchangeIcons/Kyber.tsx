import React, { FC, memo } from 'react';
import tw from 'twin.macro';

import { IIconProps } from '.';

export const Kyber: FC<IIconProps> = memo(
  ({ grayscale, height, isBackground, width }) => (
    <svg
      css={[isBackground ? tw`absolute -left-1/2` : '']}
      height={isBackground ? '100%' : height ? height : 17}
      viewBox="0 0 400 400"
      width={isBackground ? '100%' : width ? width : 17}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M184.5,200L331,283.9c3.7,2.2,8.4,1,10.6-2.6c0.7-1.2,1.1-2.6,1.1-4V122.7c0.1-4.2-3.3-7.7-7.6-7.8c-1.5,0-2.9,0.4-4.1,1.2L184.5,200z"
        fill={grayscale ? '#B4BBC7' : '#31CB9E'}
      />
      <path
        d="M327.9,78.9L227.7,5.2c-3.5-2.7-8.5-2-11.2,1.5c-0.6,0.8-1.1,1.8-1.4,2.8l-36.6,164.1l148.4-82c3.6-1.9,5.1-6.3,3.2-9.9C329.7,80.5,328.9,79.6,327.9,78.9"
        fill={grayscale ? '#B4BBC7' : '#31CB9E'}
      />
      <path
        d="M227.6,394.7l100.3-73.7c3.4-2.4,4.2-7.1,1.8-10.5c-0.7-1-1.6-1.8-2.6-2.3l-148.4-82l36.6,164.1c1,4.3,5.3,6.9,9.5,5.9c1-0.2,2-0.7,2.9-1.4"
        fill={grayscale ? '#B4BBC7' : '#31CB9E'}
      />
      <path
        d="M146.4,197l38.1-178.1c0.8-4.1-1.9-8.1-6-8.9c-2-0.4-4.1,0-5.8,1.2L75.2,86c-5,3.8-7.9,9.8-7.9,16.1V292c-0.1,6.4,2.8,12.5,7.9,16.3l97.1,74.6c3.4,2.4,8.1,1.5,10.5-1.9c1.2-1.7,1.6-3.8,1.2-5.8L146.4,197z"
        fill={grayscale ? '#B4BBC7' : '#31CB9E'}
      />
    </svg>
  )
);
