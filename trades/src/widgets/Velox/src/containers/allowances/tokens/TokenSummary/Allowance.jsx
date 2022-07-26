import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import IconUnlock from '../../../../assets/icons/icon-unlock.svg';
import IconUnlockWhite from '../../../../assets/icons/icon-unlock-white.svg';
import { Button } from '../../../../assets/styled';
import { SmallError, SmallSpinner } from '../../../../components/Icons';
import { unlockTokenAllowance } from '../../../../redux/quotas/quotasSlice';
import useTokenQuota from '../../../../redux/quotas/useTokenQuota';
import useProvider from '../../../ethereum/use-provider';
const MaxWidth = styled.div`
  white-space: break-spaces;
  word-break: break-word;
  max-width: calc(40vw);
  float: right;
  @media only screen and (min-width: 766px) {
    float: initial;
    max-width: calc(12vw);
  }
`;
const ButtonUnlock = styled(Button)`
  padding: 6px 10px 5px 13px;
  width: 95px;
  margin: 0 0 0 0;
  > img {
    right: 3px;
    height: 30px;
    width: 30px;
  }
`;

const UnlockedText = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: #067c82;
  img {
    height: 18px;
    width: 18px;
  }
`;

const Allowance = (props) => {
  const { field = 0, token } = props;
  const dispatch = useDispatch();
  const { provider } = useProvider();
  const asyncValue = useTokenQuota(token.id, field);
  if (!asyncValue || asyncValue?.loading)
    return (
      <MaxWidth>
        <SmallSpinner />
      </MaxWidth>
    );
  if (asyncValue?.error)
    return (
      <MaxWidth>
        <SmallError />
      </MaxWidth>
    );
  //79228162514 is FFFFFFFFFFFFFFFFFFFFFFFF in decimals, with 18 decimals shifted
  // it is used as certain tokens (Pangolin) truncates the max allowance to this value
  if (Number(asyncValue.value) < 79228162514) {
    return (
      <MaxWidth>
        <ButtonUnlock
          onClick={() => dispatch(unlockTokenAllowance({ provider, token }))}
        >
          UNLOCK
          <img alt={'Unlocked'} src={IconUnlockWhite} />
        </ButtonUnlock>
      </MaxWidth>
    );
  }
  return (
    <MaxWidth>
      <UnlockedText>
        UNLOCKED <img alt={'Unlocked'} src={IconUnlock} />
      </UnlockedText>
    </MaxWidth>
  );
};
export default Allowance;
