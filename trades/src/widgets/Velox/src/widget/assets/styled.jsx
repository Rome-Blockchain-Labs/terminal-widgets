import styled from 'styled-components';

import { withEnlargedProps } from '../WidgetSizeStateContext';
import BackgroundImg from './v2/background.png';
import BackgroundVeloxImg from './velox.svg';

/** LAYOUTS **/
export const WidgetFrame = styled.div`
  margin: 0 auto;
  background-image: url(${BackgroundVeloxImg});
  background-position: right -3.125rem bottom -3.125rem;
  background-repeat: no-repeat;
  border-radius: 1.25rem;
  background-size: 220px 220px;
  min-width: 100%;

  @media only screen and (max-width: 48rem) {
    min-width: 100%;
    width: 100%;
  }
`;

export const Widget = styled.div`
  font-size: 0.625rem;
  align-items: stretch;
  color: #00d3cf;
  font-family: 'Montserrat', sans-serif;
  background-image: url(${BackgroundImg});
  min-height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 1;
  min-height: 100vh;
  display: grid;
  place-items: center;
`;

export const Block = styled.div`
  display: block;
  position: relative;
  min-width: 0;
  border-color: #067c82;
  border-style: solid;
  border-width: 0.125rem;
  border-radius: 1.25rem;
  background: #08333c;
  background: rgba(8, 51, 60, 0.5);
  padding: 0.938rem;
  margin: 1.25rem;
  -webkit-box-shadow: 0.188rem 0.188rem 0.313rem #067c82; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 0.188rem 0.188rem 0.313rem #067c82; /* Firefox 3.5 - 3.6 */
  box-shadow: 0.188rem 0.188rem 0.438rem rgba(6, 124, 130, 0.75);
  min-height: 7.5rem;
`;
export const BlockBody = styled.div`
  position: relative;
`;

export const BlockRight = styled.div`
  margin-left: -2.5rem;
  @media only screen and (max-width: 61.938rem) {
    margin-left: 0;
  }
`;

export const BlockWrap = styled.div`
  position: relative;
  margin: 4.375rem 0.625rem;
`;

export const BlockHeader = styled.h5`
  width: 9.375rem;
  border-color: #067c82;
  background: #067c82;
  border-style: solid;
  border-width: 1.25rem;
  border-radius: 1.25rem;
  margin: -2.063rem 0 1.25rem 0;
  padding: 0.438rem 0.625rem 0.375rem 0.75rem;
  color: #00d3cf;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
`;

/** SHARED COMPONENTS **/

export const ModalBlockHeader = styled(BlockHeader)`
  width: 13.75rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  margin-top: -1.25rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  position: relative;
`;

export const BorderStickie = styled.div`
  margin: auto 1.25rem;
  height: 1.5rem;
  background: #067c82;
  border-radius: 0.813rem 0 0 0.813rem;
  display: flex;
  width: 3.438rem;
  position: relative;

  :after {
    top: 0.188rem;
    right: -0.438rem;
    height: 1.125rem;
    width: 1.125rem;
    position: absolute;
    content: '';
    background: #067c82;
    transform: rotate(45deg);
  }
`;

export const MobileHiddenStickie = styled(BorderStickie)`
  @media (max-width: 31.25rem) {
    display: none;
  }
`;

export const LightBackgroundBox = styled.div`
  margin: 3.125rem auto;
  max-width: 31.25rem;
  border-radius: 1.25rem;
  background-color: #1d7c82;
  text-align: center;
  color: white;
  padding-top: 0.938rem;
  position: relative;
`;

const NormalNumFont = styled.span`
  color: #ffffff;
  font-size: ${(props) => (props.enlarged ? '1.125rem' : '0.938rem')};
  font-family: 'Fira Code', monospace;
`;

export const NumFont = withEnlargedProps(NormalNumFont);

export const TokenFont = styled.span`
  font-weight: 600;
  font-size: 0.5rem;
  margin-right: 0.313rem;
  vertical-align: middle;
`;

export const Outline = styled.div`
  border: solid 0.125rem #15b3b0;
  border-radius: 1rem;
  width: 100%;
  margin-left: 0.313rem;
  margin-right: 0.313rem;
`;

const NormalOutlinedDarkInput = styled.input`
  display: block;
  width: 100%;
  position: relative;
  border-color: ${(props) => (props.invalid ? '#ed127a' : '#15B3B0')};
  background-color: #08333c;
  border-width: 0.125rem;
  border-style: solid;
  border-radius: 1.875rem;
  text-align: center;
  padding: 0.313rem;
  color: ${(props) => (props.invalid ? '#ed127a' : '#ffffff')};
  font-size: 0.75rem;
  font-family: 'Fira Code', monospace;
  ${({ charLength }) => charLength > 12 && 'width:15.625rem;'}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${(props) => props.disabled && 'color:gray'}
`;
const EnlargedOutlinedDarkInput = styled.input`
  height: 3.75rem;
  display: block;
  width: 100%;
  position: relative;
  border-color: ${(props) => (props.invalid ? '#ed127a' : '#15B3B0')};
  background-color: #08333c;
  border-width: 0.125rem;
  border-style: solid;
  border-radius: 1.875rem;
  text-align: center;
  padding: 0.313rem;
  color: ${(props) => (props.invalid ? '#ed127a' : '#ffffff')};
  font-size: 1.125rem;
  font-family: 'Fira Code', monospace;
  ${({ charLength }) => charLength > 12 && 'width:15.625rem;'}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${(props) => props.disabled && 'color:gray'}
`;
export const OutlinedDarkInput = withEnlargedProps(
  NormalOutlinedDarkInput,
  EnlargedOutlinedDarkInput
);

