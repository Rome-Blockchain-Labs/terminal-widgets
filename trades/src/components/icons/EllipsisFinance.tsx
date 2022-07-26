import React, { FC, memo } from 'react';

import { IIconProps, SVG, TransitionPath } from '.';

export const EllipsisFinanceIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 15.516}
      hoverColor={activeColor}
      viewBox="0 0 17.872 15.516"
      width={width ?? 17.872}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g data-name="menu icon - Ellipsis Finance" fill="#7a808a">
        <TransitionPath
          d="M5.606 13.977a14.369 14.369 0 0 0 3.4-1.136c.351-.17.7-.355 1.034-.55l.044-.028c2.126-1.269 3.3-2.768 3.505-4.46a4.689 4.689 0 0 0-.4-2.41 7.049 7.049 0 0 1-2.635 4.277 8.215 8.215 0 0 1-1.915 1.093 4.461 4.461 0 0 1-3.954-.041.135.135 0 0 1-.023-.017l-.006-.005a.141.141 0 0 1-.018-.021 4.729 4.729 0 0 1-.67-2.168V8.4c-.054-1.254.383-3.108 2.778-4.819.012-.009.346-.254.923-.59a12.969 12.969 0 0 1 1.443-.743 13.863 13.863 0 0 1 2.022-.733l.116-.031c.175-.046.35-.088.522-.125.036-.007.256-.052.595-.1a9.222 9.222 0 0 1 4.249.247c-2.3-2.291-7.163-1.947-11.343.938A12.887 12.887 0 0 0 .585 8.027a5.7 5.7 0 0 0 .165 5.38 3.416 3.416 0 0 0 .3.195 6.989 6.989 0 0 0 4.252.436c.184-.031.293-.055.3-.056Z"
          data-name="Path 7123"
          fill={active ? activeColor : color}
        />
        <TransitionPath
          d="M7.312 5.843A8.214 8.214 0 0 1 9.227 4.75a4.461 4.461 0 0 1 3.954.041.15.15 0 0 1 .024.018h.005a.137.137 0 0 1 .018.021 4.764 4.764 0 0 1 .646 3 5.917 5.917 0 0 1-2.749 4.1c-.013.009-.354.259-.942.6-.132.08-.5.3-1.055.561a13.571 13.571 0 0 1-3.043 1.07 10.184 10.184 0 0 1-3.1.266h-.026l-.135-.013-.082-.01h-.028a5.161 5.161 0 0 1-1.443-.375c2.3 2.27 7.156 1.919 11.324-.958a12.892 12.892 0 0 0 4.689-5.58 5.7 5.7 0 0 0-.165-5.378c-1.243-.952-3.736-.718-4.8-.564l-.187.035c-.267.05-.565.106-.816.169l-.112.03a14.666 14.666 0 0 0-1.983.719 15.264 15.264 0 0 0-1.415.728l-.025.016c-2.875 1.715-3.526 3.6-3.535 4.942v.288a4.772 4.772 0 0 0 .417 1.643 7.05 7.05 0 0 1 2.649-4.276Z"
          data-name="Path 7124"
          fill={active ? activeColor : color}
        />
      </g>
    </SVG>
  )
);
