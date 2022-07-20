import { FC, ReactElement } from 'react';
import { useMediaQuery } from 'react-responsive';

type MediaProps = {
  children: ReactElement;
};

const Desktop: FC<MediaProps> = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};
const Tablet: FC<MediaProps> = ({ children }) => {
  const isTablet = useMediaQuery({ maxWidth: 991, minWidth: 768 });
  return isTablet ? children : null;
};
const Mobile: FC<MediaProps> = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 1000 }); //todo revert back to 767 once a better solution is in place
  return isMobile ? children : null;
};
const Default: FC<MediaProps> = ({ children }) => {
  const isNotMobile = useMediaQuery({ minWidth: 1001 }); //todo revert back to 768 once a better solution is in place
  return isNotMobile ? children : null;
};

export { Default, Desktop, Mobile, Tablet };
