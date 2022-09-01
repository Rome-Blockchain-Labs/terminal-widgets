import { Placement } from '@popperjs/core';
import React, { ReactNode, useCallback, useState } from 'react';
import { Info } from 'react-feather';
import styled from 'styled-components';

import Tooltip from '../Tooltip';

const InfoWrapper = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;

  :hover,
  :focus {
    opacity: 0.7;
  }
`;

const LightInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);

  :hover,
  :focus {
    opacity: 0.7;
  }
`;

const InfoMark = styled.span`
  font-size: 1rem;
`;

const InfoHelperWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-left: 0.25rem;
`;

export default function InfoHelper({
  color,
  isActive = false,
  placement,
  size,
  text,
}: {
  text: string | ReactNode;
  size?: number;
  isActive?: boolean;
  color?: string;
  placement?: Placement;
}) {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  return (
    <InfoHelperWrapper>
      <Tooltip placement={placement} show={show} text={text}>
        <InfoWrapper
          isActive={isActive}
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <Info color={color} size={size || 16} />
        </InfoWrapper>
      </Tooltip>
    </InfoHelperWrapper>
  );
}

export function LightInfoHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip show={show} text={text}>
        <LightInfoWrapper
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <InfoMark>?</InfoMark>
        </LightInfoWrapper>
      </Tooltip>
    </span>
  );
}
