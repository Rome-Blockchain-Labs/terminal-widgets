import styled from 'styled-components';
import tw from 'twin.macro';

import Card from '../../components/Card';
import { AutoColumn } from '../../components/Column';
import NumericalInput from '../../components/NumericalInput';

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

export const GridColumn = styled.div<{ isMobile?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;

  ${({ isMobile }) => isMobile && 'grid-template-columns: 1fr 1fr;'}
`;

export const TokenColumn = styled(AutoColumn)<{ isMobile?: boolean }>`
  padding-bottom: 24px;

  ${({ isMobile }) =>
    isMobile && 'padding-right: 24px; padding-bottom: 0; border-bottom: none;'}
`;

export const AMPColumn = styled(AutoColumn)<{ isMobile?: boolean }>`
  padding-top: 24px;

  ${({ isMobile }) => isMobile && ' padding-left: 24px; padding-top: 0;'}
`;

export const ActiveText = tw.div`text-xl font-medium`;

export const Section = styled(Card)`
  padding: 16px;

  border-radius: 8px;
`;

export const NumericalInput2 = styled(NumericalInput)`
  width: 100%;
  height: 60px;
`;

export const USDPrice = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  padding-left: 8px;
`;

export const Warning = styled.div`
  display: flex;

  border-radius: 0.625rem;
  padding: 0.75rem 1rem;
  ${tw`bg-orange-500 bg-opacity-40`}
`;
