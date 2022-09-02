import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import {
  fetchAndSetTokenPair,
  searchTokenPairs,
  stopSelecting,
} from '../../redux/tokenSearch/tokenSearchSlice';
import useProvider from '../ethereum/use-provider';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export const TokenSearch = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state?.velox?.tokenSearch.isLoading);
  const isSelecting = useSelector(
    (state) => state?.velox?.tokenSearch.isSelecting
  );
  const { connected } = useSelector((state) => state?.velox?.wallet.connection);
  const { active, provider } = useProvider();
  const searchRef = useRef();
  const pairAddress = useQuery().get('pairAddress');
  const history = useHistory();

  useEffect(() => {
    dispatch(searchTokenPairs(''));
  }, [dispatch]);

  useEffect(() => {
    //ei http://localhost:3002/?pairAddress=0xd3d2e2692501a5c9ca623199d38826e513033a17
    if (pairAddress && connected && active) {
      history.push('/');
      dispatch(fetchAndSetTokenPair({ pairAddress, provider }));
    }
  }, [history, pairAddress, connected, active, dispatch, provider]);
  useEffect(() => {
    window.onclick = (e) => {
      if (!searchRef?.current?.contains(e.target)) {
        dispatch(stopSelecting());
      }
    };
  }, [dispatch]);

  // return <input className={"no-outline"} id={"pair-field"} placeholder={"Search"}/>

  return (
    <div ref={searchRef}>
      <SearchInput />
      {isSelecting && <SearchResult loading={isLoading} />}
    </div>
  );
};

export default TokenSearch;
