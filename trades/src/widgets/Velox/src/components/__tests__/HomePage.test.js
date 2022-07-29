import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import allReducers, { mainScreenReducer } from '../../store/reducers';
import {
  initialCombinedAllStates,
  initialMainScreenState,
} from '../../store/state';
import { HomePage } from '../HomePage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    pathname: '/',
  }),
}));

describe('HomePage component render', () => {
  // const mockStore = createStore(mainScreenReducer, initialMainScreenState);
  const mockStore = createStore(allReducers, initialCombinedAllStates);

  const getWrapper = () =>
    shallow(
      <Provider store={mockStore}>
        <HomePage />
      </Provider>
    );

  const wrapper = getWrapper();

  it('HomePage snapshot added', () => {
    expect(wrapper).toMatchSnapshot();
  });

  //   it('HomePage wrapper test', () => {
  //     expect(wrapper.find('auth')).toEqual(1);
  //   });
});
