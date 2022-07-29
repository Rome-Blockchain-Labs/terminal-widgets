import styled from 'styled-components';

import { SelectableToggleImg } from '../../components/common/SelectableToggleImg';
import { withEnlargedProps } from '../../WidgetSizeStateContext';

interface Props {
  label: string;
}

const NormalLabeledImgBox = styled(SelectableToggleImg)<Props>`
  position: relative;
  :after {
    content: '${({ label }) => label}';
    position: absolute;
    bottom: -0.188rem;
    right: -0.188rem;
    border-radius: 0.625rem;
    background-color: #1c646c;
    width: 1.25rem;
    height: 1.25rem;
    color: #08333c;
    text-align: center;
    font-weight: bold;
    padding: 0.063rem;
  }
`;

const EnlargedLabeledImgBox = styled(SelectableToggleImg)<Props>`
  position: relative;
  :after {
    content: '${({ label }) => label}';
    position: absolute;
    bottom: -0.188rem;
    right: -0.188rem;
    border-radius: 1.938rem;
    background-color: #1c646c;
    width: 1.25rem;
    height: 1.25rem;
    color: #08333c;
    text-align: center;
    font-weight: bold;
    padding: 0.063rem;
  }
`;

export const LabeledImgBox = withEnlargedProps(
  NormalLabeledImgBox,
  EnlargedLabeledImgBox
);
