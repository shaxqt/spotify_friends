import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
*, *:before, *:after {
  box-sizing: border-box;
}
    body {
        padding: 0
    }
    #app {
        background-color: blue;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: grid;
        grid-template-rows: 50px 1fr 50px;
    }
`

export default GlobalStyle
