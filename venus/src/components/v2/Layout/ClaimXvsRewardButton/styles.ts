import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    button: css`
      border-color: ${theme.palette.background.paper};

      > span {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
      }

      ${theme.breakpoints.down('sm')} {
        padding: ${theme.spacing(3)}
      }
    `,
    icon: css`
      margin-right: ${theme.spacing(2)};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
    `,
    modalTitle: css`
      display: flex;
      align-items: center;
    `,
    modalBody: css`
      font-size: 1.5rem;
    `,
  };
};
