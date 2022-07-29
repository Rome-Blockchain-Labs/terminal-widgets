import React, { FC, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { IIconProps, TransitionPath } from '.';

export const BeamSwap: FC<IIconProps> = ({ grayscale, height, width }) => {
  const uuid = useRef(uuidv4());

  return (
    <svg
      height={height ?? 14.837}
      viewBox="0 0 400 400"
      width={width ?? 14.832}
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
    >
      <g opacity="0.2">
        <linearGradient
          gradientTransform="matrix(1 0 0 -1 0 400)"
          gradientUnits="userSpaceOnUse"
          id={`BEAMSWAP_BG_1_${uuid.current}`}
          x1={200.3752}
          x2={200.3752}
          y1={379.0547}
          y2={20.9453}
        >
          <stop offset={0} stopColor="#15CEF7" />
          <stop offset={1} stopColor="#9123C5" />
        </linearGradient>
        <path
          clipRule="evenodd"
          d="M22,184.5c7.9-91.6,84.7-163.5,178.3-163.5c93.7,0,170.5,71.9,178.4,163.5H22z M341.5,310.2H59.2 c-3.3-4.2-6.4-8.5-9.2-13h300.7C347.8,301.6,344.8,306,341.5,310.2z M295,352H105.8c-5.4-3.4-10.6-7-15.6-10.9h220.3 C305.5,345,300.3,348.7,295,352z M78.4,331.1h243.9c4.1-3.8,8-7.8,11.7-11.9H66.7C70.5,323.3,74.4,327.3,78.4,331.1z M200.4,379.1 c25.5,0,50.7-5.4,74-16H126.4C149.6,373.6,174.9,379.1,200.4,379.1z M21.8,187.4H379c0.3,4.2,0.5,8.4,0.5,12.6c0,1.3,0,2.6-0.1,4 l0,0.5c0,0.3,0,0.6,0,0.9H21.4c0-0.5,0-1,0-1.4l0,0c0-1.3-0.1-2.6-0.1-4C21.3,195.8,21.5,191.6,21.8,187.4z M23.3,226.4h354.2 c0.8-5.6,1.4-11.2,1.7-17H21.6C21.9,215.1,22.4,220.8,23.3,226.4z M365.9,268.3H34.8c-2-4.9-3.9-9.9-5.5-15h342 C369.8,258.4,368,263.4,365.9,268.3z M27.7,247.3h345.4c1.4-5.2,2.6-10.6,3.6-16H24.1C25.1,236.7,26.2,242.1,27.7,247.3z  M355.6,289.2H45.1c-2.6-4.5-5-9.2-7.2-14h325C360.6,280,358.2,284.7,355.6,289.2z"
          fill={grayscale ? '#B4BBC7' : `url(#BEAMSWAP_BG_1_${uuid.current})`}
          fillRule="evenodd"
        />
      </g>
      <linearGradient
        gradientTransform="matrix(1 0 0 -1 0 400)"
        gradientUnits="userSpaceOnUse"
        id={`BEAMSWAP_BG_2_${uuid.current}`}
        x1={200.3763}
        x2={200.3763}
        y1={360.8944}
        y2={39.1083}
      >
        <stop offset={0} stopColor="#15CEF7" />
        <stop offset={1} stopColor="#9123C5" />
      </linearGradient>
      <TransitionPath
        clipRule="evenodd"
        d=" M40.1,186c7.1-82.3,76.1-146.9,160.3-146.9c84.2,0,153.2,64.6,160.3,146.9H40.1z M327.2,299H73.6c-2.9-3.8-5.7-7.6-8.3-11.6h270.2 C332.9,291.3,330.1,295.2,327.2,299z M285.4,336.6h-170c-4.8-3-9.5-6.3-14-9.8h198C294.9,330.3,290.2,333.6,285.4,336.6z  M90.8,317.8h219.1c3.7-3.4,7.2-7,10.5-10.7H80.3C83.6,310.8,87.1,314.4,90.8,317.8z M200.4,360.9c22.9,0,45.6-4.9,66.5-14.4H133.9 C154.8,356,177.4,360.9,200.4,360.9z M39.9,188.7h320.9c0.3,3.8,0.4,7.5,0.4,11.3c0,1.2,0,2.4-0.1,3.5v0v0v0v0v0c0,0.4,0,0.9,0,1.3 H39.6c0-0.4,0-0.9,0-1.3c0-1.2-0.1-2.4-0.1-3.6C39.5,196.2,39.7,192.4,39.9,188.7z M41.2,223.7h318.3c0.7-5,1.3-10.1,1.5-15.3H39.7 C40,213.6,40.5,218.7,41.2,223.7z M349.2,261.3H51.6c-1.8-4.4-3.5-8.9-4.9-13.5H354C352.6,252.5,351,256.9,349.2,261.3z M45.2,242.5 h310.4c1.3-4.7,2.4-9.5,3.2-14.4H42C42.8,233,43.9,237.8,45.2,242.5z M339.9,280.2h-279c-2.4-4.1-4.5-8.3-6.5-12.5h292 C344.4,271.9,342.2,276.1,339.9,280.2z"
        fill={grayscale ? '#B4BBC7' : `url(#BEAMSWAP_BG_2_${uuid.current})`}
        fillRule="evenodd"
      />
      <g opacity="0.5">
        <linearGradient
          gradientTransform="matrix(1 0 0 -1 0 400)"
          gradientUnits="userSpaceOnUse"
          id={`BEAMSWAP_BG_3_${uuid.current}`}
          x1={200.3732}
          x2={200.3732}
          y1={349.2991}
          y2={50.7141}
        >
          <stop offset={0} stopColor="#15CEF7" />
          <stop offset={1} stopColor="#9123C5" />
        </linearGradient>
        <path
          clipRule="evenodd"
          d=" M51.7,187c6.6-76.4,70.6-136.3,148.7-136.3c78.1,0,142.1,60,148.7,136.3H51.7z M318,291.8H82.7c-2.7-3.5-5.3-7.1-7.7-10.8h250.8 C323.3,284.7,320.8,288.3,318,291.8z M279.2,326.8H121.5c-4.5-2.8-8.8-5.8-13-9.1h183.7C288.1,320.9,283.7,324,279.2,326.8z  M98.7,309.3H302c3.4-3.2,6.7-6.5,9.8-10H88.9C92,302.8,95.3,306.1,98.7,309.3z M200.4,349.3c21.3,0,42.3-4.5,61.7-13.3H138.7 C158.1,344.8,179.1,349.3,200.4,349.3z M51.5,189.5h297.8c0.2,3.5,0.4,7,0.4,10.5c0,1.1,0,2.2-0.1,3.3c0,0.4,0,0.8,0,1.2H51.2 c0-0.4,0-0.8,0-1.2l0,0c0-1.1-0.1-2.2-0.1-3.3C51.1,196.5,51.2,193,51.5,189.5z M52.7,222h295.4c0.7-4.7,1.2-9.4,1.4-14.2H51.3 C51.5,212.6,52,217.3,52.7,222z M338.4,256.9H62.3c-1.7-4.1-3.2-8.2-4.5-12.5H343C341.6,248.7,340.1,252.8,338.4,256.9z  M56.4,239.4h288c1.2-4.4,2.2-8.8,3-13.3h-294C54.2,230.6,55.2,235.1,56.4,239.4z M329.8,274.4H70.9c-2.2-3.8-4.2-7.7-6-11.6h271 C334,266.7,332,270.6,329.8,274.4z"
          fill={grayscale ? '#B4BBC7' : `url(#BEAMSWAP_BG_3_${uuid.current})`}
          fillRule="evenodd"
        />
      </g>
      <g opacity="0.4">
        <linearGradient
          gradientTransform="matrix(1 0 0 -1 0 400)"
          gradientUnits="userSpaceOnUse"
          id={`BEAMSWAP_BG_4_${uuid.current}`}
          x1={200.3715}
          x2={200.3715}
          y1={309.9554}
          y2={90.0529}
        >
          <stop offset={0} stopColor="#15CEF7" />
          <stop offset={1} stopColor="#9123C5" />
        </linearGradient>
        <TransitionPath
          clipRule="evenodd"
          d=" M90.9,190.5C95.7,134.2,142.9,90,200.4,90c57.5,0,104.7,44.2,109.5,100.4H90.9z M287,267.6H113.7c-2-2.6-3.9-5.2-5.7-8h184.7 C290.9,262.4,289,265.1,287,267.6z M258.4,293.4H142.3c-3.3-2.1-6.5-4.3-9.6-6.7H268C265,289,261.8,291.3,258.4,293.4z  M125.5,280.5h149.7c2.5-2.3,4.9-4.8,7.2-7.3H118.3C120.6,275.7,123,278.2,125.5,280.5z M200.4,309.9c15.7,0,31.2-3.3,45.4-9.8 h-90.8C169.2,306.6,184.7,310,200.4,309.9z M90.7,192.3H310c0.2,2.6,0.3,5.1,0.3,7.7c0,0.8,0,1.6-0.1,2.4c0,0.3,0,0.6,0,0.9H90.5 c0-0.3,0-0.6,0-0.9l0,0c0-0.8-0.1-1.6-0.1-2.4C90.4,197.4,90.5,194.8,90.7,192.3z M91.6,216.2h217.5c0.5-3.4,0.9-6.9,1-10.4H90.6 C90.7,209.3,91.1,212.7,91.6,216.2z M302,241.9H98.7c-1.2-3-2.4-6.1-3.3-9.2h210C304.4,235.8,303.3,238.9,302,241.9z M94.3,229 h212.1c0.9-3.2,1.6-6.5,2.2-9.8H92.1C92.7,222.6,93.4,225.8,94.3,229z M295.7,254.8H105c-1.6-2.8-3.1-5.6-4.5-8.6h199.6 C298.8,249.1,297.3,252,295.7,254.8z"
          fill={grayscale ? '#B4BBC7' : `url(#BEAMSWAP_BG_4_${uuid.current})`}
          fillRule="evenodd"
        />
      </g>
      <TransitionPath
        d="M252.9,112.8c16.8-9.1,29-12.6,48.4-7.4c19.4,5.2,21,42.1,29.2,57.9c-11.6-14.3-18.2-41.6-38.5-42.9 c-20.3-1.2-40.8,5.9-53.9,18.6c3.1,2.5,6.2,5,9.3,7.5c-26.1,15.1-61.4,18.5-91.6,8.8c10.8-1.1,21.1-5.1,29.2-11.2 c-12.2-17.9-40.7-23.3-64.4-19.7C97,128.1,96,157.3,73.2,163.7c19.6-22.4,29.8-50.6,59.2-59c11.3-3.2,17.3-3.8,28.3,0.5 c13.3,5.2,31.8,23.8,46.2,25.8C219.8,132.8,242.2,118.6,252.9,112.8L252.9,112.8z"
        fill="#05113B"
      />
      <TransitionPath
        d="M126.2,227.1c11.7-6.4,20.2-8.8,33.7-5.1c13.5,3.6,14.6,29.3,20.3,40.3c-8.1-10-12.7-29-26.8-29.9 c-14.1-0.9-28.4,4.1-37.5,13c2.1,1.7,4.3,3.5,6.4,5.2c-18.2,10.5-42.7,12.9-63.7,6.1c7.5-0.8,14.7-3.6,20.3-7.8 c-8.5-12.5-28.3-16.2-44.8-13.7c-16.5,2.5-17.1,22.9-33,27.3c13.7-15.6,20.7-35.2,41.2-41.1c7.9-2.2,12-2.7,19.7,0.3 c9.3,3.6,22.2,16.6,32.2,18C103.1,241.1,118.7,231.1,126.2,227.1L126.2,227.1z"
        fill="#05113B"
      />
      <TransitionPath
        d="M291,297.8c12.7-6.9,22-9.5,36.7-5.6c14.7,3.9,15.9,31.7,22.1,43.6c-8.8-10.8-13.8-31.4-29.1-32.3 c-15.3-0.9-30.8,4.4-40.8,14.1c2.3,1.9,4.7,3.8,7,5.6c-19.7,11.4-46.5,14-69.3,6.7c8.2-0.9,16-3.9,22.1-8.5 c-9.2-13.5-30.8-17.6-48.7-14.8c-17.9,2.7-18.6,24.8-35.9,29.6c14.9-16.9,22.5-38.1,44.8-44.5c8.6-2.4,13.1-2.9,21.4,0.4 c10.1,3.9,24.1,17.9,35,19.5C265.9,312.9,282.8,302.2,291,297.8L291,297.8z"
        fill="#05113B"
      />
    </svg>
  );
};
