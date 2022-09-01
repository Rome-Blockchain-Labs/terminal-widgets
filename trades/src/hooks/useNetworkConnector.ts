const a = 1;
export default a;
// import { useContext, useMemo } from 'react';

// import { NetworkConnector } from '../connectors/NetworkConnector';
// import { getBlockExplorerUrlForChainId } from '../constants/networkExchange';
// import { DappContext } from '../contexts';

// export const useNetworkConnector = () => {
//   const { chainId } = useContext(DappContext);

//   const network = useMemo(
//     () =>
//       chainId
//         ? new NetworkConnector({
//             urls: {
//               [chainId]: getBlockExplorerUrlForChainId(chainId),
//             },
//           })
//         : undefined,
//     [chainId]
//   );

//   return network;
// };
