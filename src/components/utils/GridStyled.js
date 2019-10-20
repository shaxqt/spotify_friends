import styled from 'styled-components'

export default styled.div`
  display: grid;
  grid-gap: ${({ gap }) => (gap ? gap : '0')};

   ${({ templateColumns }) =>
     templateColumns && 'grid-template-columns: ' + templateColumns + ';'}
     ${({ width }) => width && 'width: ' + width + ';'}
     ${({ templateRows }) =>
       templateRows && 'grid-template-rows: ' + templateRows + ';'}
   ${({ autoFlow }) => autoFlow && 'grid-auto-flow: ' + autoFlow + ';'}
    ${({ stretchHeight }) => stretchHeight && 'height: 100%;'}
    ${({ justifyItems }) =>
      justifyItems && 'justify-items: ' + (justifyItems + ';')}
    ${({ justifyContent }) =>
      justifyContent && 'justify-content: ' + (justifyContent + ';')}
    ${({ alignItems }) => alignItems && 'align-items: ' + (alignItems + ';')}
    ${({ alignContent }) =>
      alignContent && 'align-content: ' + (alignContent + ';')};
`
