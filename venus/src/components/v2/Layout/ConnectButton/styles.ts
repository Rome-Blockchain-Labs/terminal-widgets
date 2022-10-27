import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    button: css`
      ${theme.breakpoints.down('sm')} {
        padding: ${theme.spacing(3)}
      }
    `,
    icon: css`
      margin-right: ${theme.spacing(2)};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
    `,
  };
};
