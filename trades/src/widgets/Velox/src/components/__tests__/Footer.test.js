import { shallow } from 'enzyme';

import { Footer } from '../Footer';

describe('Footer component render', () => {
  it('Footer snapshot added', () => {
    const component = shallow(<Footer />);
    expect(component).toMatchSnapshot();
  });
});
