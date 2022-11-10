import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

const iconCloseSize = '35px';

export const useModalStyles = ({
  hasTitleComponent,
  noHorizontalPadding,
}: {
  hasTitleComponent: boolean;
  noHorizontalPadding?: boolean;
}) => {
  const theme = useTheme();

  return {
    box: css`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% - ${theme.spacing(8)});
      border-radius: ${theme.spacing(6)};
      ${theme.breakpoints.down('lg')} {
        left: 50%;
        transform: translate(-50%, -50%);
      }
      ${theme.breakpoints.down('md')} {
        left: 50%;
        transform: translate(-50%, -50%);
      }
      ${theme.breakpoints.down('sm')} {
        width: 100%;
        left: 0;
        top: 0;
        bottom: 0;
        transform: translate(0, 0);
        border-radius: 0;
        max-height: none;
      }
      max-width: ${theme.spacing(136)};
      background-color: ${theme.palette.background.paper};
      overflow: auto;
      max-height: calc(100% - ${theme.spacing(8)});

      padding-bottom: ${theme.spacing(4)};
    `,
    titleWrapper: css`
      padding-top: ${theme.spacing(4)};
      padding-left: ${theme.spacing(3)};
      padding-right: ${theme.spacing(3)};
      padding-bottom: ${hasTitleComponent ? theme.spacing(2) : 0};
      border-bottom: ${hasTitleComponent ? `1px solid ${theme.palette.secondary.light}` : 0};
      position: relative;
      top: 0;
      background-color: ${hasTitleComponent ? theme.palette.background.paper : 'transparent'};
      margin-bottom: ${hasTitleComponent ? theme.spacing(4) : 0};
      ${theme.breakpoints.down('sm')} {
        margin-bottom: ${hasTitleComponent ? theme.spacing(2) : 0};
        padding-left: ${theme.spacing(0.5)};
        padding-right: ${theme.spacing(0.5)};
        padding-top: ${theme.spacing(0.5)};
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
    closeIcon: css`
<<<<<<< HEAD
      right: ${theme.spacing(2)};
      top: ${theme.spacing(0.5)};
=======
      right: ${theme.spacing(3)};
      top: ${theme.spacing(3)};
>>>>>>> origin/master
      position: absolute;
      height: ${iconCloseSize};
      width: ${iconCloseSize};
      min-width: ${iconCloseSize};
      margin-left: auto;
      padding: 0;
      border-radius: 50%;
      background-color: ${theme.palette.secondary.light};
      border-color: ${theme.palette.secondary.light};

      :hover:not(:disabled) {
        background-color: ${theme.palette.text.secondary};
        border-color: ${theme.palette.text.secondary};
      }

      :active:not(:disabled) {
        background-color: ${theme.palette.secondary.main};
        border-color: ${theme.palette.secondary.main};
      }
<<<<<<< HEAD
=======
<<<<<<< HEAD
    `,
    mobileTitleCloseButton: css`
      background-color: ${theme.palette.secondary.light};
      border-color: ${theme.palette.secondary.light};
      border-radius: 9px;
      color: ${theme.palette.text.secondary};
      margin-bottom: ${hasTitleComponent ? theme.spacing(0) : theme.spacing(2)};
      text-transform: none;

      :hover:not(:disabled) {
        color: ${theme.palette.text.primary};
        background-color: ${theme.palette.text.secondary};
        border-color: ${theme.palette.text.secondary};
      }

      :active:not(:disabled) {
        color: ${theme.palette.text.primary};
        background-color: ${theme.palette.secondary.main};
        border-color: ${theme.palette.secondary.main};
      }
    `,
    mobileTitleCloseButtonIcon: css`
      right: ${theme.spacing(2)};
      top: ${theme.spacing(2.5)};
      position: absolute;
=======
>>>>>>> origin/master
>>>>>>> origin/master
    `,
    contentWrapper: css`
      padding-left: ${noHorizontalPadding ? 0 : theme.spacing(6)};
      padding-right: ${noHorizontalPadding ? 0 : theme.spacing(6)};
      ${theme.breakpoints.down('md')} {
        padding-left: ${noHorizontalPadding ? 0 : theme.spacing(3)};
        padding-right: ${noHorizontalPadding ? 0 : theme.spacing(3)};
      }
    `,
  };
};
