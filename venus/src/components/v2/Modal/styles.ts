import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

const iconCloseSize = '35px';

export const useModalStyles = ({
  hasTitleComponent,
  noHorizontalPadding,
  hasBackCopy,
}: {
  hasTitleComponent: boolean;
  noHorizontalPadding?: boolean;
  hasBackCopy: boolean;
}) => {
  const theme = useTheme();

  return {
    box: css`
      position: absolute;
      top: 50%;
      left: calc(50% + ${theme.shape.drawerWidthDesktop});
      transform: translate(calc(-50% - (${theme.shape.drawerWidthDesktop}) / 2), -50%);
      ${theme.breakpoints.down('lg')} {
        left: calc(50% + ${theme.shape.drawerWidthTablet});
        transform: translate(calc(-50% - (${theme.shape.drawerWidthTablet}) / 2), -50%);
      }
      ${theme.breakpoints.down('md')} {
        left: 50%;
        transform: translate(-50%, -50%);
      }
      width: calc(100% - ${theme.spacing(8)});
      max-width: ${theme.spacing(136)};
      border-radius: 0.375rem;
      background-color: ${theme.palette.background.paper};
      overflow: auto;
      max-height: calc(100% - ${theme.spacing(8)});
    `,
    titleWrapper: css`
      padding-bottom: ${hasTitleComponent ? theme.spacing(6) : 0};
      border-bottom: ${hasTitleComponent ? `1px solid ${theme.palette.secondary.light}` : 0};
      position: sticky;
      top: 0;
      background-color: ${hasTitleComponent ? theme.palette.background.paper : 'transparent'};
      margin-bottom: ${hasTitleComponent ? theme.spacing(10) : 0};
      ${theme.breakpoints.down('md')} {
        margin-bottom: ${hasTitleComponent ? theme.spacing(4) : 0};
      }
    `,
    titleComponent: css`
      align-self: center;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: ${iconCloseSize};
      padding-left: ${iconCloseSize};
      padding-right: ${iconCloseSize};
    `,
    closeButton: css`
      ${theme.breakpoints.down('sm')} {
        background: #454549;
        margin-top: 1px;
        margin-left: 1px;
        margin-right: 1px;
        border-radius: 0.375rem;
        padding: 1px;
        display: flex;
        justify-content: center;
        text-transform: ${hasBackCopy && 'capitalize'};
        width: 100%;
        color: #9597a0;
        align-items: center;
        height: 48px;
        border-width: 1px;
        border-color: #383943;
        border-style: solid;
        font-size: 18px;
        position: relative;
      }
    `,
    backCopy: css`
      margin-left: auto;
      margin-right: auto;
    `,
    closeIcon: css`
      ${theme.breakpoints.down('sm')} {
        position: absolute;
        right: 10px;
        display: grid;
        place-items: center;
        margin-right: 12px;
      }
    `,
    contentWrapper: css`
      padding-bottom: ${theme.spacing(10)};
      padding-left: ${noHorizontalPadding ? 0 : theme.spacing(10)};
      padding-right: ${noHorizontalPadding ? 0 : theme.spacing(10)};
      ${theme.breakpoints.down('md')} {
        padding-bottom: ${theme.spacing(4)};
        padding-left: ${noHorizontalPadding ? 0 : theme.spacing(4)};
        padding-right: ${noHorizontalPadding ? 0 : theme.spacing(4)};
      }
    `,
  };
};
