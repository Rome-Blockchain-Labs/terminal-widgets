import React, { FC, memo } from 'react';

import { IIconProps } from '.';

export const DFKIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) =>
    active ? (
      <svg
        height={height ?? 25}
        viewBox="0 0 554.9 554.9"
        width={width ?? 25}
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          fill={'#461710'}
          points="381.3,29.2 172,29.2 24,177.2 24,386.5 172,534.5 381.3,534.5 529.3,386.5 529.3,177.2"
        />
        <polygon
          fill={'#FCC85C'}
          points="375.3,43.7 178,43.7 38.5,183.2 38.5,380.5 178,520.1 375.3,520.1 514.9,380.5 514.9,183.2"
        />
        <polygon
          fill={'#F9F2A9'}
          points="369.5,59.5 184.9,59.5 54.3,190 54.3,374.7 184.9,505.3 369.5,505.3 500.1,374.7 500.1,190"
        />
        <polygon
          fill={'#FCC85C'}
          points="360.8,79.5 193.6,79.5 152,121.1 158.7,164.1 117.5,155.6 75.4,197.7 75.4,364.8 109.2,398.6,158.4,395.2 150.5,439.9 193.6,483 360.8,483 403.1,440.7 394.9,393.6 444.2,399.7 479,364.8 479,197.7 439.7,158.4 393,164.4,401.4,120.1"
        />
        <polygon
          fill={'#34A937'}
          points="128.5,170.8 186,192.4 172.6,127.7 205.5,97.9 351.2,97.9 380.8,127.5 363.6,192.4 424.1,174.9,454.4,205.2 454.4,352.5 426.4,380.5 365,360.7 378.5,428.5 351.5,455.4 200.3,455.4 170.4,425.5 186.9,361.7 134.7,383.3,100.8,349.4 100.8,203.7"
        />
        <polygon
          fill={'#E2E79B'}
          points="316.8,184.4 236.5,184.4 179.7,241.2 179.7,321.5 236.5,378.3 316.8,378.3 373.7,321.5 373.7,241.2"
        />
      </svg>
    ) : (
      <svg
        height={height ?? 25}
        viewBox="0 0 554.9 554.9"
        width={width ?? 25}
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="381.3,29.2 172,29.2 24,177.2 24,386.5 172,534.5 381.3,534.5 529.3,386.5 529.3,177.2 	" />
        <polygon
          className="st14"
          fill={'#706F6F'}
          points="375.3,43.7 178,43.7 38.5,183.2 38.5,380.5 178,520.1 375.3,520.1 514.9,380.5 514.9,183.2 	"
        />
        <polygon
          className="st22"
          fill={'#C6C6C6'}
          points="369.5,59.5 184.9,59.5 54.3,190 54.3,374.7 184.9,505.3 369.5,505.3 500.1,374.7 500.1,190 	"
        />
        <polygon
          className="st26"
          fill={'#9D9D9C'}
          points="360.8,79.5 193.6,79.5 152,121.1 158.7,164.1 117.5,155.6 75.4,197.7 75.4,364.8 109.2,398.6
		158.4,395.2 150.5,439.9 193.6,483 360.8,483 403.1,440.7 394.9,393.6 444.2,399.7 479,364.8 479,197.7 439.7,158.4 393,164.4
		401.4,120.1 	"
        />
        <polygon
          className="st27"
          fill={'#575756'}
          points="128.5,170.8 186,192.4 172.6,127.7 205.5,97.9 351.2,97.9 380.8,127.5 363.6,192.4 424.1,174.9
		454.4,205.2 454.4,352.5 426.4,380.5 365,360.7 378.5,428.5 351.5,455.4 200.3,455.4 170.4,425.5 186.9,361.7 134.7,383.3
		100.8,349.4 100.8,203.7 	"
        />
        <polygon
          className="st14"
          fill={'#706F6F'}
          points="316.8,184.4 236.5,184.4 179.7,241.2 179.7,321.5 236.5,378.3 316.8,378.3 373.7,321.5 373.7,241.2
		"
        />
      </svg>
    )
);