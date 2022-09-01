import React, { useCallback, useState } from 'react';
import { Info } from 'react-feather';
import { Flex } from 'rebass';
import styled from 'styled-components';
import tw from 'twin.macro';

import Tooltip from '../Tooltip';

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  ${tw`bg-dark-400`}

  :hover,
  :focus {
    opacity: 0.7;
  }
`;

const LightQuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
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

const QuestionMark = styled.span`
  font-size: 1rem;
`;

export default function QuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  return (
    <Flex alignItems="center" as="span" marginLeft="0.25rem">
      <Tooltip show={show} text={text}>
        <QuestionWrapper
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <Info size={12} />
        </QuestionWrapper>
      </Tooltip>
    </Flex>
  );
}

export function LightQuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip show={show} text={text}>
        <LightQuestionWrapper
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <QuestionMark>?</QuestionMark>
        </LightQuestionWrapper>
      </Tooltip>
    </span>
  );
}
