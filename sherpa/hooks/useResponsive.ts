import { useMediaQuery } from 'react-responsive'

export const useResponsive = () => {
  const sm = useMediaQuery({ query: '(min-width: 640px)' })

  const md = useMediaQuery({ query: '(min-width: 768px)' })
  const lg = useMediaQuery({ query: '(min-width: 768px)' })
  return {
    sm,
    md,
    lg,
  }
}
