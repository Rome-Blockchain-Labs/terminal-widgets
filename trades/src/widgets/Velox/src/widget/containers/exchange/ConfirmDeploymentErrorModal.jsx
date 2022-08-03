import { useDispatch, useSelector } from 'react-redux';

import { closeConfirmDeploymentErrorModal } from '../../../redux/strategy/strategySlice';
import IconCloseXGreen from '../../assets/icons/icon-close-x-green.svg';
import { StyledModal } from '../../assets/styled';
import IconWarning from '../../assets/v2/icon-warning.svg';

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
      <div style={{ textAlign: 'right' }}>
        <button onClick={onCloseModal}>
          <img alt={'deploy'} src={IconCloseXGreen} width={15} />
        </button>
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
