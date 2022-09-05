import styled, { createGlobalStyle } from 'styled-components';

import BackgroundImg from './v2/background.png';

/** LAYOUTS **/

export const GlobalStyle = createGlobalStyle`
  html {
    background-color: #08333c;
    color: #00d3cf;
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    background-image: url(${BackgroundImg});
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 1;
  }

  body {
    background: none;
    color: #00d3cf;
  }
  /** resets **/
  button {
    text-align: left;
    border: 0 ;
  }
  button:focus {
    border: 0;
    outline: 0;
  }
  *:focus {
    border: 0;
    outline: 0;
  }
  
`;

export const Block = styled.div`
  display: block;
  position: relative;
  min-width: 0;
  border-color: #067c82;
  border-style: solid;
  border-width: 2px;
  border-radius: 20px;
  background: #08333c;
  background: rgba(8, 51, 60, 0.5);
  padding: 15px;
  margin: 20px;
  -webkit-box-shadow: 3px 3px 5px #067c82; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 3px 3px 5px #067c82; /* Firefox 3.5 - 3.6 */
  box-shadow: 3px 3px 7px rgba(6, 124, 130, 0.75);
  min-height: 120px;
`;
export const BlockBody = styled.div`
  position: relative;
`;

export const BlockRight = styled.div`
  margin-left: -40px;
  @media only screen and (max-width: 991px) {
    margin-left: 0;
  }
`;

export const BlockWrap = styled.div`
  position: relative;
  margin: 70px 10px;
`;

export const BlockHeader = styled.h5`
  width: 150px;
  border-color: #067c82;
  background: #067c82;
  border-style: solid;
  border-width: 2px;
  border-radius: 20px;
  margin: -33px 0 20px 0;
  padding: 7px 10px 6px 12px;
  color: #00d3cf;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
`;

/** SHARED COMPONENTS **/

export const SelectableToggleImg = styled.div`
  align-self: flex-start;
  //margin:0 5px;
  background-color: #093740;
  border: solid 2px #46a5a3;
  border-radius: 50px;
  width: 58px;
  height: 58px;
  display: flex;
  cursor: pointer;
  img {
    margin: auto;
    width: 40px;
    filter: contrast(40%);
    ${({ selected }) =>
      selected &&
      `
    filter:none;
  `}
  }
  :hover {
    border: solid 3px #36d3cf;
    filter: none;
    img {
      filter: none;
    }
  }
  ${({ selected }) =>
    selected &&
    `
   border: solid 3px #36D3CF;
    filter:none;
  `}
`;

export const ModalBlockHeader = styled(BlockHeader)`
  width: 220px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 12px;
  margin-top: -20px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  position: relative;
`;

export const BorderStickie = styled.div`
  margin: auto 20px;
  height: 24px;
  background: #067c82;
  border-radius: 13px 0 0 13px;
  display: flex;
  width: 55px;
  position: relative;

  :after {
    top: 3px;
    right: -7px;
    height: 18px;
    width: 18px;
    position: absolute;
    content: '';
    background: #067c82;
    transform: rotate(45deg);
  }
`;

export const MobileHiddenStickie = styled(BorderStickie)`
  @media (max-width: 500px) {
    display: none;
  }
`;

export const LightBackgroundBox = styled.div`
  margin: 50px auto;
  max-width: 500px;
  border-radius: 20px;
  background-color: #1d7c82;
  text-align: center;
  color: white;
  padding-top: 15px;
  position: relative;
`;

export const NumFont = styled.span`
  color: #ffffff;
  font-size: 15px;
  font-family: 'Fira Code', monospace;
`;

export const TokenFont = styled.span`
  font-weight: 600;
  font-size: 14px;
  margin-right: 5px;
  vertical-align: middle;
`;

export const Outline = styled.div`
  border: solid 2px #15b3b0;
  border-radius: 25px;
  width: 140px;
  margin-left: 5px;
  margin-right: 5px;
`;

export const OutlinedDarkInput = styled.input`
  display: block;
  width: 116px;
  position: relative;
  border-color: ${(props) => (props.invalid ? '#ed127a' : '#15B3B0')};
  background-color: #08333c;
  border-width: 2px;
  border-style: solid;
  border-radius: 30px;
  text-align: center;
  padding: 11px;
  color: ${(props) => (props.invalid ? '#ed127a' : '#ffffff')};
  font-size: 15px;
  font-family: 'Fira Code', monospace;
  ${({ charLength }) => charLength > 12 && 'width:250px;'}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${(props) => props.disabled && 'color:gray'}
`;

export const OutlinedInput = styled.input`
  height: 45px;
  display: block;
  width: 116px;
  position: relative;
  border-color: ${(props) => (props.invalid ? '#ed127a' : '#15B3B0')};
  background-color: #05595a;
  border-width: 2px;
  border-style: solid;
  border-radius: 40px;
  text-align: center;
  padding: 11px;
  color: ${(props) => (props.invalid ? '#ed127a' : '#ffffff')};
  font-size: 15px;
  font-family: 'Fira Code', monospace;
  ${({ charLength }) => charLength > 12 && 'width:250px;'}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Button = styled.button`
  backface-visibility: hidden;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  background: linear-gradient(70deg, #15b3b0 0%, #ed127a 100%);
  border-radius: 100px;
  padding: 13px 10px 10px 20px;
  color: #ffffff;
  font-weight: 600;
  font-size: 12px;
  width: 200px;
  margin: 30px 0 0 0;
  //float: right;
  div {
    text-align: left;
  }
  img {
    padding: 7px 7px 7px 7px;
    margin: 0px 0px 0px 20px;
    position: absolute;
    top: 0px;
    right: 7px;
  }

  :hover {
    background: linear-gradient(70deg, #ed127a 0%, #15b3b0 100%);
  }
`;

export const MediumButton = styled(Button)`
  padding: 6px 10px 5px 13px;
  width: 104px;
  margin: 0 0 0 0;
  float: initial;
  > img {
    margin: 0px 0px 0px 10px;
    right: 3px;
  }
`;

export const BorderedTable = styled.table`
  width: 100%;
  td,
  th {
    padding: 8px;
    font-weight: normal;
    font-size: 1rem;
    white-space: nowrap;
  }

  tr {
    border-bottom: 1px solid #067c82;
  }

  tbody tr:last-child {
    border: 0;
  }
`;
