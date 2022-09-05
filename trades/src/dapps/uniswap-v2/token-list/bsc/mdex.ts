const MDEX_DEAULT = `https://bsc.mdex.com/tokenlist.json?t=${new Date().getTime()}`;

const MDEX_DEFAULT_PROXY =
  'https://us-central1-rometerminal-319319.cloudfunctions.net/proxyTokenlist/mdex';
export const MDEX_DEFAULT_TOKEN_LIST_OF_LISTS: string[] = [
  MDEX_DEAULT,
  MDEX_DEFAULT_PROXY,
];

export default MDEX_DEFAULT_TOKEN_LIST_OF_LISTS;
