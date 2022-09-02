import React, { FC, memo } from 'react';

import { IIconProps, SVG, TransitionPath } from '.';

export const TelegramIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      fill="currentColor"
      height={height ?? 20}
      hoverColor={activeColor}
      viewBox="0 0 100 100"
      width={width ?? 20}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M84.16,14.148l-71.047,29.57c0,0-3.359,1.221-3.099,3.473c0.267,2.256,3.008,3.288,3.008,3.288l17.877,6.382
        c0,0,5.396,18.772,6.458,22.344c1.062,3.562,1.914,3.646,1.914,3.646c0.989,0.456,1.888-0.27,1.888-0.27l11.55-11.169L70.71,86.054
        c4.869,2.253,6.641-2.441,6.641-2.441L90,15.935C90,11.427,84.16,14.148,84.16,14.148z M71.582,78.17L52.324,62.51l-5.976,5.777
        l1.314-12.291l25.67-24.329L38.341,52.441l-15.521-5.54l59.217-24.648L71.582,78.17z"
      />
    </SVG>
  )
);
