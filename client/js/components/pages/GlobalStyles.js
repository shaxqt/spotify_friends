import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
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

        & > nav {
            background-color: green;
            & > ul {
                display: grid;
                grid-auto-flow: column;
                background-color: yellow;
                height: 100%;
                margin: 0;
                padding: 0;
                & > li {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid black;
                }
            }
        }
    }
`

export default GlobalStyle
