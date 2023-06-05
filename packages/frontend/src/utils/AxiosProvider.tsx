import React, {useLayoutEffect} from "react"
import axios from "axios"
import {enqueueSnackbar} from "notistack";
import {useNavigate} from "react-router";
import {Box} from "@mui/material";

type tProps = {
    children: any
}
export default function ({children}: tProps) {
    const navigate = useNavigate()
    useLayoutEffect(() => {
        // request 拦截器
        const requestInterceptor = axios.interceptors.request.use(function (config) {
            return config
        })
        // response 拦截器
        const responseInterceptor = axios.interceptors.response.use(
            // 2xx 范围内的状态码都会触发该函数。
            function (response) {
                return response.data
            },
            // 超出 2xx 范围的状态码都会触发该函数。
            function (error) {
                switch (error.response.status) {
                    case 401:
                        enqueueSnackbar("登录超时，请重新登录", {
                            variant: "error",
                        })
                        navigate("/login")
                        break
                    default:
                        enqueueSnackbar(<Box>
                            <Box>{error.message}</Box>
                            <Box>{error?.response?.data?.message}</Box>
                        </Box>, {variant: "error"})
                }
                throw new Error(error)
            }
        )
        return () => {
            // 注销拦截器
            axios.interceptors.request.eject(requestInterceptor)
            axios.interceptors.response.eject(responseInterceptor)
        }
    }, [])
    return children
}
