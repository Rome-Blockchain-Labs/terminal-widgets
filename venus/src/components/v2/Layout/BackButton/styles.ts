import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      border: none;
    `,
    icon: css`
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      color: ${theme.palette.text.primary};
    `,
  };
};
