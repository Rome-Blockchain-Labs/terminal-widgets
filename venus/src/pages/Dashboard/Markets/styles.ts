import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    desktopViewContainer: css`
      ${theme.breakpoints.down('lg')} {
        display: none;
      }
    `,
    tabletViewContainer: css`
      display: none;
      padding: 0;
      border-radius: 10px;

      ${theme.breakpoints.down('lg')} {
        display: block;
      }

      ${theme.breakpoints.down('sm')} {
        display: none;
      }
    `,
    mobileViewContainer: css`
      display: none;
      background-color: transparent;
      padding: 0;
      border-radius: 10px;

      ${theme.breakpoints.down('sm')} {
        display: block;
      }
    `,
    market: css`
      padding-top: 0;
    `,
    tabsHeader: css`
      padding-left: ${theme.spacing(6)};
      padding-right: ${theme.spacing(6)};
      padding-top: ${theme.spacing(6)};

      ${theme.breakpoints.down('xl')} {
        padding-top: ${theme.spacing(6)};
      }

      ${theme.breakpoints.down('sm')} {
        padding-left: 0;
        padding-right: 0;
        margin-bottom: 0;
      }
    `,
    tabsTitle: css`
      text-align: center;
    `,
    tableContainer: css`
      width: 100%;
      padding: 0;
      border-radius: 10px;

      ${theme.breakpoints.down('sm')} {
        background-color: ${theme.palette.background.paper};
        border-radius: 0;
      }
    `,
    delimiter: css`
      margin: ${theme.spacing(3)};

      ${theme.breakpoints.down('sm')} {
        display: none;
      }
    `,
    balance: css`
      display: flex;
      flex-direction: column;

      > :first-of-type {
        color: ${theme.palette.text.primary};
      }
    `,
    percentOfLimit: css`
      display: flex;
      align-items: center;
      overflow: hidden;

      > :first-of-type {
        margin-right: ${theme.spacing(2)};
      }
    `,
    percentOfLimitProgressBar: css`
      width: ${theme.spacing(13)};
    `,
    white: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
