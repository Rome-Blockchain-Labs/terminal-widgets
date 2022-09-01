import React from 'react';
import styled from 'styled-components';

import { useActivePopups } from '../../state/application/hooks';
import {
  useRebrandingAnnouncement,
  useURLWarningVisible,
} from '../../state/user/hooks';
import { AutoColumn } from '../Column';
import PopupItem from './PopupItem';

const FixedPopupColumn = styled(AutoColumn)<{ extraPadding: string }>`
  position: fixed;
  top: ${({ extraPadding }) => extraPadding};
  right: 1rem;
  max-width: 355px !important;
  width: 100%;
  z-index: 4;
`;

export default function Popups() {
  // get all popups
  const activePopups = useActivePopups();

  const urlWarningActive = useURLWarningVisible();
  const rebrandingAnounnce = useRebrandingAnnouncement();

  return (
    <FixedPopupColumn
      extraPadding={
        urlWarningActive ? '108px' : rebrandingAnounnce ? '148px' : '88px'
      }
      gap="20px"
    >
      {activePopups.map((item) => (
        <PopupItem
          key={item.key}
          content={item.content}
          popKey={item.key}
          removeAfterMs={item.removeAfterMs}
        />
      ))}
    </FixedPopupColumn>
  );
}
