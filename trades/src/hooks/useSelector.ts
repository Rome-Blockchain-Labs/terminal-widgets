import { useSelector as useDefaultSelector } from 'react-redux';

import { AppState } from '../store';

export const useSelector = <TState = AppState, TSelected = unknown>(
  selector: (state: TState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected => {
  return useDefaultSelector<TState, TSelected>(selector, equalityFn);
};
