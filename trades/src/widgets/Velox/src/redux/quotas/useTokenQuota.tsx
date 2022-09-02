import { useSelector } from 'react-redux';

import { AsyncNumber } from '../../model/store/quotas';

function useTokenQuota(tokenAddress: string, field: string) {
  // @ts-ignore
  const asyncField: AsyncNumber | undefined = useSelector<any>(
    (state) => state?.velox?.quotas[tokenAddress]?.[field]
  );
  return asyncField;
}

export default useTokenQuota;
