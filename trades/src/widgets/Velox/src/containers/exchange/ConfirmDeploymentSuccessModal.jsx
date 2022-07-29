import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'reactstrap';
import styled from 'styled-components';

import IconCloseXGreen from '../../assets/icons/icon-close-x-green.svg';
import IconChecked from '../../assets/v2/icon-check.svg';
import { closeConfirmDeploymentSuccessModal } from '../../redux/strategy/strategySlice';

const StyledModal = styled(Modal)`
  > * {
    border-radius: 20px;
    border: 2px solid #067c82;
    background-color: #05595a;
    box-shadow: rgba(34, 178, 177, 0.5) 4px 0px 4px 0px,
      rgba(34, 178, 177, 0.5) 0px 4px 4px 0px;
    padding-bottom: 15px;
  }
  text-align: center;
  display: flex;
`;
const ConfirmDeploymentSuccessModal = () => {
  const dispatch = useDispatch();
  const { confirmDeploymentSuccessModalOpen } = useSelector(
    (state) => state?.velox?.strategy
  );

  const onCloseModal = () => dispatch(closeConfirmDeploymentSuccessModal());

  return (
    <StyledModal
      centered={true}
      isOpen={confirmDeploymentSuccessModalOpen}
      toggle={onCloseModal}
    >
      <div style={{ padding: '10px 10px 0 10px', textAlign: 'right' }}>
        <a href="/#" onClick={onCloseModal}>
          <img alt={'deploy'} src={IconCloseXGreen} width={15} />
        </a>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '19px', textTransform: 'uppercase' }}>
          Your transaction was
          <br />
          deployed successfully
        </h3>
      </div>

      <div style={{ margin: '25px', textAlign: 'center' }}>
        <img alt={'checked'} src={IconChecked} />
      </div>

      <div style={{ fontSize: '14px', textAlign: 'center' }}>
        The transaction has been added to your strategies table.
      </div>
    </StyledModal>
  );
};

export default ConfirmDeploymentSuccessModal;
