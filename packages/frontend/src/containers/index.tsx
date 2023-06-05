import React from "react"
import {Navigate, Route, Routes} from "react-router-dom"
import Index from "./Login"
import SignUp from "./SignUp";
import ChatRooms from "./Main/ChatRooms";
import User from "./Main/User";
import ChatRoom from "./Main/ChatRoom";

function App() {
    return (
        <Routes>
            <Route path={"/"}>
                <Route index element={<Navigate to={"/login"} />} />
                <Route path={"login"} element={<Index />} />
                <Route path={"main"} >
                    <Route index element={<Navigate to={"/main/chatrooms"}/>} />
                    <Route element={<ChatRooms/>} path={"chatrooms"}/>
                    <Route element={<ChatRoom/>} path={"chatrooms/:id"}/>
                    <Route element={<User/>} path={"user"}/>
                </Route>
                <Route path={"sign-up"} element={<SignUp />} />
            </Route>
        </Routes>
    )
}

export default App
