import React, { FC, memo } from 'react';

import { IIconProps, TransitionPath } from '.';

export const UniswapIcon: FC<IIconProps> = memo(
  ({ active, activeColor, className, color, grayscale, height, width }) => (
    <svg
      className={className}
      height={height ?? 15.139}
      viewBox="0 0 390.9 393.2"
      width={width ?? 14.602}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M127.1,42.4c-4.9-0.7-5.1-0.9-2.8-1.2c4.4-0.7,14.7,0.2,22,1.9c16.8,4,32,14.3,48.2,32.3l4.2,4.9l6.1-0.9c26-4.2,52.6-0.9,74.8,9.4c6.1,2.8,15.7,8.4,16.8,9.8c0.5,0.5,1.2,3.5,1.6,6.5c1.6,11,0.9,19.2-2.6,25.5c-1.9,3.5-1.9,4.4-0.7,7.5c0.9,2.3,3.7,4,6.3,4c5.6,0,11.5-8.9,14.3-21.3l1.2-4.9l2.1,2.3c11.9,13.3,21.3,31.8,22.7,44.9l0.5,3.5l-2.1-3c-3.5-5.4-6.8-8.9-11.2-11.9c-8-5.4-16.4-7-38.6-8.2c-20.1-1.2-31.6-2.8-42.8-6.5c-19.2-6.3-29-14.5-51.7-44.7c-10.1-13.3-16.4-20.6-22.7-26.7C158.9,52.2,145.1,45.2,127.1,42.4z"
        fill={grayscale ? '#B4BBC7' : '#FF007A'}
      />
      <TransitionPath
        d="M301.3,72.1c0.5-8.9,1.6-14.7,4.2-20.1c0.9-2.1,1.9-4,2.1-4s-0.2,1.6-0.9,3.5c-1.9,5.1-2.1,12.4-0.9,20.6c1.6,10.5,2.3,11.9,13.6,23.4c5.1,5.4,11.2,12.2,13.6,15l4,5.1l-4-3.7c-4.9-4.7-16.1-13.6-18.7-14.7c-1.6-0.9-1.9-0.9-3,0.2c-0.9,0.9-1.2,2.3-1.2,9.1c-0.2,10.5-1.6,17.1-5.1,23.9c-1.9,3.5-2.1,2.8-0.5-1.2c1.2-3,1.4-4.4,1.4-14.5c0-20.3-2.3-25.3-16.6-33.4c-3.5-2.1-9.6-5.1-13.1-6.8c-3.7-1.6-6.5-3-6.3-3c0.5-0.5,14.3,3.5,19.6,5.8c8.2,3.3,9.6,3.5,10.5,3.3C300.6,79.8,301.1,77.9,301.3,72.1z"
        fill={grayscale ? '#B4BBC7' : '#FF007A'}
      />
      <TransitionPath
        d="M136.7,106.9c-9.8-13.6-16.1-34.6-14.7-50.3l0.5-4.9l2.3,0.5c4.2,0.7,11.5,3.5,15,5.6c9.4,5.6,13.6,13.3,17.5,32.5c1.2,5.6,2.8,12.2,3.5,14.3c1.2,3.5,5.6,11.7,9.4,16.8c2.6,3.7,0.9,5.6-4.9,5.1C156.3,125.6,144.4,117.4,136.7,106.9z"
        fill={grayscale ? '#B4BBC7' : '#FF007A'}
      />
      <TransitionPath
        d="M289.4,208.6c-46.3-18.7-62.7-34.8-62.7-62.2c0-4,0.2-7.2,0.2-7.2c0.2,0,1.9,1.4,4,3c9.4,7.5,19.9,10.8,49.1,15c17.1,2.6,26.9,4.4,35.8,7.5c28.3,9.4,45.8,28.5,50,54.5c1.2,7.5,0.5,21.7-1.4,29.2c-1.6,5.8-6.3,16.6-7.5,16.8c-0.2,0-0.7-1.2-0.7-3c-0.5-9.8-5.4-19.2-13.6-26.4C332.9,227.3,320.2,221,289.4,208.6z"
        fill={grayscale ? '#B4BBC7' : '#FF007A'}
      />
      <TransitionPath
        d="M256.6,216.3c-0.5-3.5-1.6-8-2.3-9.8l-1.2-3.5l2.1,2.6c3,3.5,5.4,7.7,7.5,13.6c1.6,4.4,1.6,5.8,1.6,13.1c0,7-0.2,8.7-1.6,12.6c-2.3,6.3-5.1,10.8-9.8,15.7c-8.4,8.7-19.4,13.3-35.1,15.4c-2.8,0.2-10.8,0.9-17.8,1.4c-17.5,0.9-29.2,2.8-39.8,6.5c-1.4,0.5-2.8,0.9-3,0.7c-0.5-0.5,6.8-4.7,12.6-7.5c8.2-4,16.6-6.1,35.1-9.4c9.1-1.4,18.5-3.3,20.8-4.2C248.9,256.3,260.4,238.3,256.6,216.3z"
        fill={grayscale ? '#B4BBC7' : '#FF007A'}
      />
      <TransitionPath
        d="M277.9,254c-6.1-13.3-7.5-26-4.2-37.9c0.5-1.2,0.9-2.3,1.4-2.3c0.5,0,1.9,0.7,3.3,1.6c2.8,1.9,8.7,5.1,23.6,13.3c18.9,10.3,29.7,18.2,37.2,27.4c6.5,8,10.5,17.1,12.4,28.3c1.2,6.3,0.5,21.5-1.2,27.8c-5.1,19.9-16.8,35.8-33.9,44.9c-2.6,1.4-4.7,2.3-4.9,2.3c-0.2,0,0.7-2.3,2.1-5.1c5.6-11.9,6.3-23.4,2.1-36.2c-2.6-8-8-17.5-18.7-33.7C284.2,265.7,281.2,260.8,277.9,254z"
        fill={grayscale ? '#B4BBC7' : '#FF007A'}
      />
      <TransitionPath
        d="M103.7,325.5c17.3-14.5,38.6-24.8,58.2-28.1c8.4-1.4,22.4-0.9,30.2,1.2c12.4,3.3,23.6,10.3,29.5,18.9c5.6,8.4,8.2,15.7,10.8,31.8c0.9,6.3,2.1,12.9,2.3,14.3c1.9,8.4,5.6,15,10.3,18.5c7.2,5.4,19.9,5.6,32.3,0.9c2.1-0.7,4-1.4,4-1.2c0.5,0.5-5.8,4.7-10.1,6.8c-5.8,3-10.5,4-16.8,4c-11.2,0-20.8-5.8-28.5-17.5c-1.6-2.3-4.9-9.1-7.7-15.4c-8.2-18.9-12.4-24.6-22-30.9c-8.4-5.4-19.2-6.5-27.4-2.6c-10.8,5.1-13.6,18.9-6.1,27.4c3,3.5,8.7,6.3,13.3,7c8.7,1.2,16.1-5.6,16.1-14.3c0-5.6-2.1-8.9-7.7-11.5c-7.5-3.3-15.7,0.5-15.4,7.7c0,3,1.4,4.9,4.4,6.3c1.9,0.9,1.9,0.9,0.5,0.7c-6.8-1.4-8.4-9.8-3-15.2c6.5-6.5,20.3-3.7,25,5.4c1.9,3.7,2.1,11.2,0.5,15.9c-4,10.3-15.2,15.7-26.7,12.6c-7.7-2.1-11-4.2-20.3-13.8c-16.4-16.8-22.7-20.1-46.1-23.6l-4.4-0.7L103.7,325.5z"
        fill={grayscale ? '#B4BBC7' : '#FF007A'}
      />
      <TransitionPath
        clipRule="evenodd"
        d="M36.7,10.6c54.5,66.2,82.5,107.7,86.7,113.4c3.5,4.7,2.1,9.1-3.7,12.4c-3.3,1.9-10.1,3.7-13.3,3.7c-3.7,0-8.2-1.9-11.2-4.9c-2.1-2.1-11.2-15.4-31.8-47.5C47.6,63.2,34.3,42.8,34,42.6c-0.9-0.5-0.9-0.5,27.6,50.5c18,32,23.9,43.5,23.9,44.9c0,3-0.9,4.7-4.7,8.9c-6.3,7-9.1,15-11.2,31.6c-2.3,18.5-8.7,31.6-26.7,53.8c-10.5,13.1-12.2,15.4-14.7,20.8c-3.3,6.5-4.2,10.3-4.7,18.7c-0.5,8.9,0.5,14.5,3,22.9c2.3,7.5,4.9,12.4,11.2,22c5.4,8.4,8.7,14.7,8.7,17.1c0,1.9,0.5,1.9,8.9,0c20.1-4.7,36.7-12.6,45.8-22.4c5.6-6.1,7-9.4,7-17.8c0-5.4-0.2-6.5-1.6-9.8c-2.3-5.1-6.8-9.4-16.4-15.9c-12.6-8.7-18-15.7-19.4-25c-1.2-8,0.2-13.3,7.2-28.1c7.2-15.2,9.1-21.5,10.3-36.9c0.7-9.8,1.9-13.8,4.7-16.8c3-3.3,5.6-4.4,12.9-5.4c11.9-1.6,19.6-4.7,25.7-10.5c5.4-4.9,7.7-9.8,8-17.1l0.2-5.4l-3-3.3C125.7,106.7,29.4,0.6,28.7,0.6C28.5,0.6,32.2,5,36.7,10.6z M52.5,281.8c2.6-4.4,1.2-10.1-3-12.9c-4-2.6-10.1-1.4-10.1,2.1c0,0.9,0.5,1.9,1.9,2.3c2.1,1.2,2.3,2.3,0.7,4.9c-1.6,2.6-1.6,4.9,0.5,6.5C45.7,287.4,50.2,286,52.5,281.8z"
        fill={grayscale ? '#B4BBC7' : '#FF007A'}
        fillRule="evenodd"
      />
      <TransitionPath
        clipRule="evenodd"
        d="M147.2,158.8c-5.6,1.6-11,7.7-12.6,13.8c-0.9,3.7-0.5,10.5,1.2,12.6c2.6,3.3,4.9,4.2,11.5,4.2c12.9,0,23.9-5.6,25-12.4c1.2-5.6-3.7-13.3-10.5-16.8C158.2,158.3,150.9,157.6,147.2,158.8z M162.2,170.5c1.9-2.8,1.2-5.8-2.3-8c-6.3-4-15.9-0.7-15.9,5.4c0,3,4.9,6.3,9.6,6.3C156.5,174.2,160.8,172.4,162.2,170.5z"
        fill={grayscale ? '#B4BBC7' : '#FF007A'}
        fillRule="evenodd"
      />
    </svg>
  )
);
