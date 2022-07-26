import { useDispatch, useSelector } from 'react-redux';

import { closeConfirmDeploymentSuccessModal } from '../../../redux/strategy/strategySlice';
import IconCloseXGreen from '../../assets/icons/icon-close-x-green.svg';
import { StyledModal } from '../../assets/styled';
import IconChecked from '../../assets/v2/icon-check.svg';

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
      <div style={{ textAlign: 'right' }}>
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
