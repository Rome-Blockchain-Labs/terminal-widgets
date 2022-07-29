import { createSlice } from '@reduxjs/toolkit';

import { STEP1, STEP2, STEP3, STEP4 } from '../../constants';

export const strategyConfigSlice = createSlice({
  initialState: {
    completedStep1: false,
    completedStep2: false,
    completedStep3: false,
    completedStep4: false,
    currentStep: '',
    readyStep1: true,
    readyStep2: false,
    readyStep3: false,
    readyStep4: false,
  },
  name: 'strategyConfig',
  reducers: {
    completeStep1: (state, action: any) => {
      state.completedStep1 = action.payload;
      state.readyStep2 = state.completedStep1;

      if (!state.readyStep2) {
        state.readyStep3 = false;
        state.readyStep4 = false;
      }
    },
    completeStep2: (state, action: any) => {
      state.completedStep2 = action.payload;
      state.readyStep3 = state.completedStep2;
    },
    completeStep3: (state, action: any) => {
      state.completedStep3 = action.payload;
      state.readyStep4 = state.completedStep3;
    },
    completeStep4: (state, action: any) => {
      state.completedStep4 = action.payload;
    },
    setCurrentStep: (state, action: any) => {
      state.currentStep = action.payload;
    },
  },
});

export const {
  completeStep1,
  completeStep2,
  completeStep3,
  completeStep4,
  setCurrentStep,
} = strategyConfigSlice.actions;
export default strategyConfigSlice.reducer;

interface StepStatus {
  prevStep?: string;
  nextStep?: string;
  ready: boolean;
}
interface StepStatusMap {
  [key: string]: StepStatus;
}

export const buildStepStatusMap = (strategyConfigState: any): StepStatusMap => {
  return {
    [STEP1]: {
      nextStep: STEP2,
      ready: true,
    },
    [STEP2]: {
      nextStep: STEP3,
      prevStep: STEP1,
      ready: strategyConfigState.readyStep2,
    },
    [STEP3]: {
      nextStep: STEP4,
      prevStep: STEP2,
      ready: strategyConfigState.readyStep3,
    },
    [STEP4]: {
      prevStep: STEP3,
      ready: strategyConfigState.readyStep4,
    },
  };
};
