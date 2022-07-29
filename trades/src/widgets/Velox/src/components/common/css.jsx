import styled from 'styled-components';

export const HighlightOnHover = styled.span`
  cursor: pointer;

  &:hover {
    background-color: #255E6A;
    border-radius: 20px;
`;

export const VerticalAlignCenter = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: left;
`;
