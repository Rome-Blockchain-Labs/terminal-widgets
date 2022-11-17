/** @jsxImportSource @emotion/react */
import React from 'react';
import { useHistory } from 'react-router-dom';

import { Icon } from 'components/v2/Icon';
import { SecondaryButton } from 'components/v2/Button';
import { useStyles } from './styles';
import { useIsSmDown } from '../../../../hooks/responsive';

export interface IBackButton {
  className?: string;
}

const BackButton: React.FC<IBackButton> = ({ children, className }) => {
  const styles = useStyles();
  const history = useHistory();
  const isSmDown = useIsSmDown();

  return (
    <SecondaryButton
      onClick={() => history.back()}
      className={className}
      css={styles.container}
      fullWidth={isSmDown}
    >
      {!isSmDown && <Icon name="chevronLeft" css={styles.icon} />}

      {children}

      {isSmDown && <Icon css={styles.close} name="close" />}
    </SecondaryButton>
  );
};

export default BackButton;
