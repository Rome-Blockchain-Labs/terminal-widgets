/**
 * Given a name or address, does a lookup to resolve to an address and name
 * @param nameOrAddress ENS name or address
 */
export default function useENS(nameOrAddress?: string | null): {
  loading: boolean;
  address: string | null;
  name: string | null;
} {
  /**
   * This is currently not used
   * It can be used in a wallet connection functionality
   *  this is done on the RT level
   * It can be used in expert mode to set where funds of a swap are sent to
   *  expert mode is not enabled for our widget
   *  ----
   *  The code is set up to be fault tolerant to this returning null
   *  But it doesn't handle nil ENS input on new networks
   *  **/
  return {
    address: null,
    loading: false,
    name: null,
  };
}
