import { createContext, useContext } from 'react';

export interface WidgetSizeState {
  enlarged?: boolean;
  width?: number;
  height?: number;
}

const defaultWidgetState: WidgetSizeState = {
  enlarged: false,
};

const WidgetSizeStateContext = createContext(defaultWidgetState);

export default WidgetSizeStateContext;

export const useWidgetSizeState = () => {
  const context = useContext(WidgetSizeStateContext);

  if (context === undefined) {
    throw new Error(
      'useWidgetSizeState must be used within a useWidgetSizeState Provider'
    );
  }

  return context;
};

export const withWidgetSizeStateContext = (WrappedComponent: any) => {
  return (props: any) => {
    const widgetSizeState: WidgetSizeState = useWidgetSizeState();

    return <WrappedComponent {...props} {...{ widgetSizeState }} />;
  };
};
