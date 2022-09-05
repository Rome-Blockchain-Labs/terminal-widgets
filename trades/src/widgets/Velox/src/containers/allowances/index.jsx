import { useSelector } from 'react-redux';

import Actions from './actions';
import Tokens from './tokens';

const Allowances = () => {
  const { connection } = useSelector((state) => state?.velox?.wallet);
  const { isLoading, selectedPair } = useSelector(
    (state) => state?.velox?.tokenSearch
  );

  const { connected } = connection;

  if (!connected || isLoading || !selectedPair) {
    return null;
  }

  return (
    <>
      <Tokens />
      <Actions />
    </>
  );
};

export default Allowances;
