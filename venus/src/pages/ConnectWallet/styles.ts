import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    root: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #010101;
    `,
    logo: css`
      width: 50%;

      ${theme.breakpoints.up('lg')} {
        width: 33%;
      }
    `,
    divider: css`
      margin: ${theme.spacing(2, 4)};

      max-width: 1000px;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(217, 217, 217, 0.08) 0%, #D9D9D9 50.71%, rgba(217, 217, 217, 0) 100.38%);

      ${theme.breakpoints.up('lg')} {
        margin: ${theme.spacing(4, 8)};
      }
    `,
    title: css`
      font-weight: 500;
      margin-bottom: ${theme.spacing(4)};
    `,
    optionsGrid: css`
      display: flex;
      flex-wrap: wrap;
      gap: ${theme.spacing(2)};

      & > * {
        width: 100%;

        ${theme.breakpoints.up('sm')} {
          width: calc(50% - ${theme.spacing(1)});
        }
      }
    `,
    connectButton: css`
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      border: 1px solid #666666;
      background: transparent;
      min-width: 180px;
      cursor: pointer;

      &:hover {
        background: #666666;
      }
    `,
    walletLogo: css`
      width: 48px;
      flex-shrink: 0;
    `,
    walletName: css`
      text-align: left;
      margin-left: ${theme.spacing(2)};
    `,
  };
};
