/** @jsxImportSource @emotion/react */
import React, { ReactElement } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { Button, Modal as MUIModal, ModalProps } from '@mui/material';
import Fade from '@mui/material/Fade';
import { Icon } from '../Icon';
import { useModalStyles } from './styles';
// import { useIsSmDown } from '../../../hooks/responsive';

export interface IModalProps extends Omit<ModalProps, 'title' | 'open'> {
  className?: string;
  isOpened: boolean;
  handleClose: () => void;
  title?: string | ReactElement | ReactElement[];
  noHorizontalPadding?: boolean;
  backCopy?: string;
}

export const Modal: React.FC<IModalProps> = ({
  className,
  children,
  handleClose,
  isOpened,
  title,
  noHorizontalPadding,
  backCopy,
  ...otherModalProps
}) => {
  const s = useModalStyles({
    hasTitleComponent: Boolean(title),
    noHorizontalPadding,
    hasBackCopy: Boolean(backCopy),
  });
  // const IsSm = useIsSmDown();
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
            <Button css={s.closeButton}>
              <span css={s.backCopy}>{backCopy}</span>
              <div css={s.closeIcon}>
                <Icon name="close" size="15" color="#D9D9D9" />
              </div>
            </Button>
            {title && <div css={s.titleComponent}>{title}</div>}
          </div>
          <div css={s.contentWrapper}>{children}</div>
        </div>
      </Fade>
    </MUIModal>
  );
};
