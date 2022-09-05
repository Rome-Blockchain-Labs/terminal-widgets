import styled from 'styled-components';

import useTokenQuota from '../../../../redux/quotas/useTokenQuota';
import { trim } from '../../../../utils/trimString';
import IconWarning from '../../../assets/icons/icon-warning.svg';
import { SmallError, SmallSpinner } from '../../../components/Icons';
import { PinkTooltip } from '../../../components/Icons';
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

const QuotaWithWarning = (props) => {
  const { field, minThreshold = 0, token } = props;
  const asyncValue = useTokenQuota(token.id, field);
  if (!asyncValue || asyncValue?.loading) return <SmallSpinner />;
  if (asyncValue?.error) return <SmallError />;
  if (Number(asyncValue.value) < Number(minThreshold)) {
    return (
      <MaxWidth>
        {trim(asyncValue.value)}
        <sup>
          <PinkTooltip title={`Increase your allowance to ${minThreshold}`}>
            <img alt={'IconWarning'} src={IconWarning} width={17} />
          </PinkTooltip>
        </sup>
      </MaxWidth>
    );
  }
  return <MaxWidth>{trim(asyncValue.value)}</MaxWidth>;
};
export default QuotaWithWarning;
