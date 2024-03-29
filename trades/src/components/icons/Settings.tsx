import React, { FC, memo } from 'react';

import { IIconProps, SVG, TransitionPath } from '.';

export const SettingsIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 12.975}
      hoverColor={activeColor}
      viewBox="0 0 12.975 12.975"
      width={width ?? 12.975}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M11.691 4.853a.581.581 0 0 1-.169-.07.6.6 0 0 1-.2-.823 1.68 1.68 0 0 0-2.308-2.309.617.617 0 0 1-.171.071.59.59 0 0 1-.453-.071.6.6 0 0 1-.27-.37A1.653 1.653 0 0 0 6.489-.003a1.654 1.654 0 0 0-1.631 1.284.593.593 0 0 1-.352.412.6.6 0 0 1-.542-.043 1.68 1.68 0 0 0-2.308 2.308.607.607 0 0 1 .071.172.6.6 0 0 1-.441.722 1.68 1.68 0 0 0 0 3.265.583.583 0 0 1 .169.07.6.6 0 0 1 .2.822 1.68 1.68 0 0 0 2.309 2.308.613.613 0 0 1 .171-.071.6.6 0 0 1 .723.441 1.653 1.653 0 0 0 1.631 1.283 1.654 1.654 0 0 0 1.632-1.284.586.586 0 0 1 .07-.169.6.6 0 0 1 .822-.2 1.68 1.68 0 0 0 2.309-2.308.654.654 0 0 1-.071-.172.6.6 0 0 1 .442-.722 1.68 1.68 0 0 0 0-3.265zm-.254 2.214a1.682 1.682 0 0 0-1.238 2.029 1.725 1.725 0 0 0 .2.479.6.6 0 0 1-.822.822 1.679 1.679 0 0 0-2.506 1.039.577.577 0 0 1-.581.456.576.576 0 0 1-.581-.456 1.683 1.683 0 0 0-1.633-1.285 1.7 1.7 0 0 0-.4.048 1.667 1.667 0 0 0-.477.2.6.6 0 0 1-.823-.822 1.683 1.683 0 0 0-.561-2.31 1.659 1.659 0 0 0-.477-.2.6.6 0 0 1 0-1.163 1.679 1.679 0 0 0 1.238-2.027 1.655 1.655 0 0 0-.2-.481.6.6 0 0 1 .823-.822 1.678 1.678 0 0 0 2.506-1.039.6.6 0 0 1 1.162 0 1.681 1.681 0 0 0 2.028 1.238 1.708 1.708 0 0 0 .479-.2.6.6 0 0 1 .822.822 1.681 1.681 0 0 0 .56 2.307 1.644 1.644 0 0 0 .478.2.6.6 0 0 1 0 1.163z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M6.487 3.965A2.523 2.523 0 1 0 9.01 6.488a2.526 2.526 0 0 0-2.523-2.523zm0 3.964a1.441 1.441 0 1 1 1.442-1.441 1.443 1.443 0 0 1-1.442 1.441z"
        fill={active ? activeColor : color}
      />
    </SVG>
  )
);
