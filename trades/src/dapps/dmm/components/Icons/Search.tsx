import React from 'react';

function Search({ color, size = 24 }: { size?: number; color?: string }) {
  return (
    <svg
      fill="none"
      height={size || 24}
      viewBox={`0 0 ${size} ${size}`}
      width={size || 24}
      xmlns="http://www.w3.org/2000/svg"
    >
      <svg
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.1931 5.58187C16.525 7.91369 16.525 11.6943 14.1931 14.0261C11.8613 16.358 8.08069 16.358 5.74887 14.0261C3.41704 11.6943 3.41704 7.91369 5.74887 5.58187C8.08069 3.25005 11.8613 3.25005 14.1931 5.58187"
          stroke={color || 'currentColor'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M14.1499 14.06L19.9999 19.99"
          stroke={color || 'currentColor'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </svg>
  );
}

export default Search;
