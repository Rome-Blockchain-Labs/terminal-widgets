import React, { FC, memo } from 'react';
import tw from 'twin.macro';

import { IIconProps, TransitionPath } from '.';

export const PangolinIcon: FC<IIconProps> = memo(
  ({ grayscale, height, isBackground, width }) => (
    <svg
      css={[isBackground ? tw`absolute -left-1/2` : '']}
      height={isBackground ? '100%' : height ? height : 17}
      viewBox="0 0 400 400"
      width={isBackground ? '100%' : width ? width : 17}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M363.6,18.7l-53.9,0l16,49.3l-101.6,73.7l80.4,58.5l95.4-69.2L363.6,18.7z"
        fill={grayscale ? '#B4BBC7' : '#FFC800'}
      />
      <TransitionPath
        d="M74.3,67.8l16-49.1l-53.7,0L0.1,130.8l95.3,69.4l80.5-58.4L74.3,67.8z"
        fill={grayscale ? '#B4BBC7' : '#E1AA00'}
      />
      <TransitionPath
        d="M190.8,78l-81.6-59.3L95.5,60.9l95.3,69.4l0,0L190.8,78L190.8,78z"
        fill={grayscale ? '#B4BBC7' : '#E1AA00'}
      />
      <TransitionPath
        d="M290.9,18.8L209.2,78v52.3l95.4-69.2L290.9,18.8z"
        fill={grayscale ? '#B4BBC7' : '#FFC800'}
      />
      <TransitionPath
        d="M95.7,222.2l-0.2,0.6l95.3,69.4l0,0v-139L95.7,222.2z"
        fill={grayscale ? '#B4BBC7' : '#E1AA00'}
      />
      <TransitionPath
        d="M304.3,222.2L209.3,153l-0.1,0.1v139l95.4-69.2L304.3,222.2z"
        fill={grayscale ? '#B4BBC7' : '#FFC800'}
      />
      <TransitionPath
        d="M190.8,314.4l-77.6-56.5l-17.7,54.4l95.3,69.4l0,0L190.8,314.4L190.8,314.4z"
        fill={grayscale ? '#B4BBC7' : '#E1AA00'}
      />
      <TransitionPath
        d="M286.9,257.9l-77.7,56.4v67.3l95.4-69.2L286.9,257.9z"
        fill={grayscale ? '#B4BBC7' : '#FFC800'}
      />
    </svg>
  )
);
