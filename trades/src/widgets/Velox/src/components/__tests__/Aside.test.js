import { shallow } from 'enzyme';

import { Aside } from '../Aside';

describe('Aside component render', () => {
  it('Aside snapshot added', () => {
    const component = shallow(<Aside />);
    expect(component).toMatchSnapshot();
  });
});
