import React from "react"
import {BrowserRouter} from "react-router-dom"
import {CssBaseline, ThemeProvider} from "@mui/material"
import {Provider as ReduxProvider} from "react-redux"
import {store} from "./store"
import {SnackbarProvider} from "notistack"
import Container from "./containers"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import theme from "./utils/styles/theme"
import GlobalCss from "./utils/styles/GlobalCss"


function App() {
  return (
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <BrowserRouter >
                <CssBaseline />
                <GlobalCss />
                <Container />
            </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </ReduxProvider>
  );
}

export default App;
