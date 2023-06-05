import {
    AppBar,
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, Stack, TextField,
    Toolbar,
    Typography
} from "@mui/material";
import React, {useEffect} from "react";
import {useRedux} from "../../store";
import {bindDialog, usePopupState} from "material-ui-popup-state/hooks";
import {useForm} from "react-hook-form";
import {LoginInfoStore, tUser} from "../../store/loginInfo";
import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import axios from "axios";
import {useMutation, useQuery} from "@tanstack/react-query";
import {enqueueSnackbar} from "notistack";
import {ErrorMessage} from "@hookform/error-message";

type tProps = {
    title: string
}

type tForm = Pick<tUser, "username" | "password" | "email">

export default function ({title}: tProps) {
    const user = useRedux(state => state.loginInfo.user)
    const {username, password, email, id} = user
    const popupState = usePopupState({variant: 'dialog'})
    const {register, formState: {isDirty, errors}, reset, handleSubmit} = useForm<tForm>()
    useEffect(() => {
        if (popupState.isOpen) {
            reset({
                username,
                password,
                email
            })
        }
    }, [popupState.isOpen])
    const dispatch = useDispatch()
    const {refetch} = useQuery({
        queryKey: ["header", "self"],
        queryFn: () => axios.get("/users/self") as Promise<tUser>,
        onSuccess: (data) => {
            dispatch(LoginInfoStore.actions.setLoginInfo(data))
        },
        retry: false,
        enabled: !id
    })
    const {mutate: queryUpdateUser, isLoading} = useMutation({
        mutationKey: ["header", "update"],
        mutationFn: (data: unknown) => axios.put("/users/" + id, data),
        onSuccess: (data) => {
            refetch()
            enqueueSnackbar("更新成功", {variant: "success"})
            popupState.close()
        }
    })
    const onUpdate = handleSubmit((data) => {
        queryUpdateUser({
            ...user,
            ...data
        })
    })
    return <React.Fragment>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    {title}
                </Typography>
                <IconButton sx={{p: 0}} onClick={popupState.open}>
                    <Avatar>{username?.[0]}</Avatar>
                </IconButton>
            </Toolbar>
        </AppBar>
        <Dialog {...bindDialog(popupState)}>
            <DialogTitle>
                用户信息
            </DialogTitle>
            <DialogContent>
                <Stack sx={{minWidth: 350}} gap={0.5}>
                    <TextField
                        label={"用户名"}
                        margin={"dense"}
                        {...register("username", {
                                required: {
                                    value: true,
                                    message: "必填项"
                                }
                            }
                        )}
                        disabled
                        helperText={<ErrorMessage errors={errors} name={"username"}/>}
                    />
                    <TextField
                        label={"邮箱"}
                        margin={"dense"}
                        {...register("email", {
                                required: {
                                    value: true,
                                    message: "必填项"
                                },
                                pattern: {
                                    value: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                                    message: "邮箱格式不正确"
                                }
                            }
                        )}
                        helperText={<ErrorMessage errors={errors} name={"email"}/>}
                    />
                    <TextField
                        label={"密码"}
                        margin={"dense"}
                        {...register("password", {
                                required: {
                                    value: true,
                                    message: "必填项"
                                }
                            }
                        )}
                        helperText={<ErrorMessage errors={errors} name={"password"}/>}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={popupState.close}>取消</Button>
                <Button onClick={onUpdate} autoFocus disabled={!isDirty || isLoading}>
                    更新
                </Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>
}