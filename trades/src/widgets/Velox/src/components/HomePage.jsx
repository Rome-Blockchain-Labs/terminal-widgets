import { Col, Row } from 'reactstrap';

import withHeaderAndSigner from '../containers/ethereum/with-provider';
import StrategyList from '../containers/strategies';
import StrategyConfig from './StrategyConfig';

const HomePage = () => {
  return (
    <Row>
      <Col lg={'12'}>
        <StrategyConfig />
        <StrategyList />
      </Col>
    </Row>
  );
};

export default withHeaderAndSigner(HomePage);
