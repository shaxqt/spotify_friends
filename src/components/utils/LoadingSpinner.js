import React from 'react'
import styled from 'styled-components'
import { ScaleLoader } from 'react-spinners'

export default function LoadingSpinner({ height }) {
  return (
    <CenterStyled height={height}>
      <ScaleLoader color={'#1DB954'} />
    </CenterStyled>
  )
}
const CenterStyled = styled.div`
  ${({ height }) => (height ? 'height: ' + height + ';' : 'position: fixed;')}
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`
