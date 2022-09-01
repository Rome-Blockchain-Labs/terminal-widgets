import React from 'react';

function FarmIcon({ color, size }: { size?: number; color?: string }) {
  return (
    <svg
      fill="none"
      height={size || 24}
      viewBox="0 0 24 24"
      width={size || 24}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M5 10.5402C7.61447 10.3506 12.4284 11.1389 11.4 15.0683C6.34187 15.8825 5.59559 12.3087 5 10.5402Z"
        fillRule="evenodd"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        clipRule="evenodd"
        d="M19.0181 12.4093C16.4037 12.2197 11.5897 13.008 12.6181 16.9374C17.6763 17.7516 18.4226 14.1778 19.0181 12.4093Z"
        fillRule="evenodd"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        clipRule="evenodd"
        d="M15.1661 1.02545C12.486 2.62427 8.33405 6.68627 12.0415 9.84655C17.5345 7.19304 15.8025 3.1705 15.1661 1.02545Z"
        fillRule="evenodd"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12.009 10.1717V21.8847"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.69751 22.975C7.69751 22.975 12.1841 21.2609 16.329 23"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default FarmIcon;
