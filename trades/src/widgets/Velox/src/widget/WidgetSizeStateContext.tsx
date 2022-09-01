import React, { createContext, useContext } from 'react';

export enum WidgetEnlargementStatus {
  NONE,
  ENLARGED,
  FULLSCREEN,
}

export interface WidgetSizeState {
  enlargement?: WidgetEnlargementStatus;
  width?: number;
  height?: number;
  enlarged?: boolean;
}

export interface EnlargeableProps {
  enlarged?: boolean;
}

const defaultWidgetState: WidgetSizeState = {
  enlargement: WidgetEnlargementStatus.NONE,
};

const WidgetSizeStateContext = createContext(defaultWidgetState);

export default WidgetSizeStateContext;

export const useWidgetSizeState = () => {
  const context = useContext(WidgetSizeStateContext);
  const isEnlargeableWidth = (context.width || 0) > 768;
  const isEnlargedStatus =
    (context.enlargement || WidgetEnlargementStatus.NONE) > 0;

  context.enlarged = isEnlargeableWidth || isEnlargedStatus;

  return context;
};

export const withWidgetSizeStateContext = (WrappedComponent: any) => {
  return (props: any) => {
    const widgetSizeState: WidgetSizeState = useWidgetSizeState();

    return <WrappedComponent {...props} {...widgetSizeState} />;
  };
};

export const withEnlargedProps = (
  NormalSizeComponent: any,
  EnlargedSizeComponent?: any
) => {
  return React.forwardRef((props: any, ref) => {
    const widgetSizeState: WidgetSizeState = useWidgetSizeState();

    if (widgetSizeState.enlarged && EnlargedSizeComponent) {
      return (
        <EnlargedSizeComponent
          ref={ref}
          {...props}
          enlarged={widgetSizeState.enlarged}
        />
      );
    }

    return (
      <NormalSizeComponent
        ref={ref}
        {...props}
        enlarged={widgetSizeState.enlarged}
      />
    );
  });
};
