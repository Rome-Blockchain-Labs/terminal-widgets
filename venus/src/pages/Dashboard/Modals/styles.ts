import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      margin-top: ${theme.spacing(3)};
    `,
    input: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    greyLabel: css`
      color: ${theme.palette.text.secondary};
    `,
    whiteLabel: css`
      color: ${theme.palette.text.primary};
    `,
    totalAndLimit: css`
      display: flex;
      justify-content: space-between;
    `,
    getRow: ({ isLast }: { isLast: boolean }) => css`
      margin-bottom: ${theme.spacing(isLast ? 3 : 1.5)};

      ${theme.breakpoints.down('md')} {
        span {
          font-size: 0.875rem;
        }
      }
    `,
    bottomRow: css`
      margin-bottom: ${theme.spacing(12)};

      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(8)};
      }
    `,
    tabs: css`
      padding: 1px;
      border: 1px solid ${theme.palette.secondary.light};
      border-radius: 10px;
      margin-bottom: 0;
      width: 80%;
      margin: 0 auto;
    `,
  };
};
