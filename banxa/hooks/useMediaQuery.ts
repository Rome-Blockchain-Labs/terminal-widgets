import { useMediaQuery } from 'react-responsive'

export const useResponsive = () => {
  const wg = useMediaQuery({ query: '(min-width: 430px)' })

  return {
    wg,
  }
}
