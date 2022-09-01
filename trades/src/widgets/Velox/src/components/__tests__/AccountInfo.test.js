import { shallow } from 'enzyme';

import { AccountInfo } from '../AccountInfo';

describe('AccountInfo component render', () => {
  it('AccountInfo snapshot added', () => {
    const component = shallow(<AccountInfo />);
    expect(component).toMatchSnapshot();
  });
});
