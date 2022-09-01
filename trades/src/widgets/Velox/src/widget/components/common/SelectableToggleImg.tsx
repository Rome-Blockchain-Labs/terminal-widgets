import styled from 'styled-components';

import { withEnlargedProps } from '../../WidgetSizeStateContext';

const NormalSelectableToggleImg = styled.div<{ selected: boolean }>`
  align-self: flex-start;
  background-color: #093740;
  border: solid 0.125rem #46a5a3;
  border-radius: 3.125rem;
  width: 2.263rem;
  height: 2.263rem;
  display: flex;
  cursor: pointer;
  padding: 0.125rem;

  img {
    z-index: 9;
    margin: auto;
    max-height: 100%;
    max-width: 100%;
    filter: contrast(40%);
    ${({ selected }) =>
      selected &&
      `
    filter:none;
  `}
  }
  :hover {
    border: solid 0.125rem #36d3cf;
    filter: none;
    img {
      filter: none;
    }
  }
  ${({ selected }) =>
    selected &&
    `
   border: solid .125rem #36D3CF;
    filter:none;
  `}
`;

const EnlargedSelectableToggleImg = styled.div<{ selected: boolean }>`
  align-self: flex-start;
  background-color: #093740;
  border: solid 0.125rem #46a5a3;
  border-radius: 3.125rem;
  width: 3.75rem;
  height: 3.75rem;
  display: flex;
  cursor: pointer;
  padding: 0.125rem;

  img {
    z-index: 9;
    margin: auto;
    max-height: 100%;
    max-width: 100%;
    height: 80%;
    filter: contrast(40%);
    ${({ selected }) =>
      selected &&
      `
    filter:none;
  `}
  }
  :hover {
    border: solid 0.125rem #36d3cf;
    filter: none;
    img {
      filter: none;
    }
  }
  ${({ selected }) =>
    selected &&
    `
   border: solid .125rem #36D3CF;
    filter:none;
  `}
`;

export const SelectableToggleImg = withEnlargedProps(
  NormalSelectableToggleImg,
  EnlargedSelectableToggleImg
);
