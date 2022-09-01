import { shallow } from 'enzyme';

import { PortfolioPage } from '../PortfolioPage';

describe('PortfolioPage component render', () => {
  it('PortfolioPage snapshot added', () => {
    const component = shallow(<PortfolioPage />);
    expect(component).toMatchSnapshot();
  });
});
