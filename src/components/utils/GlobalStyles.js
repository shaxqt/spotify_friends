import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    *, *::before, *::after {
    box-sizing: border-box;
    }
    body {
        margin: 0;
        padding: 0;
        background-color: #222;
        color: #fff;
        font-family: 'Roboto', sans-serif;
    }
    #root {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: grid;
        grid-auto-rows: auto 45px;
    }
*::-webkit-scrollbar-track {
    border-radius: 5px;
    background-color: #222;
  }

  *::-webkit-scrollbar {
    width: 10px;
    background-color: #222;
    height: 10px;
  }

  *::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #555;
  }
`

export default GlobalStyle
