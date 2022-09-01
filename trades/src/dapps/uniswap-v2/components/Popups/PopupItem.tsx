import React, { useCallback, useContext, useEffect } from 'react';
import { X } from 'react-feather';
import { animated, useSpring } from 'react-spring';
import styled, { ThemeContext } from 'styled-components';

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
  background-color: ${({ theme }) => theme.bg1};
  position: relative;
  border-radius: 10px;
  padding: 20px;
  padding-right: 35px;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 290px;
  `}
`;
const Fader = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.bg3};
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

  const theme = useContext(ThemeContext);

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

  const faderStyle = useSpring({
    config: { duration: removeAfterMs ?? undefined },
    from: { width: '100%' },
    to: { width: '0%' },
  });

  return (
    <Popup>
      <StyledClose color={theme.text2} onClick={removeThisPopup} />
      {popupContent}
      {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null}
    </Popup>
  );
}
