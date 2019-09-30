import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
*, *:before, *:after {
  box-sizing: border-box;
}
    body {
        padding: 0;
        background-color: #222;

    }
    #root {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        font-family: 'Roboto', sans-serif;
    }
`

export default GlobalStyle
