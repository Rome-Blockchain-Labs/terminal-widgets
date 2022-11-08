import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const styles = () => {
  const theme = useTheme();

  return {
    getContainer: ({ hasTitle }: { hasTitle: boolean }) => css`
      display: flex;
      margin-bottom: ${theme.spacing(6)};
      border-width: 1px;
      border-color: #383943;
      border-style: solid;
      border-radius: 0.375rem;
      padding: 1px;
      margin-left: 2px;
      margin-right: 2px;
      margin-top: 6px;

      ${hasTitle &&
      css`
        align-items: center;

        ${theme.breakpoints.down('sm')} {
          flex-wrap: wrap;
        }
      `}
    `,
    headerTitle: css`
      flex: 0 1 auto;
      margin-right: auto;
      padding-right: ${theme.spacing(4)};

      ${theme.breakpoints.down('sm')} {
        width: 100%;
        margin-bottom: ${theme.spacing(6)};
      }
    `,
    getButton: ({
      active,
      last,
      fullWidth,
    }: {
      active: boolean;
      last: boolean;
      fullWidth: boolean;
    }) => css`
      :hover:not(:disabled),
      :active:not(:disabled) {
        background-color: ${theme.palette.secondary.light};
        border-color: ${theme.palette.secondary.light};
      }

      ${!last &&
      css`
        margin-right: ${theme.spacing(2)};
      `};

      ${!active &&
      css`
        background-color: transparent;
        border-color: transparent;

        :not(:hover, :active) {
          color: ${theme.palette.text.secondary};
        }

        :hover {
          color: ${theme.palette.text.secondary};
        }
      `};

      ${fullWidth &&
      css`
        flex: 1;
      `}
    `,
  };
};

export default styles;
