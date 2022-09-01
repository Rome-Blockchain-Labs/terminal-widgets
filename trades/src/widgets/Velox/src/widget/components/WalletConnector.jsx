import { firstAndLast } from '../../utils/firstAndLast';
import { useWeb3Provider } from '../../utils/web3';
export const WalletConnector = () => {
  const { account, activate, active, deactivate } = useWeb3Provider();
  const miniAddress = firstAndLast(account);

  return (
    <a href="javscript: void(0);" onClick={active ? deactivate : activate}>
      Connect Wallet {miniAddress}
    </a>
  );
};
