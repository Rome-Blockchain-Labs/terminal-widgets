/** @jsxImportSource @emotion/react */
import React from 'react';
import { useHistory } from 'react-router-dom';

import { Icon } from 'components/v2/Icon';
import { SecondaryButton } from 'components/v2/Button';
import { useStyles } from './styles';

const BackButton: React.FC = ({ children }) => {
  const styles = useStyles();
  const history = useHistory();

  return (
    <SecondaryButton onClick={() => history.goBack()} css={styles.container} small>
      <Icon name="chevronLeft" css={styles.icon} />

      {children}
    </SecondaryButton>
  );
};

export default BackButton;
