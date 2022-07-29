import { CSSProp } from 'styled-components';

declare module '@fortawesome/react-fontawesome' {
  declare interface FontAwesomeIconProps {
    css?: CSSProp;
  }
}
