import React, { FC, useContext } from 'react';
import ReactDOM from 'react-dom';
import tw, { styled } from 'twin.macro';

import { DappContext } from '../../contexts';
//TODO: uncomment for dmm
import { DmmContext } from '../../widgets/Dmm/DmmContext';

const StyledContent = styled.div<{
  minHeight?: number | false;
  maxHeight?: number;
  noBackground?: boolean;
  noPadding?: boolean;
}>`
  ${tw`rounded-lg flex max-w-md`}

  ${({ noBackground }) => !noBackground && tw`bg-dark-500`}
  ${({ maxHeight }) => maxHeight && `max-height: ${maxHeight}px;`}
  ${({ minHeight }) => minHeight && `min-height: ${minHeight}px;`}
  ${({ noPadding }) => (noPadding ? tw`px-0` : tw`px-4`)}
`;

interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  minHeight?: number | false;
  maxHeight?: number;
  children?: React.ReactNode;
  noBackground?: boolean;
  noPadding?: boolean;
}

export const ModalWrapper: FC<ModalProps> = ({
  children,
  isOpen,
  maxHeight,
  minHeight = false,
  noBackground,
  noPadding = false,
  onDismiss,
}) => {
  const { widgetId } = useContext(DappContext);
  const { widgetId: dmmWidgetId } = useContext(DmmContext);

  const parentElement = document.getElementById(
    // widgetId
    //TODO: uncomment for dmm
    widgetId ? widgetId : dmmWidgetId
  );

  return parentElement && isOpen
    ? ReactDOM.createPortal(
        <div
          className="modal-wrapper-awesome"
          tw="absolute top-0 left-0 w-full h-full z-50 bg-black bg-opacity-75 scrollbar-none"
          onClick={onDismiss}
        >
          <div tw="min-w-full min-h-full flex justify-center items-center">
            <StyledContent
              aria-label="dialog content"
              maxHeight={maxHeight}
              minHeight={minHeight}
              noBackground={noBackground}
              noPadding={noPadding}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </StyledContent>
          </div>
        </div>,
        parentElement
      )
    : null;
};
