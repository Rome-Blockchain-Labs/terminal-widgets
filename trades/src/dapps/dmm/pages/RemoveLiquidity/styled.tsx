import styled from 'styled-components';
import tw, { theme } from 'twin.macro';

import { AutoColumn } from '../../components/Column';

export const PageWrapper = styled.div`
  width: 100%;
`;

export const Container = styled.div`
  max-width: 936px;
  margin: 0 auto;
  padding: 24px 20px;
  ${tw`bg-green-700`}

  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 8px;

  @media only screen and (min-width: 1000px) {
    padding: 24px;
  }
`;

export const GridColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  @media only screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const TopBar = styled.div`
  margin: 0 0 24px 0;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;

  @media only screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 8px 0 24px 0;
  }
`;

export const LiquidityProviderModeWrapper = styled.div`
  width: 100%;

  @media only screen and (min-width: 768px) {
    padding-right: 24px;
  }
`;

export const PoolName = styled.div`
  display: flex;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 500;

  @media only screen and (min-width: 768px) {
    justify-content: flex-end;
    margin-bottom: 0;
  }
`;

export const FirstColumn = styled(AutoColumn)`
  grid-auto-rows: min-content;
  padding-bottom: 24px;
  ${tw`border-b border-gray-200`}
  gap: 20px;

  @media only screen and (min-width: 768px) {
    padding-right: 24px;
    padding-bottom: 0;
    ${tw`border-r border-gray-200`}
    border-bottom: none;
  }
`;

export const SecondColumn = styled(AutoColumn)`
  grid-auto-rows: min-content;
  padding-top: 24px;

  @media only screen and (min-width: 768px) {
    padding-left: 24px;
    padding-top: 0;
  }
`;

export const MaxButton = styled.button<{ width: string }>`
  padding: 0.5rem 1rem;

  border: 1px solid transparent;
  border-radius: 3px;
  ${tw`text-xl bg-green-700`}

  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;

  :hover {
    border: 1px solid ${theme`colors.green.400`};
  }
  :focus {
    border: 1px solid ${theme`colors.green.400`};
    outline: none;
  }
`;

export const DetailWrapper = styled(AutoColumn)`
  padding: 1rem 1rem 12px;
  ${tw`border border-gray-200`}
  margin: 24px 0 28px;
  border-radius: 4px;
`;

export const DetailBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export const TokenWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ModalDetailWrapper = styled.div`
  ${tw`border border-gray-200`}
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 28px;
`;

export const CurrentPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media only screen and (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;
