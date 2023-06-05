import React from "react"
import {Box, Button, Card, CardContent, CardHeader, IconButton, styled, TextField} from "@mui/material"
import LockIcon from "@mui/icons-material/Lock"
import {useNavigate} from "react-router"
import {useForm} from "react-hook-form"
import {ErrorMessage} from "@hookform/error-message"
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {enqueueSnackbar} from "notistack";

export default function Index() {
    const navigate = useNavigate()
    const {
        register,
        formState: {errors},
        handleSubmit
    } = useForm<Form>()
    const {mutate} = useMutation({
        mutationKey: ["login"],
        mutationFn: (params: unknown) => axios.post("/users/login", params),
        onSuccess: (data: any) => {
            navigate("/main")
            enqueueSnackbar("登录成功", {variant: "success"})
        }
    })
    const login = handleSubmit((data) => {
        mutate({
            username: data.account,
            password: data.password,
        })
    })
    const signUp = () => {
        navigate("/sign-up")
    }
    return (
        <Container>
            <Card sx={{minWidth: 300, p: 2}} variant={"outlined"}>
                <CardHeader
                    title={"聊天系统"}
                    action={
                        <IconButton disabled size={"large"}>
                            <LockIcon />
                        </IconButton>
                    }
                />
                <CardContent>
                    <TextField
                        {...register("account", {required: {value: true, message: "必填项"}})}
                        label="账号"
                        variant="outlined"
                        fullWidth
                        error={!!errors.account?.message}
                        helperText={<ErrorMessage errors={errors} name={"account"} />}
                    />
                    <TextField
                        {...register("password", {required: {value: true, message: "必填项"}})}
                        label="密码"
                        variant="outlined"
                        fullWidth
                        sx={{mt: 1.5}}
                        type={"password"}
                        error={!!errors.password?.message}
                        helperText={<ErrorMessage errors={errors} name={"password"} />}
                    />
                    <Box sx={{width: "100%", display: "flex", mt: 4}}>
                        <Button onClick={signUp}>注册账号</Button>
                        <Button
                            sx={{ml: "auto", px: 4}}
                            variant={"contained"}
                            disableElevation
                            onClick={login}
                        >
                            进入
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
    account: string
    password: string
}
