import React, { FC, memo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { IIconProps, TransitionG, TransitionPath } from '.';

export const SushiswapIcon: FC<IIconProps> = memo(
  ({ className, grayscale, height = 14.585, width = 15.925 }) => {
    const uuid = useRef(uuidv4());

    return (
      <svg
        className={className}
        height={height}
        viewBox="0 0 390.9 393.2"
        width={width}
        xmlns="http://www.w3.org/2000/svg"
      >
        <TransitionG>
          <linearGradient
            gradientTransform="matrix(1 0 0 1 -12 712)"
            gradientUnits="userSpaceOnUse"
            id={`SUSHISWAP_LG_1_${uuid.current}`}
            x1="152.9141"
            x2="212.3881"
            y1="-701.8664"
            y2="-497.6403"
          >
            <stop offset="0" stopColor="#00BAFF" />
            <stop offset="1" stopColor="#FF3EA1" />
          </linearGradient>
          <TransitionPath
            d="M82.1,39.3L382,244l-74.2,109.6L7.9,147.3L82.1,39.3z"
            fill={
              grayscale ? '#B4BBC7' : `url(#SUSHISWAP_LG_1_${uuid.current})`
            }
          />
          <linearGradient
            gradientTransform="matrix(1 0 0 1 -12 712)"
            gradientUnits="userSpaceOnUse"
            id={`SUSHISWAP_LG_2_${uuid.current}`}
            x1="201.6422"
            x2="261.1177"
            y1="-716.0585"
            y2="-511.8314"
          >
            <stop offset="0" stopColor="#00BAFF" />
            <stop offset="1" stopColor="#FF3EA1" />
          </linearGradient>
          <TransitionPath
            d="M382,244c-25.8,37.1-112.9,22.6-195.1-35.5C103,152.1,57.9,76.4,82.1,39.3c25.8-37.1,112.9-22.6,195.1,35.5C361,129.6,406.2,207,382,244z"
            fill={
              grayscale ? '#B4BBC7' : `url(#SUSHISWAP_LG_2_${uuid.current})`
            }
          />
          <linearGradient
            gradientTransform="matrix(1 0 0 1 -12 712)"
            gradientUnits="userSpaceOnUse"
            id={`SUSHISWAP_LG_3_${uuid.current}`}
            x1="104.7612"
            x2="164.2368"
            y1="-687.8448"
            y2="-483.6168"
          >
            <stop offset="0" stopColor="#00BAFF" />
            <stop offset="1" stopColor="#FF3EA1" />
          </linearGradient>
          <TransitionPath
            d="M307.8,352.1c-25.8,37.1-112.9,22.6-195.1-35.5S-16.3,184.4,9.5,145.7c25.8-37.1,112.9-22.6,195.1,35.5S332,315,307.8,352.1z"
            fill={
              grayscale ? '#B4BBC7' : `url(#SUSHISWAP_LG_3_${uuid.current})`
            }
          />
          <TransitionPath
            d="M382,244L382,244l-74.2,109.6l0,0c-25.8,37.1-112.9,21-195.1-35.5c-16.1-11.3-30.6-22.6-45.1-35.5c11.3-1.6,25.8-8.1,40.3-24.2c25.8-27.4,38.7-33.9,50-32.2c11.3,0,24.2,11.3,45.1,38.7c21,27.4,50,35.5,67.7,21c1.6-1.6,3.2-1.6,4.8-3.2c14.5-11.3,19.3-16.1,46.8-67.7c6.4-12.9,29-33.9,59.7-24.2C390,211.8,390,229.5,382,244z"
            fill={grayscale ? '#B4BBC7' : '#0E0F24'}
          />
          <TransitionPath
            clipRule="evenodd"
            d="M370.7,237.6c-22.6,32.2-101.6,16.1-177.4-37.1C115.9,147.3,70.8,79.6,93.4,47.3s101.6-16.1,177.4,37.1S391.7,205.3,370.7,237.6z M299.7,189.2c-11.3,16.1-50,8.1-88.7-17.7c-37.1-25.8-59.7-59.7-48.4-75.8c11.3-16.1,50-8.1,88.7,17.7C288.5,139.2,311,173.1,299.7,189.2z"
            fill="#FFFFFF"
            fillRule="evenodd"
          />
          <TransitionPath
            d="M75.6,76.4c0-1.6-1.6-3.2-3.2-1.6c-1.6,1.6-3.2,1.6-3.2,3.2c1.6,4.8,3.2,8.1,3.2,11.3c0,1.6,1.6,3.2,3.2,1.6c1.6,0,3.2-1.6,1.6-3.2C77.2,84.4,77.2,81.2,75.6,76.4z"
            fill="#FFFFFF"
          />
          <TransitionPath
            d="M83.7,102.2c0-1.6-1.6-3.2-3.2-1.6c-1.6,1.6-1.6,1.6-1.6,3.2c17.7,40.3,54.8,83.8,103.2,116.1c1.6,1.6,3.2,0,4.8,0c1.6-1.6,0-3.2,0-4.8C136.9,182.8,101.4,140.8,83.7,102.2z"
            fill="#FFFFFF"
          />
          <TransitionPath
            d="M278.8,260.2c-1.6,0-3.2,0-3.2,1.6c0,1.6,0,3.2,1.6,3.2c4.8,1.6,11.3,3.2,16.1,4.8c1.6,0,3.2,0,3.2-1.6c0-1.6,0-3.2-1.6-3.2C290.1,263.4,283.6,261.8,278.8,260.2z"
            fill="#FFFFFF"
          />
          <TransitionPath
            d="M307.8,266.6c-1.6,0-3.2,1.6-3.2,3.2c0,1.6,1.6,3.2,3.2,3.2c12.9,1.6,27.4,3.2,38.7,1.6c1.6,0,3.2-1.6,3.2-3.2s-1.6-3.2-3.2-3.2C333.6,269.8,320.7,268.2,307.8,266.6z"
            fill="#FFFFFF"
          />
        </TransitionG>
      </svg>
    );
  }
);
