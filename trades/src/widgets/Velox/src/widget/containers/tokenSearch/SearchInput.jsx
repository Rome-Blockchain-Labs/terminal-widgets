import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import {
  searchTokenPairs,
  setSearchText,
} from '../../../redux/tokenSearch/tokenSearchSlice';
import {
  startSelecting,
  stopSelecting,
  toggleSelecting,
} from '../../../redux/tokenSearch/tokenSearchSlice';
import magnifyingGlass from '../../assets/icons/icon-search.svg';
import { withEnlargedProps } from '../../WidgetSizeStateContext';

const NormalPairField = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  border-color: #067c82;
  border-style: solid;
  border-width: 0.125rem;
  border-radius: 1.875rem;
  background: #08333c;
  padding: 0.5rem 0.938rem;
  font-size: 0.625rem;
  color: #ffffff;
  font-family: 'Fira Code', monospace;
`;
const EnlargedPairField = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  border-color: #067c82;
  border-style: solid;
  border-width: 0.125rem;
  border-radius: 1.875rem;
  background: #08333c;
  padding: 1rem 1.8rem;
  font-size: 1.125rem;
  color: #ffffff;
  font-family: 'Fira Code', monospace;
`;
const PairField = withEnlargedProps(NormalPairField, EnlargedPairField);

const StyledInput = styled.input`
  width: 100%;
  border: none;
  background-color: inherit;
  color: #ffffff;
  outline: none;
  //width: auto;
`;

const NormalSearchIcon = styled.img`
  width: 1.563rem;
  cursor: pointer;
  float: right;
  position: absolute;
  right: 0.625rem;
  top: 0.188rem;
  @media only screen and (max-width: 61.875rem) {
    display: none;
  }
`;
const EnlargedSearchIcon = styled.img`
  width: 30px;
  cursor: pointer;
  float: right;
  position: absolute;
  right: 0.938rem;
  top: 0.938rem;
`;
const SearchIcon = withEnlargedProps(NormalSearchIcon, EnlargedSearchIcon);

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
      <SearchIcon
        alt={''}
        src={magnifyingGlass}
        onClick={() => dispatch(toggleSelecting())}
      />
    </PairField>
  );
};
export default SearchInput;
