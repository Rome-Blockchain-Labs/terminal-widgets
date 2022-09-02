import React from 'react';
import { Col, Row } from 'reactstrap';
import styled from 'styled-components';

import veloxLogo from '../assets/Velox-logo.svg';
import { WalletConnector } from './WalletConnector';

const StyledImg = styled.img`
  width: 200px;
  margin: 20px 0 0 0;
`;

const Header = () => {
  return (
    <Row>
      <Col lg={'6'}>
        <StyledImg alt="Velox Logo" id="veloxlogo" src={veloxLogo} />
      </Col>
      <Col lg={'6'}>
        <WalletConnector />
      </Col>
    </Row>
  );
};

export default Header;
