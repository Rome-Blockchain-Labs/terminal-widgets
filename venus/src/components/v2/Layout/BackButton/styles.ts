import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    container: css`
      border: none;
      display: flex;
      position: relative;
      ${theme.breakpoints.down('sm')} {
        margin-bottom: ${theme.spacing(2)};
      }
    `,
    icon: css`
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      color: ${theme.palette.text.primary};
    `,
    close: css`
      position: absolute;
      right: ${theme.spacing(3)};
    `,
  };
};
