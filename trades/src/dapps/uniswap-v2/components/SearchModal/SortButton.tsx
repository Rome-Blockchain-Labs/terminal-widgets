import React from 'react';
import styled from 'styled-components';
import { theme } from 'twin.macro';

import { ArrowDownIcon, ArrowUpIcon } from '../../../../components/icons';
import { RowFixed } from '../../../../components/row';

export const FilterWrapper = styled(RowFixed)`
  padding: 8px;
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
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
      {ascending ? (
        <ArrowUpIcon color={theme`colors.yellow.400`} height={12} width={15} />
      ) : (
        <ArrowDownIcon
          color={theme`colors.yellow.400`}
          height={12}
          width={15}
        />
      )}
    </FilterWrapper>
  );
}
