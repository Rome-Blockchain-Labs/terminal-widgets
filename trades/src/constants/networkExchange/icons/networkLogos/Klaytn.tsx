import React, { FC, memo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  IIconProps,
  TransitionPath,
} from '../../../../components/icons';

const KlaytnIcon: FC<IIconProps> = memo(
  ({ active, height, width }) => {
    const uuid = useRef(uuidv4());

    return (
      <svg
        fill="none"
        height={height}
        viewBox="0 0 24 24"
        width={width}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={`KLAYTN_BG_${uuid.current}`}
            x1="21.4846"
            x2="4.57011"
            y1="4.56654"
            y2="21.4492"
          >
            <stop stopColor="#FF9600" />
            <stop offset="0.36" stopColor="#FE5300" />
            <stop offset="0.69" stopColor="#D90F1E" />
            <stop offset="1" stopColor="#850000" />
          </linearGradient>
        </defs>
        <TransitionPath
          d="M19.4931 20.9768C19.713 21.1972 19.7109 21.1983 19.4609 21.395C17.2794 23.1129 14.7954 23.9912 12.026 23.9988C9.23724 24.0063 6.7382 23.1226 4.54067 21.3972C4.48059 21.3499 4.42372 21.2983 4.36792 21.2467C4.34968 21.2306 4.34002 21.2058 4.30783 21.1553C4.90228 20.5673 5.50209 19.9771 6.09654 19.3837C7.99147 17.4916 9.88748 15.5996 11.7738 13.7C11.9552 13.5172 12.0517 13.5129 12.2352 13.6978C14.6495 16.1295 17.0724 18.5516 19.4931 20.9768ZM13.5979 11.9799C16.1249 14.5159 18.6722 17.0734 21.2431 19.6524C22.9471 17.5787 23.8849 15.1878 23.989 12.4906C24.1081 9.42137 23.1628 6.70048 21.2099 4.29241C18.6379 6.88968 16.1034 9.4504 13.5979 11.9799ZM6.37016 15.9823C10.792 11.5714 15.2139 7.15951 19.6422 2.7433C19.6122 2.71535 19.5768 2.67987 19.5381 2.64869C17.5702 1.06518 15.3233 0.19548 12.8093 0.0105754C12.4209 -0.0184504 12.4241 -0.0141503 12.2749 0.380385C11.6762 1.9639 11.0764 3.54634 10.4755 5.12878C9.12135 8.70003 7.76614 12.2702 6.412 15.8414C6.39483 15.8877 6.38196 15.935 6.37016 15.9823ZM6.34655 16.0726C6.35513 16.0425 6.36157 16.0124 6.37016 15.9823C6.35513 15.9973 6.34011 16.0124 6.32509 16.0274C6.3326 16.0425 6.34011 16.0575 6.34762 16.0726H6.34655ZM9.35956 1.8951C9.29947 1.95315 9.23724 2.00905 9.17822 2.06818C6.31543 4.93098 3.45264 7.79485 0.588781 10.6566C0.00184532 11.2435 -0.0110308 11.2403 0.00291832 12.0692C0.0479847 14.7879 0.883859 17.2336 2.5481 19.388C2.59638 19.4503 2.65647 19.5041 2.74875 19.6019C4.98597 13.6753 7.20281 7.80023 9.42072 1.9252C9.40034 1.91553 9.37995 1.90477 9.36063 1.8951H9.35956Z"
          fill={active ? `url(#KLAYTN_BG_${uuid.current})` : '#B4BBC7'}
        />
      </svg>
    );
  }
);

export default KlaytnIcon;