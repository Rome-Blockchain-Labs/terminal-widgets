import { Flex } from 'rebass';
import styled from 'styled-components';
import tw from 'twin.macro';

export const PageWrapper = styled.div`
  width: 100%;
`;

export const GlobalDataContainer = styled.div<{ isMobile: boolean }>`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr;
  margin-bottom: 1rem;

  ${({ isMobile }) => !isMobile && 'grid-template-columns: repeat(3, 1fr);'}
`;

export const GlobalDataItem = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 16px;

  ${tw`bg-dark-400 rounded-xl border border-gray-200`}
`;

export const GlobalDataItemTitle = styled.span`
  ${tw`text-xl`}
`;

export const GlobalDataItemValue = styled.span`
  ${tw`text-xl text-green-400 font-bold`}
`;

export const AddLiquidityInstructionContainer = styled.div`
  ${tw`bg-gray-500`}
  margin-bottom: 20px;
  padding: 1rem;

  border-radius: 8px;
`;

export const AddLiquidityTitle = styled.span`
  ${tw`text-xl text-green-400`}

  margin-right: 0.5rem;
`;

export const AddLiquidityInstructionText = styled.span`
  ${tw`text-xl`}
`;

export const ToolbarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const CurrencyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  margin-bottom: 15px;

  @media only screen and (min-width: 1000px) {
    flex-direction: row;
    align-items: center;
    margin-bottom: 0;
  }
`;

export const SearchWrapper = styled(Flex)`
  align-items: center;
  gap: 12px;
`;

export const SelectPairInstructionWrapper = styled.div`
  ${tw`text-xl bg-dark-400`}
  text-align: center;
  height: 100%;
  padding: 24px;
`;
