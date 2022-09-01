import App from './pages/App';
import ApplicationUpdater from './state/application/updater';
import ListsUpdater from './state/lists/updater';
import MulticallUpdater from './state/multicall/updater';
import TransactionUpdater from './state/transactions/updater';
import UserUpdater from './state/user/updater';

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  );
}

const ReactApp = () => {
  return (
    <>
      <Updaters />
      <App />
    </>
  );
};

export default ReactApp;
