import React, { FC, memo } from 'react';

import { IIconProps, TransitionPath } from '.';

export const PancakeswapIcon: FC<IIconProps> = memo(
  ({ className, grayscale, height = 18, width = 18 }) => (
    <svg
      className={className}
      fill="none"
      height={height}
      viewBox="0 0 18 18"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M16 10.6723C15.9762 9.17016 14.5833 7.85583 12.5714 7.10478L13.2024 3.67812C13.3333 2.9036 12.7976 2.16429 12.0119 2.03521C11.9405 2.03521 11.881 2.02347 11.8095 2.01174C11.0357 2.01174 10.4048 2.6337 10.4048 3.39648V6.52976C9.91667 6.48282 9.44048 6.43588 8.95238 6.43588C8.45238 6.43588 7.95238 6.47108 7.45238 6.52976V3.38474C7.46429 2.6337 6.84524 2 6.07143 2C5.29762 2 4.67857 2.59849 4.66667 3.36127C4.66667 3.46689 4.66667 3.57251 4.70238 3.67812L5.38095 7.10478C3.36905 7.85583 2.02381 9.17016 2 10.6723V11.7636C2 14.0989 5.14286 16 9 16C12.8571 16 16 14.0989 16 11.7636V10.6723V10.6723ZM6.25 11.5289C5.82143 11.5289 5.47619 11.0008 5.47619 10.3906C5.47619 9.78039 5.80952 9.2523 6.25 9.2523C6.69048 9.2523 7.02381 9.78039 7.02381 10.3906C7.02381 11.0008 6.69048 11.5289 6.25 11.5289V11.5289ZM11.6071 11.5289C11.1786 11.5289 10.8333 11.0008 10.8333 10.3906C10.8333 9.78039 11.1667 9.2523 11.6071 9.2523C12.0476 9.2523 12.381 9.78039 12.381 10.3906C12.381 11.0008 12.0476 11.5289 11.6071 11.5289Z"
        fill={grayscale ? '#B4BBC7' : '#e84142'}
      />
    </svg>
  )
);
