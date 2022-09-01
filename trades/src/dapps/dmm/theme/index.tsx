import { Text, TextProps } from 'rebass';
import styled from 'styled-components';

import { Colors } from './styled';

export * from './components';

const white = '#FFFFFF';
const black = '#000000';

export function colors(darkMode: boolean): Colors {
  return {
    advancedBG: darkMode ? '#1d272b' : '#ecebeb',

    advancedBorder: darkMode ? '#303e46' : '#dcdbdc',

    apr: '#0faaa2',

    background: darkMode ? '#243036' : '#ffffff',

    bg1: darkMode ? '#212429' : '#FFFFFF',

    bg10: darkMode ? '#263239' : '#f5f5f5',

    bg11: darkMode ? '#1b2226' : '#ebeaea',

    bg12: darkMode ? '#11171a' : '#f5f5f5',

    bg13: darkMode ? '#1f292e' : '#e8e9ed',

    bg14: darkMode ? '#40505a' : '#a9a9a9',

    bg15: darkMode ? '#1f292e' : '#f5f5f5',

    bg16: darkMode ? '#1f292e' : '#ffffff',

    bg17: darkMode ? '#31cb9e33' : '#31cb9e1a',

    bg18: darkMode ? '#1a4052' : '#ecebeb',

    bg19: darkMode ? '#222c31' : '#ffffff',

    bg2: darkMode ? '#222c31' : '#F7F8FA',

    bg20: darkMode ? '#243036' : '#F5F5F5',

    bg3: darkMode ? '#40444F' : '#dcdbdc',

    bg4: darkMode ? '#565A69' : '#CED0D9',

    bg5: darkMode ? '#6C7284' : '#888D9B',

    bg6: darkMode ? '#243036' : '#FFFFFF',

    bg7: darkMode ? '#0aa1e7' : '#e1f5fe',

    bg8: darkMode ? '#0078b0' : '#b3e5fc',

    bg9: darkMode ? '#1d2a32' : '#ecebeb',

    black,

    blue: darkMode ? '#78d5ff' : '#31cb9e',

    blue1: '#31cb9e',

    // border colors
    border: darkMode ? '#40505A' : '#dcdbdc ',

    btnOutline: darkMode ? '#31cb9e' : '#333333',

    buttonBlack: darkMode ? '#11171a' : '#f5f5f5',

    buttonGray: darkMode ? '#40444f' : '#dcdbdc',

    darkBlue: '#1183b7',

    disableText: darkMode ? '#6C7284' : '#A7B6BD',

    evenRow: darkMode ? '#303e46' : '#ffffff',

    green: '#31CB9E',

    green1: '#27AE60',

    lightBlue: '#78d5ff',

    lightGreen: '#98E5CE',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',

    // table colors
    oddRow: darkMode ? '#283339' : '#f4f4f4',

    poweredByText: darkMode ? '#A7B6BD' : '#5C6468',

    //primary colors
    primary: '#31CB9E',

    primary2: darkMode ? '#3680E7' : '#3680E7',

    primary3: darkMode ? '#4D8FEA' : '#4D8FEA',

    primary4: darkMode ? '#376bad70' : '#376bad70',

    primary5: darkMode ? '#153d6f70' : '#31cb9e',

    // color text
    primaryText2: darkMode ? '#a7b6bd' : '#13191b',

    // other
    red: darkMode ? '#FF537B' : '#FF6871',

    red1: '#FF6871',

    red2: '#F82D3A',

    red3: '#D60000',

    // secondary colors
    secondary1: darkMode ? '#31cb9e' : '#31cb9e',

    secondary2: darkMode ? '#17000b26' : '#17000b26',

    secondary3: darkMode ? '#17000b26' : '#17000b26',

    secondary4: '#2FC99E',

    subText: darkMode ? '#A7B6BD' : '#5C6468',

    // backgrounds
    tableHeader: darkMode ? '#303E46' : '#F9F9F9',

    // text
    text: darkMode ? '#ffffff' : '#333333',

    text10: darkMode ? '#00a2f7' : '#00a2f7',

    text11: darkMode ? '#f4f4f4' : '#565A69',

    text12: darkMode ? '#4aff8c' : '#0CE15B',

    text13: darkMode ? '#f5f5f5' : '#333333',

    text2: darkMode ? '#C3C5CB' : '#565A69',

    text3: darkMode ? '#6C7284' : '#888D9B',

    text4: darkMode ? '#565A69' : '#C3C5CB',

    text6: darkMode ? '#6d8591' : '#565A69',

    text7: darkMode ? '#c9d2d7' : '#565A69',

    text8: darkMode ? '#5c6468' : '#5c6468',

    text9: darkMode ? '#859aa5' : '#859aa5',

    textReverse: darkMode ? '#333333' : '#ffffff',

    warning: '#FFAF01',
    // base
    white,
    yellow1: '#FFE270',
    yellow2: '#F3841E',
  };
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`;

export const TYPE = {
  black(props: TextProps) {
    return <TextWrapper color={'text1'} fontWeight={500} {...props} />;
  },
  blue(props: TextProps) {
    return <TextWrapper color={'primary'} fontWeight={500} {...props} />;
  },
  body(props: TextProps) {
    return (
      <TextWrapper color={'text1'} fontSize={16} fontWeight={400} {...props} />
    );
  },
  darkGray(props: TextProps) {
    return <TextWrapper color={'text3'} fontWeight={500} {...props} />;
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return (
      <TextWrapper
        color={error ? 'red1' : 'text2'}
        fontWeight={500}
        {...props}
      />
    );
  },
  gray(props: TextProps) {
    return <TextWrapper color={'bg3'} fontWeight={500} {...props} />;
  },
  h3(props: TextProps) {
    return (
      <TextWrapper
        color={'#E1F5FE'}
        fontSize={'18px'}
        fontWeight={500}
        lineheight={'21px'}
        my={0}
        {...props}
      />
    );
  },
  italic(props: TextProps) {
    return (
      <TextWrapper
        color={'text2'}
        fontSize={12}
        fontStyle={'italic'}
        fontWeight={500}
        {...props}
      />
    );
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontSize={24} fontWeight={600} {...props} />;
  },
  link(props: TextProps) {
    return <TextWrapper color={'primary'} fontWeight={500} {...props} />;
  },
  main(props: TextProps) {
    return <TextWrapper color={'text2'} fontWeight={500} {...props} />;
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontSize={20} fontWeight={500} {...props} />;
  },
  small(props: TextProps) {
    return <TextWrapper fontSize={11} fontWeight={500} {...props} />;
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontSize={14} fontWeight={400} {...props} />;
  },
  white(props: TextProps) {
    return <TextWrapper color={'white'} fontWeight={500} {...props} />;
  },
  yellow(props: TextProps) {
    return <TextWrapper color={'yellow1'} fontWeight={500} {...props} />;
  },
};
