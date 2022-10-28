import 'react-toastify/dist/ReactToastify.css';

import React, { FC } from 'react';
import { createGlobalStyle } from 'styled-components';
import tw, { GlobalStyles as BaseStyles, theme } from 'twin.macro';

import BenqiTheme from './BenqiTheme';
import RTTheme from './RTTheme';

const CustomStyles = createGlobalStyle`
  body {
    -webkit-tap-highlight-color: transparent;
    ${tw`antialiased font-sans bg-dark-400 text-white`}
    scrollbar-gutter: stable;
  }

  input, button {
    ${tw`outline-none	focus:outline-none`}
  }

  .rdt_Table .rdt_TableHead {
    .rdt_TableCol_Sortable {
      span.__rdt_custom_sort_icon__ {
        ${tw`ml-1`}

        svg {
          width: auto !important;
          height: auto !important;
        }
      }
    }
  }

  *::-webkit-scrollbar {
    ${tw`w-3 h-3`}
  }

  *::-webkit-scrollbar-track {
    ${tw`bg-gray-500 rounded-lg`}
  }

  *::-webkit-scrollbar-thumb {
    ${tw`bg-dark-900 rounded-md border-2 border-solid border-gray-500`}
  }

  *::-webkit-scrollbar-corner {
    ${tw`bg-opacity-0`}
  }
  
  .dndWidgetToolbar button {
    ${tw`p-1.5`}    
  }  
  .dndWindowAction button {
    ${tw`p-3`}
  }

  .dndDropDown button {
    &:hover {
      * {                
        fill: ${theme<string>`colors.yellow.400`}        
      }
    }
    .mobileMenuTitle {
      ${tw`text-gray-200 mt-4 mb-2 font-bold text-2xl`}
    }
  }

  .widget-enlargement-1 .settingIcon,
  .widget-enlargement-2 .settingIcon {
    ${tw`pl-[0.2rem] pr-0`}
  }
  .widget-enlargement-1 .dndWindowAction button,
  .widget-enlargement-2 .dndWindowAction button {
    ${tw`p-[0.2rem]`}
  }

.introjs-tooltip {
  ${tw`font-sans text-[14px] bg-[#3c4032] max-w-none w-[460px] border border-[#999F89]`}
  font-family: Montserrat !important;

}
.introjs-arrow.left {
  ${tw`hidden!`}
}

.introjs-tooltiptext {
  ${tw`pt-0`}
}

.introjs-button {
  ${tw`font-sans  bg-[#999F89]! hover:bg-[#0C7584] active:text-white!`}
  text-shadow: none;
}
.introjs-button:focus-within {
  ${tw`text-white`}
 
}
.introjs-tooltipReferenceLayer * {
  ${tw`font-sans!`}
}

.introjs-tooltiptext > div > .header {
  ${tw`text-[24px] font-bold `}
}

.introjs-tooltiptext > div > .body {
 ${tw`tracking-wide mt-3 `}
}
.introjs-tooltipbuttons {
  ${tw`border-0!`}
}

.introjs-tooltip-header > a {
  color: #999F89;
}

#faq:hover {
  color: #0056b3 !important;
}

.introjs-disableInteraction {
 ${tw`border-[#3C4032]! opacity-5!`} 
}

.walletconnect-qrcode__image{
  ${tw`w-[40%]! lg:w-[60%]!`}
}

.walletconnect-modal__base{
  ${tw`mt-[5%]! lg:mt-0!`}
}
#walletconnect-qrcode-modal{
  ${tw`overflow-auto`}
}
`;

const GlobalStyles: FC = () => (
  <>
    <BaseStyles />
    <CustomStyles />
    <RTTheme />
    <BenqiTheme />
  </>
);

export default GlobalStyles;
