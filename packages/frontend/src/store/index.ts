import {configureStore} from "@reduxjs/toolkit"
// import notifier from "./utils/notification/store"
import {useSelector} from "react-redux"
import {combineReducers} from "redux"
import {LoginInfoStore} from "./loginInfo";

const rootReducer = combineReducers({
    loginInfo: LoginInfoStore.reducer
})

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})

export type tRootReducer = ReturnType<typeof rootReducer>

export function useRedux<T>(
    selector: (state: tRootReducer) => T,
    equalityFn?: (left: T, right: T) => boolean
) {
    return useSelector(selector, equalityFn) as ReturnType<typeof selector>
}
