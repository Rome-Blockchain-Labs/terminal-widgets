import { useDispatch, useSelector } from 'react-redux';

import { closeList, openList } from '../../redux/strategy/strategySlice';

export const ToolbarStrategyList = () => {
  const { isListOpened } = useSelector((state) => state?.velox?.strategy);

  const dispatch = useDispatch();
  const toggleStrategyList = () => {
    if (isListOpened) {
      dispatch(closeList());
    } else {
      dispatch(openList());
    }
  };

  return (
    <a href="javscript: void(0);" onClick={toggleStrategyList}>
      Strategy List
    </a>
  );
};
