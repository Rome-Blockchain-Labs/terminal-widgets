import React, { FC, memo } from 'react';

import { IIconProps, TransitionG, TransitionPath } from '.';

export const MdexIcon: FC<IIconProps> = memo(
  ({ grayscale, height = 17, width = 17 }) => (
    <svg
      height={height}
      viewBox="0 0 400 400"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionG>
        <TransitionPath
          d="M143.1,132.8c17.6,16.3,31.4,28.9,46.3,42.8c-64.1,43.3-4.4,113.1,43.9,72.1c16.9-16.9,16.5-40.7-1.1-57c-34.1-31.4-68.5-62.5-102.4-94.1c-26.5-29.5-73.2-7.5-70.3,31.2c0,81.8,1.6,163.7,0.4,245.4c-30.5,7.6-60.2-21.8-59.1-53.8c0-66.2-1.1-132.6,0.4-198.9C0.4,33.9,109.9-10.2,169.2,50.4c36.9,34.6,72.8,70.7,111,103.9c34.6,30.2,32.5,102.1-8,139.4C159.8,386.5,32.9,226.7,143.1,132.8z"
          fill={grayscale ? '#B4BBC7' : '#FFFFFF'}
        />
        <TransitionPath
          d="M252.3,109.3c-14.6-13.1-27.7-24.9-40.5-36.6c47.2-83.6,188.9-51.5,187.7,46.3c1.1,68,0.2,135.8-0.9,203.8c-0.5,31.8-31.8,55.4-57.9,48.6c0.2-79.2,0.4-158.9,1.4-238.3c0.4-22.2-5.7-39.6-26.8-48.6C288.4,72.6,270.8,91.4,252.3,109.3z"
          fill={grayscale ? '#B4BBC7' : '#6CB1DB'}
        />
      </TransitionG>
    </svg>
  )
);
