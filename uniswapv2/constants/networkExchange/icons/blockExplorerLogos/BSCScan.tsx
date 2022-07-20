import React, { FC, memo } from 'react';

import {
  IIconProps,
  pickFillColor,
  TransitionCircle,
  TransitionPath,
} from '../../../../components/icons';

export const BSCScanIcon: FC<IIconProps> = memo(
  ({ active, activeColor, grayscale, height, width }) => (
    <svg
      height={height ?? 28}
      viewBox="0 0 390.9 393.2"
      width={width ?? 28}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionCircle cx="50%" cy="50%" fill="#fff" r="45%" />
      <TransitionPath
        d="M81.4,186.4c0-9.1,7.4-16.5,16.5-16.5h27.5c9.1,0,16.5,7.5,16.5,16.6v103.8c3.1-.9,7-1.9,11.4-2.9,6.2-1.5,10.6-7,10.6-13.4V145.3c0-9.1,7.4-16.5,16.5-16.5h27.5c9.1,0,16.5,7.4,16.5,16.5v119.4s6.9-2.8,13.6-5.6c5.1-2.2,8.4-7.1,8.4-12.7V104c0-9.1,7.4-16.5,16.5-16.5h27.5c9.1,0,16.5,7.4,16.5,16.5v117.3c23.8-17.3,48-38.1,67.2-63,5.6-7.4,7.2-17.1,4.2-25.8C343.1,31.1,232.4-22.4,131.1,12.8,29.8,48-23.8,158.6,11.4,259.9c4,11.4,9,22.5,15,33,4.8,8.3,13.9,13,23.4,12.1,5.2-.5,11.7-1.1,19.4-2,6.9-.8,12.2-6.7,12.2-13.6v-103"
        fill={pickFillColor(
          '#12161c',
          active,
          activeColor,
          grayscale,
          '#a4a3a3'
        )}
      />
      <TransitionPath
        d="M80.9,352.8c86.7,63.1,208.2,43.9,271.3-42.8,24.2-33.2,37.2-73.2,37.2-114.3,0-4.5-.2-8.9-.5-13.3-71,105.9-202,155.3-308,170.4"
        fill={pickFillColor(
          '#f0b90c',
          active,
          activeColor,
          grayscale,
          '#a4a3a3'
        )}
      />
    </svg>
  )
);
