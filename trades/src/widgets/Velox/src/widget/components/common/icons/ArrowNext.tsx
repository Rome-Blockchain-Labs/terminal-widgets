import React, { FC, memo } from 'react';

import { IIconProps, SVG } from './index';

export const ArrowNext: FC<IIconProps> = memo(
  ({
    active,
    activeColor = '#08333c',
    color = '#00d3cf',
    disabled,
    disabledColor = '#0D8486',
    height,
    width,
  }) => {
    return (
      <SVG
        height="9.362"
        viewBox="0 0 14.183 9.362"
        width="14.183"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M741.109,879.876a1,1,0,0,0,0,1.408l2,2-9.782-.009a1,1,0,0,0-1,.983v.038a.939.939,0,0,0,.293.678.994.994,0,0,0,.7.285l9.788.014-1.985,1.986a.985.985,0,1,0,1.394,1.394l3.67-3.67a1.01,1.01,0,0,0,.264-.429l.028-.085a.412.412,0,0,0,.01-.074.169.169,0,0,1,.005-.047l.02-.06-.022-.022h0l.008-.007v-.062l-.022-.127,0-.016-.008-.013-.024-.047a.86.86,0,0,0-.234-.424l-3.691-3.691A1,1,0,0,0,741.109,879.876Zm5.249,4.625h0Z"
          fill={disabled ? disabledColor : active ? activeColor : color}
          transform="translate(-732.332 -879.584)"
        />
      </SVG>
    );
  }
);

export default ArrowNext;
