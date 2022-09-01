import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import magnifyingGlass from '../../assets/icons/icon-search.svg';
import {
  searchTokenPairs,
  setSearchText,
} from '../../redux/tokenSearch/tokenSearchSlice';
import {
  startSelecting,
  stopSelecting,
  toggleSelecting,
} from '../../redux/tokenSearch/tokenSearchSlice';

const PairField = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  border-color: #067c82;
  border-style: solid;
  border-width: 2px;
  border-radius: 30px;
  background: #08333c;
  padding: 11px 15px;
  font-size: 15px;
  color: #ffffff;
  font-family: 'Fira Code', monospace;

  @media only screen and (max-width: 990px) {
    width: 100%;
  }

  @media only screen and (max-width: 769px) {
    width: 100%;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  border: none;
  background-color: inherit;
  color: #ffffff;
  //width: auto;
`;

const HideOnSmallScreen = styled.img`
  width: 30px;
  cursor: pointer;
  float: right;
  position: absolute;
  right: 22px;
  top: 9px;
  @media only screen and (max-width: 990px) {
    display: none;
  }
`;

const combinePairText = (pair) => {
  if (pair.token0?.symbol && pair.token1?.symbol && pair.id) {
    const miniAddress = pair.id.slice(0, 8) + '...' + pair.id.slice(-8);
    return pair.token0?.symbol + '/' + pair.token1?.symbol + '/' + miniAddress;
  }
  return '';
};

const SearchInput = () => {
  const dispatch = useDispatch();
  const searchText = useSelector(
    (state) => state?.velox?.tokenSearch?.searchText
  );
  const isSelecting = useSelector(
    (state) => state?.velox?.tokenSearch?.isSelecting
  );
  // const isLoading = useSelector((state) => state?.velox?.tokenSearch.isLoading);
  const fetchError = useSelector(
    (state) => state?.velox?.tokenSearch.fetchError
  );
  const selectedPair = useSelector(
    (state) => state?.velox?.tokenSearch?.selectedPair
  );
  const selectedPairText = selectedPair && combinePairText(selectedPair);

  const onChange = (e) => {
    const newInputText = e.target.value;
    dispatch(searchTokenPairs(newInputText));
    dispatch(setSearchText(newInputText));
  };
  const onClick = () => dispatch(startSelecting());
  const onKeyDown = (e) => e.code === 'Escape' && dispatch(stopSelecting());

  //todo throw to a global error boundary
  if (fetchError) {
    return (
      <PairField>
        <StyledInput
          autocomplete={'off'}
          style={{ color: 'red' }}
          value={'Something went wrong..'}
          onChange={() => {}}
        />
      </PairField>
    );
  }

  let value;
  if (isSelecting) {
    value = searchText;
  } else {
    value = selectedPairText || 'Select a token pair..';
  }

  return (
    <PairField onClick={onClick}>
      <StyledInput
        autocomplete={'off'}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <HideOnSmallScreen
        alt={''}
        src={magnifyingGlass}
        onClick={() => dispatch(toggleSelecting())}
      />
    </PairField>
  );
};
export default SearchInput;
