import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { convertEthToWETH } from '../../../../redux/wallet/walletSlice';
import IconWrap from '../../../assets/icons/icon-wrap.svg';
import { BorderedTable, Button } from '../../../assets/styled';
import { withEnlargedProps } from '../../../WidgetSizeStateContext';
import useProvider from '../../ethereum/use-provider';
import UncontrolledModal from '../UncontrolledModal';
import EthBal from './EthBal';

const NormalButtonNormal = styled(Button)`
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

const EnlargedButtonNormal = styled(NormalButtonNormal)`
  font-size: 0.875rem;
  padding: 1.313rem 2.25rem 1.313rem 1.125rem;
  width: 8.75rem;
  > img {
    top: 1rem;
    right: 1.125rem;
  }
`;

const ButtonNormal = withEnlargedProps(
  NormalButtonNormal,
  EnlargedButtonNormal
);

const StyledTable = styled(BorderedTable)`
  td {
    padding: 24px 0;
  }
`;

const Actions = () => {
  const dispatch = useDispatch();
  const { provider } = useProvider();
  const chainHex = useSelector(
    (state) => state?.velox?.wallet.connection.chainHex
  );
  const onConvertClicked = (amount) => {
    dispatch(convertEthToWETH({ amountInEther: amount, provider }));
  };
  const nativeTokenName = chainHex === '0xa86a' ? 'Avalanche' : 'Ethereum'; //todo abstract this

  return (
    <StyledTable>
      <tbody>
        <tr>
          <td>
            <UncontrolledModal
              buttonLabel={'Wrap'}
              renderButton={() => (
                <ButtonNormal id={'wrapEthBtn'}>
                  WRAP
                  <img alt={'wrap'} src={IconWrap} width={30} />
                </ButtonNormal>
              )}
              title={`Wrap ${nativeTokenName} into an ERC20`}
              onButtonPush={onConvertClicked}
            />
          </td>
          <td>
            <EthBal />
          </td>
        </tr>
      </tbody>
    </StyledTable>
  );
};

export default Actions;
