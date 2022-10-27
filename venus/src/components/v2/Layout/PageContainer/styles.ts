import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    main: css`
      flex-grow: 1;
      padding: ${theme.spacing(4)} ${theme.spacing(4)};

      ${theme.breakpoints.down('md')} {
        padding: ${theme.spacing(2)} ${theme.spacing(2)};
      }
    `,
    content: css`
      max-width: 1000px;
      margin: 0 auto;
    `,
    footer: css`
      position: fixed;
      bottom: 0;
      right: 0;
      width: calc(100% - ${theme.shape.drawerWidthDesktop});
      ${theme.breakpoints.down('lg')} {
        width: calc(100% - ${theme.shape.drawerWidthTablet});
      }

      ${theme.breakpoints.down('md')} {
        width: 100%;
      }
    `,
  };
};
