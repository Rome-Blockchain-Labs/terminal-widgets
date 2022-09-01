import styled from 'styled-components';
import tw from 'twin.macro';

import Card from '../../components/Card';
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

export const GridColumn = styled.div<{ isMobile?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;

  ${({ isMobile }) => isMobile && 'grid-template-columns: 1fr 1fr;'}
`;

export const TopBar = styled.div<{ isMobile?: boolean }>`
  margin: 0 0 24px 0;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;

  ${({ isMobile }) =>
    isMobile &&
    'display: grid; grid-template-columns: 1fr 1fr; margin: 8px 0 24px 0;'}
`;

export const LiquidityProviderModeWrapper = styled.div`
  width: 100%;

  @media only screen and (min-width: 768px) {
    padding-right: 24px;
  }
`;

export const PoolName = styled.div`
  ${tw`text-xl font-medium`}
  display: flex;
  margin-bottom: 24px;

  @media only screen and (min-width: 768px) {
    justify-content: flex-end;
    margin-bottom: 0;
  }
`;

export const FirstColumn = styled(AutoColumn)`
  grid-auto-rows: min-content;
  padding-bottom: 24px;

  gap: 1rem;

  @media only screen and (min-width: 768px) {
    padding-right: 24px;
    padding-bottom: 0;

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

export const TokenWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  ${tw`mb-2`}
`;

export const ActiveText = styled.div`
  font-weight: 500;
  font-size: 12px;
`;

export const Section = styled(Card)`
  padding: 16px 12px;
  border-radius: 4px;

  @media only screen and (min-width: 768px) {
    padding: 16px;
  }
`;

export const CurrentPriceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 8px;
`;

export const PoolRatioWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const DynamicFeeRangeWrapper = styled(AutoColumn)`
  flex: 2;
  justify-content: flex-end;
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
  margin-bottom: 28px;
  ${tw`bg-orange-500 bg-opacity-40`}
`;

export const DetailWrapper = styled(AutoColumn)`
  padding: 1rem 1rem 12px;
  margin: 24px 0 28px;
  border-radius: 4px;
`;

export const DetailBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;
