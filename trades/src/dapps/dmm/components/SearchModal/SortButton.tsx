import React from 'react';
import { Text } from 'rebass';
import styled from 'styled-components';
import tw from 'twin.macro';

import { RowFixed } from '../Row';

export const FilterWrapper = styled(RowFixed)`
  border-radius: 8px;
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
  ${tw`px-2`}
`;

export default function SortButton({
  ascending,
  toggleSortOrder,
}: {
  toggleSortOrder: () => void;
  ascending: boolean;
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder}>
      <Text fontSize={14} fontWeight={500}>
        {ascending ? '↑' : '↓'}
      </Text>
    </FilterWrapper>
  );
}
