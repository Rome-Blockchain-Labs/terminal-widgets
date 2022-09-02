import { useDispatch as useDefaultDispatch } from 'react-redux';

import { AppDispatch } from '../store';

export const useDispatch = () => useDefaultDispatch<AppDispatch>();
