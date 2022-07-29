import tw from 'twin.macro';

import { CloseButton } from '../../../../components/buttons';
import { ModalWrapper } from '../../../../components/modals';
import {
  useSettingsModalOpen,
  useSettingsModalToggle,
} from '../../state/application/hooks';
import {
  useUserDeadline,
  useUserSlippageTolerance,
} from '../../state/user/hooks';
import TransactionSettings from '../TransactionSettings';

const HeaderRow = tw.div`flex justify-between items-center py-4 text-yellow-400 text-lg border-b-2 border-gray-400`;

export default function SettingsModal() {
  const open = useSettingsModalOpen();
  const toggle = useSettingsModalToggle();

  const [userSlippageTolerance, setUserslippageTolerance] =
    useUserSlippageTolerance();

  const [deadline, setDeadline] = useUserDeadline();

  return (
    <ModalWrapper isOpen={open} onDismiss={toggle}>
      <div tw="w-full">
        <div>
          <HeaderRow>
            <span tw="text-xl">TRANSACTION SETTINGS</span>
            <CloseButton height={10} width={10} onClick={toggle} />
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
