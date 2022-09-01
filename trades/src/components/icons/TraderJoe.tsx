import React, { FC, memo } from 'react';
import tw from 'twin.macro';

import { IIconProps, TransitionPath } from '.';

export const TraderJoeIcon: FC<IIconProps> = memo(
  ({ className, grayscale, height, isBackground, width }) => (
    <svg
      className={className}
      css={[isBackground ? tw`absolute -left-1/2` : '']}
      height={height ?? 18.475}
      viewBox="0 0 1000 1000"
      width={width ?? 13.323}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <TransitionPath
          d="M839.7,734.5l0.3,91.7l-140.8,81.3l-0.3-91.7L839.7,734.5z"
          fill={grayscale ? '#222222' : '#3C1A26'}
        />
        <TransitionPath
          d="M699.1,907.5L450.3,762.9l-0.3-91.7l248.9,144.6L699.1,907.5z"
          fill={grayscale ? '#171717' : '#29121A'}
        />
        <TransitionPath
          d="M698.9,815.8L450,671.2l140.8-81.3l248.9,144.6L698.9,815.8z"
          fill={grayscale ? '#D6D6D6' : '#421D2A'}
        />
        <TransitionPath
          d="M678.3,827l0.3,91.7L537.8,1000l-0.3-91.7L678.3,827z"
          fill={grayscale ? '#222222' : '#3C1A26'}
        />
        <TransitionPath
          d="M537.8,1000L288.9,855.4l-0.3-91.7l248.9,144.6L537.8,1000z"
          fill={grayscale ? '#171717' : '#29121A'}
        />
        <TransitionPath
          d="M537.5,908.3L288.7,763.6l140.8-81.3L678.3,827L537.5,908.3z"
          fill={grayscale ? '#D6D6D6' : '#421D2A'}
        />
        <TransitionPath
          d="M835.1,576.1l0.4,130.8L493.9,904.1l-0.4-130.9L835.1,576.1z"
          fill={grayscale ? '#767676' : '#DB5B54'}
        />
        <TransitionPath
          d="M493.9,904.1L154.6,706.9l-0.4-130.8l339.3,197.2L493.9,904.1z"
          fill={grayscale ? '#5A5A5A' : '#A24741'}
        />
        <TransitionPath
          d="M493.6,773.3L154.2,576.1l341.6-197.2l339.3,197.2L493.6,773.3z"
          fill={grayscale ? '#767676' : '#DB5B54'}
        />
        <TransitionPath
          d="M833.4,314.3l0.8,261.7L492.5,773.2l-0.7-261.7L833.4,314.3z"
          fill={grayscale ? '#9D9D9D' : '#BD967F'}
        />
        <TransitionPath
          d="M492.5,773.2L153.2,575.9l-0.7-261.6l339.3,197.2L492.5,773.2z"
          fill={grayscale ? '#707070' : '#886B59'}
        />
        <TransitionPath
          d="M491.8,511.5L152.5,314.3L494,117.1l339.3,197.2L491.8,511.5z"
          fill={grayscale ? '#B4BBC7' : '#B88D73'}
        />
        <TransitionPath
          d="M663,480.3l0.2,52.3l-45.5,26.3l0.1,52.3l45.6-26.3l-91.1,52.6l-0.3-104.7L663,480.3z"
          fill="#FFFFFF"
        />
        <TransitionPath
          d="M663.1,532.6l0.2,52.4l-45.6,26.3l-0.1-52.3L663.1,532.6z"
          fill={grayscale ? '#373737' : '#493239'}
        />
        <TransitionPath
          d="M797,402.9l0.2,52.4l-45.5,26.3l0.1,52.3l45.5-26.3l-91.1,52.6l-0.3-104.7L797,402.9z"
          fill="#FFFFFF"
        />
        <TransitionPath
          d="M797.1,455.3l0.1,52.3l-45.5,26.3l-0.1-52.3L797.1,455.3z"
          fill={grayscale ? '#373737' : '#493239'}
        />
        <TransitionPath
          d="M288,837.5l-0.2,78.5l-113.9-65.7l0.2-78.5L288,837.5z"
          fill={grayscale ? '#707070' : '#886B59'}
        />
        <TransitionPath
          d="M288,837.5l113.1-65.7l-0.2,78.5l-113.1,65.7L288,837.5z"
          fill={grayscale ? '#9D9D9D' : '#BD967F'}
        />
        <TransitionPath
          d="M174.2,771.8l113.1-65.7l113.9,65.7L288,837.5L174.2,771.8z"
          fill={grayscale ? '#5A5A5A' : '#CAA390'}
        />
        <TransitionPath
          d="M322.3,804.9l-0.1,52.4L288,837.5l-113.9-65.7L140,752.1l0.2-52.4L322.3,804.9z"
          fill={grayscale ? '#5A5A5A' : '#A24741'}
        />
        <TransitionPath
          d="M322.3,804.9l113.1-65.7l-0.1,52.4l-113.1,65.7L322.3,804.9z"
          fill={grayscale ? '#6A6A6A' : '#C4524C'}
        />
        <TransitionPath
          d="M140.2,699.7L253.3,634l182.2,105.2l-113.1,65.7L140.2,699.7z"
          fill={grayscale ? '#767676' : '#DB5B54'}
        />
        <TransitionPath
          d="M833.6,197.2l0.4,130.8L492.4,525.3L492,394.4L833.6,197.2z"
          fill={grayscale ? '#767676' : '#DB5B54'}
        />
        <TransitionPath
          d="M492.4,525.3L153,328l-0.4-130.8L492,394.4L492.4,525.3z"
          fill={grayscale ? '#5A5A5A' : '#A24741'}
        />
        <TransitionPath
          d="M492,394.4L152.6,197.2L494.2,0l339.3,197.2L492,394.4z"
          fill={grayscale ? '#8C8C8C' : '#F2716A'}
        />
        <TransitionPath
          d="M771.4,427.4c28.4-16.8,59.1-29.3,91.1-37.2v52.3c-32,7.9-62.7,20.4-91.1,37.2c-32.8,19.2-63.3,42-91,67.9
          v-52.3C708.1,469.4,738.6,446.6,771.4,427.4z"
          fill={grayscale ? '#767676' : '#DB5B54'}
        />
        <TransitionPath
          d="M680.5,547.6l-113.1-65.7l-0.2-52.4l113.1,65.7L680.5,547.6z"
          fill={grayscale ? '#5A5A5A' : '#A24741'}
        />
        <TransitionPath
          d="M680.3,495.3l-113.1-65.7c27.7-25.9,58.3-48.7,91-67.9c32.8-19.2,90.4-38.5,90.4-38.5l114,67.4
          c0,0-58.5,17.6-91.2,36.8C738.6,446.6,708.1,469.4,680.3,495.3z"
          fill={grayscale ? '#8C8C8C' : '#F2716A'}
        />
        <TransitionPath
          d="M787.6,680.8L765,667.7l-6-4.3l22.6,13.1L787.6,680.8z"
          fill="#898989"
        />
        <TransitionPath
          d="M743.9,729.2L721.3,716l-11.8-10.5l22.6,13.1L743.9,729.2z"
          fill="#898989"
        />
        <TransitionPath
          d="M514.9,786.6l-22.6-13.1l0-8.4l22.6,13.2L514.9,786.6z"
          fill={grayscale ? '#D6D6D6' : '#888888'}
        />
        <TransitionPath
          d="M858.7,542.3l0.1,23.1l0,14.3l0,8.4l-71.2,92.8l-6-4.3l-37.7,52.6l-11.8-10.5l-44.9,69.5L642,770.7
          l-11.7,24.2l-37.9-9l-6,11.2l-71.5-10.4l0-8.4l-0.1-37.4L858.7,542.3z"
          fill="#D6D6D6"
        />
        <TransitionPath
          d="M514.8,778.3l-22.6-13.2l-0.1-37.4l22.6,13.2L514.8,778.3z"
          fill={grayscale ? '#D6D6D6' : '#888888'}
        />
        <TransitionPath
          d="M514.8,740.9l-22.6-13.2l343.9-198.6l22.6,13.1L514.8,740.9z"
          fill="#FDFDFD"
        />
        <TransitionPath
          d="M323.2,560.8l22.6-13.2l146.5,180l-22.6,13.1L323.2,560.8z"
          fill="#FDFDFD"
        />
        <TransitionPath
          d="M469.7,740.7l22.6-13.1l22.8,13.1l-22.6,13.1L469.7,740.7z"
          fill="#FDFDFD"
        />
        <TransitionPath
          d="M492.5,753.8l22.6-13.1l-0.1,45.9l-22.6,13.2L492.5,753.8z"
          fill="#D6D6D6"
        />
        <TransitionPath
          d="M323.5,453.3l-0.3,107.4l146.5,179.9l22.8,13.1l-0.1,45.9L322.8,696.5l-40.3-23.3l-20.1-11.6l0.1-46.4
          l20.4-77.7l0.3-107.4L323.5,453.3z"
          fill="#898989"
        />
        <TransitionPath
          d="M323.5,453.3l22.6-13.2l-0.3,107.4l-22.6,13.2L323.5,453.3z"
          fill="#FDFDFD"
        />
        <TransitionPath
          d="M283.2,430l22.6-13.1l40.3,23.3l-22.6,13.2L283.2,430z"
          fill="#DCDCDC"
        />
      </g>
    </svg>
  )
);
