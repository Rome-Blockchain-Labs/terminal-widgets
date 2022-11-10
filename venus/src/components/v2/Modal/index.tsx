/** @jsxImportSource @emotion/react */
import React, { ReactElement } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { Button, Modal as MUIModal, ModalProps } from '@mui/material';
import Fade from '@mui/material/Fade';

import { useIsSmDown } from 'hooks/responsive';
import { Icon } from '../Icon';
import { useModalStyles } from './styles';

export interface IModalProps extends Omit<ModalProps, 'title' | 'open'> {
  className?: string;
  isOpened: boolean;
  handleClose: () => void;
  title?: string | ReactElement | ReactElement[];
  noHorizontalPadding?: boolean;
  backText?: string;
}

export const Modal: React.FC<IModalProps> = ({
  className,
  children,
  handleClose,
  isOpened,
  title,
  noHorizontalPadding,
  backText,
  ...otherModalProps
}) => {
  const hasTitleComponent = Boolean(title);
  const s = useModalStyles({ hasTitleComponent, noHorizontalPadding });

  const isSmDown = useIsSmDown();

  return (
    <MUIModal
      open={isOpened}
      onClose={handleClose}
      onBackdropClick={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      {...otherModalProps}
    >
      <Fade in={isOpened}>
        <div css={s.box} className={className}>
          <div css={s.titleWrapper}>
            {isSmDown && (
              <Button
                type="button"
                css={s.mobileTitleCloseButton}
                disableRipple
                onClick={handleClose}
                fullWidth
              >
                {backText ?? 'Back'}
                <Icon name="close" css={s.mobileTitleCloseButtonIcon} />
              </Button>
            )}
            {hasTitleComponent && <div css={s.titleComponent}>{title}</div>}
            {!isSmDown && (
              <Button css={s.closeIcon} disableRipple onClick={handleClose}>
                <Icon name="close" />
              </Button>
            )}
          </div>
          <div css={s.contentWrapper}>{children}</div>
        </div>
      </Fade>
    </MUIModal>
  );
};
