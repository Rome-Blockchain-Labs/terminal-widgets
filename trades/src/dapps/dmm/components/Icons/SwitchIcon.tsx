import React from 'react';

const AddCircle = ({
  color,
  height,
  width,
}: {
  width?: number;
  height?: number;
  color?: string;
}) => {
  return (
    <svg
      fill="none"
      height={height || 24}
      viewBox="0 0 24 24"
      width={width || 24}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 9H16"
        stroke={color || 'white'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M10 13L8 15L10 17"
        stroke={color || 'white'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M16 15H8"
        stroke={color || 'white'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M14 7L16 9L14 11"
        stroke={color || 'white'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default AddCircle;
