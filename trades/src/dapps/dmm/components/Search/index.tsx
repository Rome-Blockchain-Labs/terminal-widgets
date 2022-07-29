import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

import SearchIcon from '../Icons/Search';

const Container = styled.div`
  z-index: 30;
  position: relative;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 12px;
  border-radius: 4px;

  z-index: 9999;
  width: 100%;
  min-width: 300px;
  box-sizing: border-box;
  @media screen and (max-width: 500px) {
    box-shadow: none;
  }
`;
const Input = styled.input`
  ${tw`text-xl`}
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  width: 100%;

  ::placeholder {
    font-size: 12px;
  }
`;

interface SearchProps {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  placeholder?: string;
}

export const Search = ({
  placeholder,
  searchValue,
  setSearchValue,
}: SearchProps) => {
  return (
    <Container tw="border border-gray-300 rounded-xl">
      <Wrapper>
        <Input
          placeholder={placeholder || 'Search by pool address'}
          type="text"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
        <SearchIcon />
      </Wrapper>
    </Container>
  );
};

export default Search;
