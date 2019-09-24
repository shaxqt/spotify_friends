import React from 'react'
import styled from 'styled-components'

const Headline = ({ level = 1, children }) => (
  <HeadlineStyled as={`h${level}`} level={level}>
    {children}
  </HeadlineStyled>
)

const HeadlineStyled = styled.div`
  font-size: ${({ level }) => 3 / level}rem;
  font-weight: 300;
  margin: 0;
`

export default Headline
