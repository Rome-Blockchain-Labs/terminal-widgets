import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    firstRow: css`
      display: flex;

      @media only screen and (max-width: 650px) {
        flex-direction: column-reverse;
      }
    `,
    graphsColumn: css`
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-width: 0;
      min-height: 0;
      margin-bottom: ${theme.spacing(1)};
    `,
    infoColumn: css`
      border-radius: 10px;
      padding: ${theme.spacing(3)};
      margin-left: ${theme.spacing(1)};
      margin-bottom: ${theme.spacing(1)};
      min-width: 0;
      min-height: 0;

      @media only screen and (max-width: 650px) {
        width: 100%;
        margin-left: 0;
      }
    `,
    graphCard: css`
      border-radius: 10px;
      padding: ${theme.spacing(3)};

      :not(:last-of-type) {
        margin-bottom: ${theme.spacing(1)};
      }
    `,
    legendColors: {
      supplyApy: theme.palette.interactive.success,
      borrowApy: theme.palette.interactive.error,
      utilizationRate: theme.palette.interactive.primary,
    },
    apyChart: css`
      margin-right: ${theme.spacing(-2.5)};
    `,
  };
};
