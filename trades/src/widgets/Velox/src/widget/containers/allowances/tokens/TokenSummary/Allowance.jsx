import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { unlockTokenAllowance } from '../../../../../redux/quotas/quotasSlice';
import useTokenQuota from '../../../../../redux/quotas/useTokenQuota';
import IconUnlock from '../../../../assets/icons/icon-unlock.svg';
import IconUnlockWhite from '../../../../assets/icons/icon-unlock-white.svg';
import { Button } from '../../../../assets/styled';
import { SmallError, SmallSpinner } from '../../../../components/Icons';
import { withEnlargedProps } from '../../../../WidgetSizeStateContext';
import useProvider from '../../../ethereum/use-provider';
const MaxWidth = styled.div`
  white-space: break-spaces;
  word-break: break-word;
  max-width: calc(40vw);
  float: right;
`;
const NormalButtonUnlock = styled(Button)`
  font-size: 0.625rem;
  padding: 0.375rem 1.875rem 0.313rem 0.813rem;
  width: 5.938rem;
  margin: 0 0 0 0;
  > img {
    right: 0.188rem;
    height: 1.563rem;
    width: 1.563rem;
  }
`;

const EnlargedButtonUnlock = styled(NormalButtonUnlock)`
  font-size: 0.875rem;
  padding: 1.313rem 2.25rem 1.313rem 1.125rem;
  width: 8.75rem;
  > img {
    top: 1rem;
    right: 1.125rem;
  }
`;

const ButtonUnlock = withEnlargedProps(
  NormalButtonUnlock,
  EnlargedButtonUnlock
);

const NormalUnlockedText = styled.div`
  font-weight: 600;
  font-size: 0.625rem;
  color: #067c82;
  img {
    height: 1.125rem;
    width: 1.125rem;
  }
`;

const EnlargedUnlockedText = styled(NormalUnlockedText)`
  font-size: 0.875rem;
`;

const UnlockedText = withEnlargedProps(
  NormalUnlockedText,
  EnlargedUnlockedText
);

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
