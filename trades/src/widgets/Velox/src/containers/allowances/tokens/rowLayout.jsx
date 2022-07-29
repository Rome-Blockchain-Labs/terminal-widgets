import React from 'react';

import { NumFont } from '../../../assets/styled';

export const TableHeaders = () => {
  return (
    <thead>
      <tr>
        <th>TOKEN</th>
        <th>BALANCE</th>
        <th>ALLOWANCE</th>
      </tr>
    </thead>
  );
};

const RowLayout = (props) => {
  const { col1, col2, col3 } = props;
  return (
    <tr>
      <td>{col1}</td>
      <td>
        <NumFont>{col2}</NumFont>
      </td>
      <td>{col3}</td>
    </tr>
  );
};

export default RowLayout;
