import React from 'react';
import { Text, TextProps } from 'rebass';
import styled, {
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider,
} from 'styled-components';

import { Colors } from './styled';

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToLarge: 1280,
  upToMedium: 960,
  upToSmall: 600,
};

const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css;
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  (accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `;
  return accumulator;
}, {}) as any;

const white = '#FFFFFF';
const black = '#000000';

export function colors(darkMode: boolean): Colors {
  return {
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

    // backgrounds / greys
    bg1: darkMode ? '#212429' : '#FFFFFF',

    bg2: darkMode ? '#2C2F36' : '#F7F8FA',

    bg3: darkMode ? '#40444F' : '#EDEEF2',

    bg4: darkMode ? '#565A69' : '#CED0D9',

    bg5: darkMode ? '#6C7284' : '#888D9B',

    black,

    green1: '#27AE60',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',

    //primary colors
    primary1: darkMode ? '#2172E5' : '#ff007a',

    primary2: darkMode ? '#3680E7' : '#FF8CC3',

    primary3: darkMode ? '#4D8FEA' : '#FF99C9',

    primary4: darkMode ? '#376bad70' : '#F6DDE8',

    primary5: darkMode ? '#153d6f70' : '#FDEAF1',

    // color text
    primaryText1: darkMode ? '#6da8ff' : '#ff007a',

    // other
    red1: '#FF6871',

    red2: '#F82D3A',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#ff007a',

    secondary2: darkMode ? '#17000b26' : '#F6DDE8',

    secondary3: darkMode ? '#17000b26' : '#FDEAF1',

    // text
    text1: darkMode ? '#FFFFFF' : '#000000',

    text2: darkMode ? '#C3C5CB' : '#565A69',

    text3: darkMode ? '#6C7284' : '#888D9B',

    text4: darkMode ? '#565A69' : '#C3C5CB',

    text5: darkMode ? '#2C2F36' : '#EDEEF2',
    // base
    white,
    yellow1: '#FFE270',
    yellow2: '#F3841E',

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
  };
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,

    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,

    grids: {
      lg: 24,
      md: 12,
      sm: 8,
    },

    // media queries
    mediaWidth: mediaWidthTemplates,
    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',
  } as any;
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyledComponentsThemeProvider theme={theme(true)}>
      {children}
    </StyledComponentsThemeProvider>
  );
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`;

export const TYPE = {
  black(props: TextProps) {
    return <TextWrapper color={'text1'} fontWeight={500} {...props} />;
  },
  blue(props: TextProps) {
    return <TextWrapper color={'primary1'} fontWeight={500} {...props} />;
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
  largeHeader(props: TextProps) {
    return <TextWrapper fontSize={24} fontWeight={600} {...props} />;
  },
  link(props: TextProps) {
    return <TextWrapper color={'primary1'} fontWeight={500} {...props} />;
  },
  main(props: TextProps) {
    return <TextWrapper color={'text2'} fontWeight={500} {...props} />;
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontSize={20} fontWeight={500} {...props} />;
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontSize={14} fontWeight={400} {...props} />;
  },
  yellow(props: TextProps) {
    return <TextWrapper color={'yellow1'} fontWeight={500} {...props} />;
  },
};
