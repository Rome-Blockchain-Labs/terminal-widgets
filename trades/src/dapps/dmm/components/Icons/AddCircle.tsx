import React from 'react';
import { theme } from 'twin.macro';
const AddCircle = ({ height, width }: { width?: number; height?: number }) => {
  return (
    <svg
      height={height || 20}
      viewBox="0 0 20 20"
      width={width || 20}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fillRule="evenodd">
        <path d="M-2-2h24v24H-2z" />
        <path
          d="M10 6v8m4-4H6m4 9h0a9 9 0 0 1-9-9h0a9 9 0 0 1 9-9h0a9 9 0 0 1 9 9h0a9 9 0 0 1-9 9z"
          stroke={theme`colors.green.400`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
};

export default AddCircle;
