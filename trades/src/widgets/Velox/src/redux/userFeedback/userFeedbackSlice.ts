import { createSlice } from '@reduxjs/toolkit';

export const userFeedbackSlice = createSlice({
  initialState: {
    errorToastMessage: '',
    errorToastOpen: false,
    successToastMessage: '',
    successToastOpen: false,
  },
  name: 'userFeedback',
  reducers: {
    toastClearError: (state: any) => {
      state.errorToastOpen = false;
      state.errorToastMessage = '';
    },
    toastClearSuccess: (state: any) => {
      state.successToastOpen = false;
      state.successToastMessage = '';
    },
    toastError: (state, action: any) => {
      state.errorToastOpen = true;
      state.errorToastMessage = action.payload;
    },
    toastSuccess: (state, action: any) => {
      state.successToastOpen = true;
      state.successToastMessage = action.payload;
    },
  },
});

export const { toastClearError, toastClearSuccess, toastError, toastSuccess } =
  userFeedbackSlice.actions;
export default userFeedbackSlice.reducer;
