import Logo from 'components/shared/logo'
import useHttpLocations from 'hooks/useHttpLocations'
import React from 'react'
import styled from 'styled-components'

const StyledListLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
`

export default function ListLogo({
  alt,
  logoURI,
  size = '24px',
  style,
}: {
  logoURI: string
  size?: string
  style?: React.CSSProperties
  alt?: string
}) {
  const srcs: string[] = useHttpLocations(logoURI)

  return <StyledListLogo alt={alt} size={size} srcs={srcs} style={style} />
}
