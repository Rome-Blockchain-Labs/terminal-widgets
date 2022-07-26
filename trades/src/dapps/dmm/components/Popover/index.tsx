import { Placement } from '@popperjs/core';
import Portal from '@reach/portal';
import React, { useCallback, useState } from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';
import tw from 'twin.macro';

import useInterval from '../../hooks/useInterval';

const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 9999;

  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
  ${tw`bg-dark-900`}

  border-radius: 8px;
`;

const ReferenceElement = styled.div`
  display: inline-block;
`;

const Arrow = styled.div`
  width: 8px;
  height: 8px;
  z-index: 9998;

  ::before {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: 9998;

    content: '';

    transform: rotate(45deg);
  }

  &.arrow-top {
    bottom: -5px;
    ::before {
      border-top: none;
      border-left: none;
    }
  }

  &.arrow-bottom {
    top: -5px;
    ::before {
      border-bottom: none;
      border-right: none;
    }
  }

  &.arrow-left {
    right: -5px;

    ::before {
      border-bottom: none;
      border-left: none;
    }
  }

  &.arrow-right {
    left: -5px;
    ::before {
      border-right: none;
      border-top: none;
    }
  }
`;

export interface PopoverProps {
  content: React.ReactNode;
  show: boolean;
  children: React.ReactNode;
  placement?: Placement;
}

export default function Popover({
  children,
  content,
  placement = 'auto',
  show,
}: PopoverProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { attributes, styles, update } = usePopper(
    referenceElement,
    popperElement,
    {
      modifiers: [
        { name: 'offset', options: { offset: [8, 8] } },
        { name: 'arrow', options: { element: arrowElement } },
      ],
      placement,
      strategy: 'fixed',
    }
  );
  const updateCallback = useCallback(() => {
    update && update();
  }, [update]);
  useInterval(updateCallback, show ? 100 : null);

  return (
    <>
      <ReferenceElement ref={setReferenceElement as any}>
        {children}
      </ReferenceElement>
      <Portal>
        <PopoverContainer
          ref={setPopperElement as any}
          show={show}
          style={styles.popper}
          {...attributes.popper}
        >
          {content}
          <Arrow
            ref={setArrowElement as any}
            className={`arrow-${
              attributes.popper?.['data-popper-placement'] ?? ''
            }`}
            style={styles.arrow}
            {...attributes.arrow}
          />
        </PopoverContainer>
      </Portal>
    </>
  );
}
