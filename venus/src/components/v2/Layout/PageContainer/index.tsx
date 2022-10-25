/** @jsxImportSource @emotion/react */
import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { useStyles } from './styles';

interface IPageContainerProps {
  children: ReactNode;
}

export const PageContainer = ({ children }: IPageContainerProps) => {
  const styles = useStyles();
  return (
    <Box component="main" css={styles.main}>
      <Box css={styles.content}>
        {children}
      </Box>
    </Box>
  );
};
