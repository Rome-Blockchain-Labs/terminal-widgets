import React from 'react';
import { ArrowLeft } from 'react-feather';
import styled from 'styled-components';
import tw from 'twin.macro';

import QuestionHelper from '../questionHelper';
import { RowBetween } from '../row';

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`;

const ActiveText = styled.div`
  ${tw`font-medium text-xl text-yellow-400`}
`;

const StyledArrowLeft = styled(ArrowLeft)`
  ${tw`text-yellow-400 text-xl`}
`;

export function FindPoolTabs({ onBack }: { onBack: () => void }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <button onClick={onBack}>
          <StyledArrowLeft size={18} />
        </button>
        <ActiveText>IMPORT POOL</ActiveText>
        <QuestionHelper text="Use this tool to find pairs that don't automatically appear in the interface." />
      </RowBetween>
    </Tabs>
  );
}

export function AddRemoveTabs({
  adding,
  newLiquidity,
  onBack,
}: {
  adding: boolean;
  newLiquidity?: boolean;
  onBack?: () => void;
}) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <button onClick={onBack}>
          <StyledArrowLeft size={18} />
        </button>
        <ActiveText>
          {newLiquidity
            ? 'CREATE A PAIR'
            : adding
            ? 'ADD LIQUIDITY'
            : 'REMOVE LIQUIDITY'}
        </ActiveText>
        <QuestionHelper
          text={
            adding
              ? 'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
              : 'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
          }
        />
      </RowBetween>
    </Tabs>
  );
}
