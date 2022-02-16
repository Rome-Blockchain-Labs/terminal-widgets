// import 'react-toastify/dist/ReactToastify.css'

import React, { FC } from 'react'
import { createGlobalStyle } from 'styled-components'
import tw, { GlobalStyles as BaseStyles, theme } from 'twin.macro'

import BenqiTheme from './BenqiTheme'
import RTTheme from './RTTheme'

const CustomStyles = createGlobalStyle`
  body {
    -webkit-tap-highlight-color: ${theme<string>`colors.pink.800`};
    ${tw`font-sans antialiased text-white bg-dark-400`}
  }

  input, button {
    ${tw`outline-none focus:outline-none`}
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
    ${tw`border-2 border-gray-500 border-solid rounded-md bg-dark-900`}
  }

  *::-webkit-scrollbar-corner {
    ${tw`bg-opacity-0`}
  }
`

const GlobalStyles: FC = () => (
  <>
    <BaseStyles />
    <CustomStyles />
    <RTTheme />
    <BenqiTheme />
  </>
)

export default GlobalStyles
// import React from 'react'
// import { createGlobalStyle } from 'styled-components'
// import tw, { theme, GlobalStyles as BaseStyles } from 'twin.macro'

// const CustomStyles = createGlobalStyle`
//   body {
//     -webkit-tap-highlight-color: ${theme`colors.purple.500`};
//     ${tw`antialiased`}
//   }
// `

// const GlobalStyles = () => (
//   <>
//     <BaseStyles />
//     <CustomStyles />
//   </>
// )

// export default GlobalStyles
