import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'reactstrap';
import styled from 'styled-components';

import IconCloseXGreen from '../../assets/icons/icon-close-x-green.svg';
import IconWarning from '../../assets/v2/icon-warning.svg';
import { closeConfirmDeploymentErrorModal } from '../../redux/strategy/strategySlice';

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

const ConfirmDeploymentErrorModal = () => {
  const dispatch = useDispatch();
  const { confirmDeploymentErrorModalOpen } = useSelector(
    (state) => state?.velox?.strategy
  );

  const onCloseModal = () => dispatch(closeConfirmDeploymentErrorModal());

  return (
    <StyledModal
      centered={true}
      isOpen={confirmDeploymentErrorModalOpen}
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
          not deployed
        </h3>
      </div>

      <div style={{ margin: '25px', textAlign: 'center' }}>
        <img alt={'warning'} src={IconWarning} />
      </div>

      <div style={{ fontSize: '14px', textAlign: 'center' }}>
        Please retry to deploy your transaction again.
      </div>
    </StyledModal>
  );
};

export default ConfirmDeploymentErrorModal;
