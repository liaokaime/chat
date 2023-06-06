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
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import AxiosProvider from "./utils/AxiosProvider";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
})

function App() {
    return (
        <ReduxProvider store={store}>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <QueryClientProvider client={queryClient}>
                        <AxiosProvider>
                            <SnackbarProvider disableWindowBlurListener={true}>
                                <CssBaseline/>
                                <GlobalCss/>
                                <Container/>
                                <SnackbarProvider/>
                            </SnackbarProvider>
                        </AxiosProvider>
                    </QueryClientProvider>
                </ThemeProvider>
            </BrowserRouter>
        </ReduxProvider>
    );
}

export default App;
