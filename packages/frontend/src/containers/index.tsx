import React from "react"
import {Navigate, Route, Routes} from "react-router-dom"
import Index from "./Login"
import Main from "./Main"

function App() {
    return (
        <Routes>
            <Route path={"/"}>
                <Route index element={<Navigate to={"/login"} />} />
                <Route path={"login"} element={<Index />} />
                <Route path={"main"} element={<Main />} />
            </Route>
        </Routes>
    )
}

export default App
