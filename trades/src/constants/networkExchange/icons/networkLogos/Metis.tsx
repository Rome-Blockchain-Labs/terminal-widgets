import React, { FC } from 'react';

import {
  IIconProps,
  TransitionCircle,
  TransitionPath,
} from '../../../../components/icons';

export const Metis: FC<IIconProps> = ({
  grayscale,
  height = 28,
  width = 28,
}) => (
  <svg
    height={height}
    viewBox="0 0 450.1 450"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      {!grayscale && (
        <TransitionCircle cx="225.1" cy="225" fill="#00DACC" r="175" />
      )}
      <TransitionPath
        d="M186,317.4c1.4-4.2,4.2-8.3,5.5-13.9c0-1.4,0-4.2-1.4-5.5c-8.3-11.1-11.1-23.6-8.3-36.1c0-1.4,0-2.8,1.4-2.8c0-1.4,1.4-1.4,1.4-2.8c9.7,9.7,12.5,22.2,13.9,34.7c2.8-5.5,6.9-11.1,9.7-18c0-1.4-1.4-2.8-1.4-4.2c-8.3-12.5-9.7-26.3-4.2-41.6c9.7,9.7,12.5,22.2,12.5,34.7c4.2-5.5,6.9-11.1,11.1-15.3c0-1.4,0-2.8-1.4-4.2c-4.2-12.5-4.2-25,2.8-37.4c1.4-1.4,1.4-2.8,2.8-4.2c6.9,11.1,5.5,22.2,4.2,33.3h1.4c2.8-4.2,5.5-6.9,6.9-11.1c5.5-15.3,13.9-26.3,29.1-33.3c2.8-1.4,4.2-1.4,6.9-2.8c0,2.8,0,4.2-1.4,6.9c-4.2,13.9-13.9,25-27.7,31.9c-5.5,2.8-9.7,6.9-12.5,12.5c11.1-5.5,22.2-8.3,36.1-4.2c-2.8,2.8-4.2,4.2-6.9,5.5c-9.7,6.9-20.8,9.7-31.9,8.3c-4.2,0-5.5,0-6.9,2.8c-2.8,4.2-5.5,9.7-8.3,15.3c12.5-5.5,25-8.3,38.8-1.4c-4.2,2.8-6.9,5.5-9.7,6.9c-9.7,4.2-19.4,5.5-30.5,2.8c-2.8-1.4-4.2,0-5.5,2.8c-2.8,5.5-5.5,11.1-9.7,18c12.5-5.5,25-9.7,38.8-4.2l1.4,1.4c-1.4,1.4-2.8,1.4-5.5,2.8c-11.1,6.9-22.2,9.7-34.7,8.3c-2.8-1.4-5.5,0-5.5,2.8c-4.2,11.1-8.3,22.2-12.5,31.9c-1.4,4.2-4.2,8.3-6.9,12.5c-1.4,2.8-4.2,4.2-6.9,2.8c-37.4-19.4-63.8-48.5-73.5-88.7c-19.4-73.5,20.8-147,92.9-167.8c83.2-25,165,30.5,177.5,110.9c9.7,65.2-27.7,127.6-88.7,149.8c-4.2,1.4-6.9,2.8-9.7,0c-2.8-4.2-2.8-6.9-1.4-11.1c5.5-13.9,9.7-27.7,13.9-41.6c2.8-8.3,5.5-11.1,13.9-11.1c8.3-1.4,16.6-1.4,25-2.8c6.9-1.4,9.7-4.2,9.7-11.1c0-1.4,0-4.2,0-5.5c-1.4-2.8,0-5.5,2.8-8.3s2.8-4.2,0-6.9c-1.4-1.4-1.4-4.2,0-4.2c2.8-2.8,2.8-5.5,0-8.3c-2.8-2.8-1.4-5.5,1.4-6.9c2.8-1.4,4.2-2.8,5.5-5.5c4.2-2.8,2.8-5.5,0-8.3c-5.5-5.5-12.5-9.7-18-15.3c-4.2-2.8-5.5-8.3-4.2-12.5c1.4-8.3,0-15.3-4.2-22.2c-4.2-5.5-6.9-12.5-9.7-18c-4.2-9.7-11.1-16.6-20.8-19.4s-19.4-4.2-30.5-5.5c-6.9-1.4-13.9-1.4-20.8-2.8c-18-2.8-34.7,1.4-48.5,13.9c-4.2,2.8-8.3,6.9-13.9,8.3c-4.2,1.4-6.9,5.5-9.7,8.3c-1.4,4.2-4.2,6.9-8.3,8.3c-6.9,5.5-13.9,9.7-19.4,16.6c-1.4,2.8-5.5,4.2-6.9,5.5c-8.3,5.5-9.7,11.1-6.9,19.4c1.4,5.5,2.8,11.1,1.4,16.6c-1.4,4.2-1.4,9.7,0,13.9c0,5.5,4.2,11.1,9.7,12.5c4.2,1.4,6.9,4.2,6.9,8.3c1.4,5.5,4.2,11.1,8.3,15.3c4.2,4.2,6.9,9.7,9.7,15.3c2.8,6.9,6.9,11.1,13.9,13.9c6.9,2.8,12.5,5.5,19.4,8.3C183.3,316,184.6,316,186,317.4z M229.6,33.6c-106.7,0-193.2,86.5-193.2,193.2S122.9,420,229.6,420s193.2-86.5,193.2-193.2S336.4,33.6,229.6,33.6z"
        fill={grayscale ? '#B4BBC7' : '#313042'}
      />
    </g>
  </svg>
);