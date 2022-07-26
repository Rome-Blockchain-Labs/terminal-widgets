import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Col } from 'reactstrap';

import { WidgetSizeState } from '../WidgetSizeStateContext';
import { GlobalStyle } from './src/assets/styled';
import Banner from './src/components/Banner.jsx';
import { Footer } from './src/components/Footer';
import Header from './src/components/Header';
import HomePage from './src/components/HomePage';
import { enableVeloxWidgetMode, enableVeloxWidgetTest } from './src/config';
import Toasts from './src/containers/userFeedback/Toasts';
import VeloxWidget from './src/widget';
import VeloxTestWidget from './src/widget/VeloxTestWidget';

function VeloxApp() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Banner>
        <Col className={'container'}>
          <Header />
          <Switch>
            <Route exact path="/" render={() => <HomePage />} />
            <Route exact path="/:tokenAddress" render={() => <HomePage />} />
          </Switch>
        </Col>
        <Footer />
      </Banner>
      <Toasts />
    </BrowserRouter>
  );
}

function App(props: WidgetSizeState) {
  if (enableVeloxWidgetMode) {
    if (enableVeloxWidgetTest) {
      return (
        <BrowserRouter>
          <VeloxTestWidget />
        </BrowserRouter>
      );
    }

    return (
      <BrowserRouter>
        <VeloxWidget {...props} />
      </BrowserRouter>
    );
  }

  return <VeloxApp />;
}

export default App;
