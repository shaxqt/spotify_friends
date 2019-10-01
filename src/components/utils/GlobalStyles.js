import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
*, *:before, *:after {
  box-sizing: border-box;
}
    body {
        padding: 0;
        background-color: #222;
        color: #eee;
    }
    #root {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        font-family: 'Roboto', sans-serif;
        color: #eee;
    }
    h1, h2, h3, h4, h5, p {
        margin: 0;
    }
`

export default GlobalStyle
