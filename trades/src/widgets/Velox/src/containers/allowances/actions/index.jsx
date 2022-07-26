import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import IconWrap from '../../../assets/icons/icon-wrap.svg';
import { BorderedTable, Button } from '../../../assets/styled';
import { convertEthToWETH } from '../../../redux/wallet/walletSlice';
import { detailsByChain } from '../../../utils/network-mapping';
import useProvider from '../../ethereum/use-provider';
import UncontrolledModal from '../UncontrolledModal';
import EthBal from './EthBal';

export const ButtonNormal = styled(Button)`
  font-size: 12px;
  margin: 0 0 0 0;
  padding: 0 0 0 12px;
  width: 100px;
  height: 30px;
  img {
    width: 18px;
    margin: 5px;
    padding: 0;
  }
`;

export const ButtonLargeDisabled = styled(Button)`
  font-size: 12px;
  width: 110px;
  margin: 0 0 0 0;
  padding: 0 0 0 12px;
  height: 50px;
  float: right;
  img {
    margin: 9px 1px;
    padding: 0;
  }
  background: #08333c;
  color: #067c82;
  box-shadow: 0 0 0 2pt #067c82;
  border-radius: 100px;
  cursor: not-allowed !important;
  :hover {
    background: #08333c;
  }
`;

const StyledTable = styled(BorderedTable)`
  td {
    padding: 15px 0;
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
  const nativeTokenName = detailsByChain(chainHex).nativeTokenName;

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
