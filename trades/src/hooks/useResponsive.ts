import { useMediaQuery } from 'react-responsive';
import { theme } from 'twin.macro';

export const useIsMobile = () => {
  return useMediaQuery({
    maxWidth: theme`screens.md`,
  });
};

export const useIs2xlScreen = () => {
  return useMediaQuery({
    minWidth: theme`screens.2xl`,
  });
};

export const useIsXlScreen = () => {
  return useMediaQuery({
    minWidth: theme`screens.xl`,
  });
};

export const useIsLgScreen = () => {
  return useMediaQuery({
    minWidth: theme`screens.lg`,
  });
};
