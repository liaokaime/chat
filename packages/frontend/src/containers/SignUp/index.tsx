import React from "react"
import {Box, Button, Card, CardContent, CardHeader, styled, TextField} from "@mui/material"
import {useNavigate} from "react-router"
import {useForm} from "react-hook-form"
import {ErrorMessage} from "@hookform/error-message"
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {enqueueSnackbar} from "notistack";

export default function SignUp() {
    const navigate = useNavigate()
    const {
        register,
        formState: {errors},
        handleSubmit,
        getValues
    } = useForm<Form>()
    const {mutate} = useMutation({
        mutationKey: ["sign-up"],
        mutationFn: (params: unknown) => axios.post("/users/register", params),
        onSuccess: (data) => {
            navigate("/login")
            enqueueSnackbar("注册成功", {variant: "success"})
        }
    })
    const login = handleSubmit((data) => {
        mutate({
            username: data.username,
            email: data.email,
            password: data.password,
        })
    })
    const goBack = () => {
        navigate("/login")
    }
    return (
        <Container>
            <Card sx={{width: 500, p: 2}} variant={"outlined"}>
                <CardHeader
                    title={"创建账号"}
                />
                <CardContent>
                    <TextField
                        {...register("username", {
                            required: {
                                value: true, message: "必填项",
                            },
                            minLength: {value: 6, message: "账号长度不能小于6位"}
                        })}
                        label="账号"
                        variant="outlined"
                        fullWidth
                        error={!!errors.username?.message}
                        helperText={<ErrorMessage errors={errors} name={"username"}/>}
                    />
                    <TextField
                        {...register("email", {
                            required: {value: true, message: "必填项"},
                            pattern: {
                                value: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                                message: "邮箱格式不正确"
                            }
                        })}
                        label="邮箱"
                        variant="outlined"
                        fullWidth
                        sx={{mt: 1.5}}
                        error={!!errors.username?.message}
                        helperText={<ErrorMessage errors={errors} name={"email"}/>}
                    />
                    <TextField
                        {...register("password", {
                            required: {value: true, message: "必填项"},
                            minLength: {value: 6, message: "密码长度不能小于6位"}
                        })}
                        label="密码"
                        variant="outlined"
                        fullWidth
                        sx={{mt: 1.5}}
                        type={"password"}
                        error={!!errors.password?.message}
                        helperText={<ErrorMessage errors={errors} name={"password"}/>}
                    />
                    <TextField
                        {...register("passwordConfirm", {
                            required: {value: true, message: "必填项"},
                            validate: (value) => {
                                return value === "" || value === getValues("password") || "两次输入的密码不一致"
                            }
                        })}
                        label="确认密码"
                        variant="outlined"
                        fullWidth
                        sx={{mt: 1.5}}
                        type={"password"}
                        error={!!errors.password?.message}
                        helperText={<ErrorMessage errors={errors} name={"passwordConfirm"}/>}
                    />
                    <Box sx={{width: "100%", display: "flex", mt: 4}}>
                        <Button onClick={goBack}>返回</Button>
                        <Button
                            sx={{ml: "auto", px: 4}}
                            variant={"contained"}
                            disableElevation
                            onClick={login}
                        >
                            确认注册
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    )
}

const Container = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

type Form = {
    username: string
    email: string
    password: string
    passwordConfirm: string
}
