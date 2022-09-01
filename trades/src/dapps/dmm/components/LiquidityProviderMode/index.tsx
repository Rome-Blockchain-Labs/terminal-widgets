import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

import { ButtonEmpty } from '../Button';
import InfoHelper from '../InfoHelper';

const TabContainer = styled.div`
  display: flex;
  border-radius: 20px;
  ${tw`bg-dark-600`}
`;

const Tab = styled(ButtonEmpty)<{ isActive?: boolean; isLeft?: boolean }>`
  ${tw`text-xl font-medium`}
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 8px;
  border-radius: 20px;
  ${({ isActive }) => isActive && tw`bg-green-400 text-black`}
  &:hover {
    text-decoration: none;
  }
`;

const TabText = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const LiquidityProviderMode = ({
  activeTab,
  setActiveTab,
  singleTokenInfo,
}: {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  singleTokenInfo: string;
}) => {
  return (
    <TabContainer>
      <Tab
        isActive={activeTab === 0}
        padding="0"
        onClick={() => setActiveTab(0)}
      >
        <TabText isActive={activeTab === 0}>TOKEN PAIR</TabText>
      </Tab>
      <Tab
        isActive={activeTab === 1}
        padding="0"
        onClick={() => setActiveTab(1)}
      >
        <TabText isActive={activeTab === 1}>
          SINGLE TOKEN
          <InfoHelper
            isActive={activeTab === 1}
            size={18}
            text={singleTokenInfo}
          />
        </TabText>
      </Tab>
    </TabContainer>
  );
};

export default LiquidityProviderMode;
