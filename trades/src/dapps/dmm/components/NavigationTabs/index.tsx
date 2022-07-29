import { useContext } from 'react';
import { ArrowLeft } from 'react-feather';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';

import { DmmContext, DmmPage } from '../../../../widgets/Dmm/DmmContext';
import { ButtonEmpty } from '../Button';
import QuestionHelper from '../QuestionHelper';
import { RowBetween } from '../Row';

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`;

const Wrapper = styled(RowBetween)`
  padding: 1rem 0 4px;

  @media only screen and (min-width: 768px) {
    padding: 1rem 0;
  }
`;

const activeClassName = 'ACTIVE';

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;

  font-size: 20px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
  }

  :hover,
  :focus {
  }
`;

const ActiveText = styled.div`
  ${tw`font-bold text-xl text-green-400`}
`;

const StyledArrowLeft = styled(ArrowLeft)``;

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
  return (
    <Tabs style={{ display: 'none', marginBottom: '20px' }}>
      <StyledNavLink
        id={'swap-nav-link'}
        isActive={() => active === 'swap'}
        to={'/swap'}
      >
        Swap
      </StyledNavLink>
      <StyledNavLink
        id={'pool-nav-link'}
        isActive={() => active === 'pool'}
        to={'/pool'}
      >
        Pool
      </StyledNavLink>
    </Tabs>
  );
}

export function FindPoolTabs() {
  const { setPage } = useContext(DmmContext);

  const goBack = () => {
    setPage(DmmPage.POOL);
  };

  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <ButtonEmpty padding="0" width="fit-content" onClick={goBack}>
          <StyledArrowLeft tw="w-5" />
        </ButtonEmpty>
        <ActiveText>IMPORT POOL</ActiveText>
        <QuestionHelper text="Use this tool to find pairs that don't automatically appear in the interface." />
      </RowBetween>
    </Tabs>
  );
}

export function AddRemoveTabs({
  adding,
  creating,
}: {
  adding: boolean;
  creating: boolean;
}) {
  return (
    <Tabs>
      <Wrapper>
        <div tw="flex justify-center w-full">
          <ActiveText>
            {creating
              ? 'CREATE A NEW POOL'
              : adding
              ? 'ADD LIQUIDITY'
              : 'REMOVE LIQUIDITY'}
          </ActiveText>
          <QuestionHelper
            text={
              adding
                ? 'Add liquidity and receive pool tokens representing your pool share. You will earn dynamic fees on trades for this token pair, proportional to your pool share. Fees earned are automatically claimed when you withdraw your liquidity.'
                : 'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
            }
          />
        </div>
        {/* <TransactionSettings /> */}
      </Wrapper>
    </Tabs>
  );
}

export function MigrateTab() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 0' }}>
        <div style={{ alignItems: 'center', display: 'flex' }}>
          <ActiveText>MIGRATE LIQUIDITY</ActiveText>
          <QuestionHelper
            text={
              'Converts your liquidity position on Sushiswap into underlying tokens at the current rate. Tokens are deposited into the basic AMP=1 pool on the KyberSwap and you will be given DMM-LP tokens representing your new pool share. If rates are different between the two platforms, some tokens may be refunded to your address.'
            }
          />
        </div>
        {/* <TransactionSettings /> */}
      </RowBetween>
    </Tabs>
  );
}
