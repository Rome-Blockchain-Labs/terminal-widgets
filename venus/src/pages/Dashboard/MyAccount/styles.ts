import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useMyAccountStyles = () => {
  const theme = useTheme();
  return {
    container: css`
      width: 100%;
      padding: ${theme.spacing(2)};
      border-radius: 10px;

      ${theme.breakpoints.up('lg')} {
        padding: ${theme.spacing(6)};
      }
    `,
    row: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    header: css`
      margin-bottom: ${theme.spacing(6)};
      padding: ${theme.spacing(2)} 0;
    `,
    apyWithXvs: css`
      display: flex;
      flex-direction: column;
      ${theme.breakpoints.up('sm')} {
        flex-direction: row;
        align-items: center;
      }
    `,
    apyWithXvsLabel: css`
      margin-left: ${theme.spacing(2)};
    `,
    tooltip: css`
      display: flex;
    `,
    infoIcon: () => css`
      cursor: help;
    `,
    toggle: css`
      margin-left: auto;
      margin-right: auto;
      margin-top: ${theme.spacing(3)};
      ${theme.breakpoints.up('sm')} {
        margin-top: 0;
        margin-left: ${theme.spacing(3)};
        margin-right: 0;
      }
    `,
    labelListItem: css`
      display: block;
      margin-bottom: ${theme.spacing(1)};
    `,
    inline: css`
      display: inline-block;
    `,
    netApyContainer: css`
      padding: ${theme.spacing(0, 2)};
    `,
    netApy: css`
      display: flex;
      align-items: center;
      margin-bottom: ${theme.spacing(1)};
    `,
    netApyLabel: css`
      margin-right: ${theme.spacing(2)};
    `,
    list: css`
      padding-left: 0;
      display: flex;
      margin-bottom: ${theme.spacing(6)};

      ${theme.breakpoints.down('sm')} {
        flex-direction: column;
      }
    `,
    item: css`
      list-style: none;
      padding-left: ${theme.spacing(2)};
      padding-right: ${theme.spacing(2)};

      ${theme.breakpoints.down('sm')} {
        padding: 0;
        font-size: 14px;
      }
    `,
    inlineLabel: css`
      margin-right: ${theme.spacing(1)};
    `,
    progressBar: css`
      margin-bottom: ${theme.spacing(3)};
    `,
    shieldIcon: css`
      margin-right: ${theme.spacing(2)};
    `,
    safeLimit: css`
      margin-right: ${theme.spacing(2)};
    `,
    bottom: css`
      display: flex;
      justify-content: flex-end;
      align-items: center;
    `,
  };
};
