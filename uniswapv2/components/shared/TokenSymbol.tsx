import 'twin.macro'

import { ReactNode } from 'react'

const TokenSymbol = ({ children }: { children: ReactNode }) => {
  return <span tw="text-xl text-white font-semibold">{children}</span>
}

export default TokenSymbol
