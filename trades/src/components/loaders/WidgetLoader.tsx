import { FC } from 'react';
import Lottie from 'react-lottie-player';

import loaderJson from '../../assets/lottie/loader.json';

type WidgetLoaderProps = {
  width?: number;
  height?: number;
};

export const WidgetLoader: FC<WidgetLoaderProps> = ({
  height = 150,
  width = 150,
}) => {
  return (
    <Lottie loop play animationData={loaderJson} style={{ height, width }} />
  );
};
