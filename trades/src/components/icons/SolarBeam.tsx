import React, { FC, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { IIconProps, TransitionCircle, TransitionPath } from '.';

export const Solarbeam: FC<IIconProps> = ({ active, height, width }) => {
  const uuid = useRef(uuidv4());

  return (
    <svg
      height={height ?? 28}
      viewBox="0 0 400 400"
      width={width ?? 28}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <g>
          <linearGradient
            gradientTransform="matrix(-0.7071 -0.7071 0.7071 -0.7071 429.0644 3182.4226)"
            gradientUnits="userSpaceOnUse"
            id={`SOLARBEAM_BG_1_${uuid.current}`}
            x1="2074.5037"
            x2="2470.3464"
            y1="1947.2719"
            y2="1947.2719"
          >
            <stop offset="0" stopColor="#FFCB86" />
            <stop offset="1" stopColor="#D75CA9" />
          </linearGradient>
          <TransitionCircle
            cx="199.5"
            cy="199"
            fill={active ? `url(#SOLARBEAM_BG_1_${uuid.current})` : '#B4BBC7'}
            r="198.42"
          />
        </g>
        <TransitionPath
          d="M373.28,185.47c-2.42-31.5-13.18-60.65-30.12-85.24c-5.81-8.44-12.34-16.34-19.52-23.62
          c-31.62-32.07-75.55-51.97-124.15-51.97c-16.6,0-32.64,2.37-47.85,6.7c-10.69,3.05-20.96,7.08-30.7,12.01
          c-34.33,17.36-62.15,45.7-78.79,80.45c-4.71,9.85-8.53,20.21-11.34,30.97c-3.69,14.12-5.67,28.94-5.67,44.22
          c0,46.46,18.2,88.64,47.82,119.89c7.18,7.57,15.01,14.51,23.44,20.7c25.64,18.83,56.61,30.79,90.23,33.24
          c4.25,0.31,8.53,0.52,12.86,0.52c4.27,0,8.49-0.21,12.69-0.51c39.39-2.84,75.15-18.74,102.97-43.42
          c5.96-5.29,11.55-10.99,16.74-17.05c23.7-27.66,38.88-62.81,41.5-101.43c0.27-3.95,0.45-7.93,0.45-11.95
          C373.85,194.44,373.62,189.94,373.28,185.47z M348.25,176.34l-157.54-57.42c0.7-4.47,1.07-9.05,1.07-13.71
          c0-0.93-0.04-1.86-0.07-2.79l121.52-1.76C331.4,121.65,343.9,147.67,348.25,176.34z M199.5,48.54c32.88,0,63.3,10.63,88.09,28.59
          l-99.93,1.45c-3.22-10.13-8.23-19.47-14.64-27.66C181.62,49.39,190.46,48.54,199.5,48.54z M147.12,57.97
          c12.76,11.75,20.77,28.58,20.77,47.24c0,35.42-28.82,64.24-64.24,64.24c-18.16,0-34.57-7.59-46.26-19.74
          C72.1,107.38,105.21,73.58,147.12,57.97z M49.04,199c0-7.92,0.63-15.7,1.81-23.3c7.52,5.64,15.96,10.12,25.06,13.15l-2.1,92.72
          C58.18,257.85,49.04,229.48,49.04,199z M97.1,309.09l2.62-115.85c1.3,0.06,2.61,0.1,3.93,0.1c4.99,0,9.88-0.44,14.65-1.24
          l58.87,155.69C146.48,343.2,118.81,329.31,97.1,309.09z M203.31,349.36l-62.17-164.41c5.97-2.82,11.56-6.29,16.7-10.32
          l140.18,137.93C272.5,334.74,239.48,348.45,203.31,349.36z M314.79,295.53L174.52,157.52c3.6-4.87,6.7-10.13,9.26-15.69
          l166.09,60.54C349.09,237.77,336.05,270.19,314.79,295.53z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
};