const NormalStrongFont = styled.span`
  font-weight: bold;
  font-size: ${(props) => (props.enlarged ? '1.125rem' : '.75rem')};
`;
export const StrongFont = withEnlargedProps(NormalStrongFont);

const NormalHelpText = styled.span`
  font-size: ${(props) => (props.enlarged ? '.813rem' : '.625rem')};
`;
export const HelpText = withEnlargedProps(NormalHelpText);

const NormalOutlinedInput = styled.input`
  height: 1.875rem;
  display: block;
  width: 100%;
  position: relative;
  border-color: ${(props) => (props.invalid ? '#ed127a' : '#15B3B0')};
  background-color: #05595a;
  border-width: 0.125rem;
  border-style: solid;
  border-radius: 1.875rem;
  text-align: center;
  padding: 0.313rem;
  color: ${(props) => (props.invalid ? '#ed127a' : '#ffffff')};
  font-size: 0.625rem;
  font-family: 'Fira Code', monospace;
  ${({ charLength }) => charLength > 12 && 'width:15.625rem;'}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EnlargedOutlinedInput = styled(NormalOutlinedInput)`
  height: 3.75rem;
`;

export const OutlinedInput = withEnlargedProps(
  NormalOutlinedInput,
  EnlargedOutlinedInput
);

export const Button = styled.button`
  backface-visibility: hidden;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  background: linear-gradient(70deg, #15b3b0 0%, #ed127a 100%);
  border-radius: 6.25rem;
  padding: 0.813rem 0.625rem 0.625rem 1.25rem;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.625rem;
  width: 12.5rem;
  margin: 1.875rem 0 0 0;
  //float: right;
  div {
    text-align: left;
  }
  img {
    padding: 0.2rem;
    margin: 0rem 0rem 0rem 1.25rem;
    position: absolute;
    top: 0rem;
    right: 0.438rem;
  }

  :hover {
    background: linear-gradient(70deg, #ed127a 0%, #15b3b0 100%);
  }
`;

export const MediumButton = styled(Button)`
  padding: 0.375rem 0.625rem 0.313rem 0.113rem;
  width: 6.5rem;
  margin: 0 0 0 0;
  float: initial;
  > img {
    margin: -0.5rem 0rem 0rem 0.625rem;
    right: 0.188rem;
    height: 1rem;
    top: 50%;
  }
`;

export const BorderedTable = styled.table`
  width: 100%;
  td,
  th {
    padding: 0.5rem;
    font-weight: normal;
    font-size: 0.625rem;
    white-space: nowrap;
  }

  tr {
    border-bottom: 0.063rem solid #067c82;
  }

  tbody tr:last-child {
    border: 0;
  }
`;

const NormalDarkOutline = styled(Outline)`
  background-color: #08333c;
  font-weight: bold;
  height: 1.875rem;
  text-align: left;
  line-height: 1.875rem;
  padding: 0 0.5rem;
`;
const EnlargedDarkOutline = styled(NormalDarkOutline)`
  height: 3.75rem;
  border-radius: 1.8rem;
  width: 12.5rem;
  line-height: 3.75rem;
  padding: 0 1rem;
`;
export const DarkOutline = withEnlargedProps(
  NormalDarkOutline,
  EnlargedDarkOutline
);

const NormalOutlineCaret = styled.div`
  position: absolute;
  top: 0;
  right: ${(props) => (props.enlarged ? '1rem' : '0.5rem')};
  line-height: ${(props) => (props.enlarged ? '3.75rem' : '1.875rem')};
`;

export const OutlineCaret = withEnlargedProps(NormalOutlineCaret);

const NormalImageButton = styled(Button)`
  font-size: 0.625rem;
  padding: 0.375rem 1.875rem 0.313rem 0.813rem;
  width: 5.938rem;
  margin: 0 0 0 0;
  > img {
    right: 0.188rem;
    height: 1.563rem;
    width: 1.563rem;
  }
`;

const EnlargedImageButton = styled(NormalImageButton)`
  font-size: 0.875rem;
  padding: 1.313rem 2.25rem 1.313rem 1.125rem;
  width: 8.75rem;
  > img {
    top: 1rem;
    right: 1.125rem;
  }
`;

export const ImageButton = withEnlargedProps(
  NormalImageButton,
  EnlargedImageButton
);

export const StyledModal = styled.div`
  max-width: 780px;
  margin: 0 auto;
  background: rgba(13, 109, 111, 0.8);
  border-radius: 0.938rem;
  padding: 1.25rem;
  img {
    display: inline-block;
  }
`;
