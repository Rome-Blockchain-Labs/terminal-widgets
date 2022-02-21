// import 'react-toastify/dist/ReactToastify.css'

import React, { FC } from 'react'
import { createGlobalStyle } from 'styled-components'
import tw, { GlobalStyles as BaseStyles, theme } from 'twin.macro'

// import BenqiTheme from './BenqiTheme'
// import RTTheme from './RTTheme'
const CustomStyles = createGlobalStyle`
  body {
    ${tw`font-sans`}
  }
`
const GlobalStyles: FC = () => (
  <>
    <BaseStyles />
    <CustomStyles />
    {/* <RTTheme /> */}
    {/* <BenqiTheme /> */}
  </>
)

export default GlobalStyles
// import React from 'react'
// import { createGlobalStyle } from 'styled-components'
// import tw, { theme, GlobalStyles as BaseStyles } from 'twin.macro'

// const GlobalStyles = () => (
//   <>
//     <BaseStyles />
//     <CustomStyles />
//   </>
// )

// export default GlobalStyles
