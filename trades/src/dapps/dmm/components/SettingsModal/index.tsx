import tw, { theme } from 'twin.macro';

import { CloseButton } from '../../../../components/buttons';
import { ModalWrapper } from '../../../../components/modals';
import { ApplicationModal } from '../../state/application/actions';
import {
  useModalOpen,
  useToggleTransactionSettingsMenu,
} from '../../state/application/hooks';
import {
  useUserSlippageTolerance,
  useUserTransactionTTL,
} from '../../state/user/hooks';
import TransactionSettings from '../TransactionSettings/RTSettings';

const HeaderRow = tw.div`flex justify-between items-center py-4 text-yellow-400 text-lg border-b-2 border-gray-400`;

export default function SettingsModal() {
  const open = useModalOpen(ApplicationModal.SETTINGS);
  const toggle = useToggleTransactionSettingsMenu();

  const [userSlippageTolerance, setUserslippageTolerance] =
    useUserSlippageTolerance();

  const [deadline, setDeadline] = useUserTransactionTTL();

  return (
    <ModalWrapper noPadding isOpen={open} onDismiss={toggle}>
      <div tw="w-full bg-green-700 px-4 rounded-lg">
        <div>
          <HeaderRow>
            <span tw="text-xl text-green-400">TRANSACTION SETTINGS</span>
            <CloseButton
              color={theme`colors.green.400`}
              height={10}
              width={10}
              onClick={toggle}
            />
          </HeaderRow>
        </div>

        <div tw="py-4">
          <TransactionSettings
            deadline={deadline}
            rawSlippage={userSlippageTolerance}
            setDeadline={setDeadline}
            setRawSlippage={setUserslippageTolerance}
          />
        </div>
      </div>
    </ModalWrapper>
  );
}
