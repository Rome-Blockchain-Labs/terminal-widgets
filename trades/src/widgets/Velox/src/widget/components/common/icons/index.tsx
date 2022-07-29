import styled from 'styled-components';

export interface IIconProps {
  color?: string;
  activeColor?: string;
  active?: boolean;
  width?: number;
  height?: number;
  backgroundColor?: string;
  activeBackgroundColor?: string;
  disabled?: boolean;
  disabledColor?: string;
  ref?: any;
}

export const SVG = styled.svg<{
  hoverColor?: string;
  hoverStrokeColor?: string;
}>`
  &:hover {
    * {
      ${({ hoverColor, hoverStrokeColor }) =>
        `fill: ${hoverColor}; stroke: ${hoverStrokeColor}`}
    }
  }
`;

export * from './ArrowBack';
export * from './ArrowNext';
