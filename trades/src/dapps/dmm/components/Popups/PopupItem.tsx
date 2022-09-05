import React, { useCallback, useEffect } from 'react';
import { X } from 'react-feather';
import { animated } from 'react-spring';
import styled from 'styled-components';
import tw from 'twin.macro';

import { PopupContent } from '../../state/application/actions';
import { useRemovePopup } from '../../state/application/hooks';
import ListUpdatePopup from './ListUpdatePopup';
import TransactionPopup from './TransactionPopup';

export const StyledClose = styled(X)`
  position: absolute;
  right: 10px;
  top: 10px;

  :hover {
    cursor: pointer;
  }
`;
export const Popup = styled.div`
  display: inline-block;
  width: 100%;
  padding: 1em;
  ${tw`bg-dark-400`}

  position: relative;
  border-radius: 10px;
  padding: 20px;
  padding-right: 35px;
  overflow: hidden;
`;
const Fader = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
`;

const AnimatedFader = animated(Fader);

export default function PopupItem({
  content,
  popKey,
  removeAfterMs,
}: {
  removeAfterMs: number | null;
  content: PopupContent;
  popKey: string;
}) {
  const removePopup = useRemovePopup();
  const removeThisPopup = useCallback(
    () => removePopup(popKey),
    [popKey, removePopup]
  );
  useEffect(() => {
    if (removeAfterMs === null) return undefined;

    const timeout = setTimeout(() => {
      removeThisPopup();
    }, removeAfterMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [removeAfterMs, removeThisPopup]);

  let popupContent;
  if ('txn' in content) {
    const {
      txn: { hash, success, summary },
    } = content;
    popupContent = (
      <TransactionPopup hash={hash} success={success} summary={summary} />
    );
  } else if ('listUpdate' in content) {
    const {
      listUpdate: { auto, listUrl, newList, oldList },
    } = content;
    popupContent = (
      <ListUpdatePopup
        auto={auto}
        listUrl={listUrl}
        newList={newList}
        oldList={oldList}
        popKey={popKey}
      />
    );
  }

  return (
    <Popup>
      <StyledClose onClick={removeThisPopup} />
      {popupContent}
      {removeAfterMs !== null ? <AnimatedFader /> : null}
    </Popup>
  );
}
