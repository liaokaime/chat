import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type tUser = {
    created_at: string
    email: string
    id: number
    password: string
    updated_at: string
    username: string
}

export const LoginInfoStore = createSlice({
    name: "main",
    initialState: {
        user: {} as tUser
    },
    reducers: {
        setLoginInfo: (state, action: PayloadAction<tUser>) => {
            state.user = action.payload
        },
        clearLoginInfo: (state, action: PayloadAction) => {
            state.user = {} as tUser
        },
    }
})