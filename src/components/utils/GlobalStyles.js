import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    *, *::before, *::after {
    box-sizing: border-box;
    }
    body {
        margin: 0;
        padding: 0;
        background-color: #222;
        color: #eee;
        font-family: 'Roboto', sans-serif;
    }
    #root {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        -color: #eee;
        display: grid;
        grid-auto-rows: auto 45px;
    }
`

export default GlobalStyle
