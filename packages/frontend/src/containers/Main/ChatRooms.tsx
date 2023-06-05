import {
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack, TextField
} from "@mui/material";
import React from "react";
import Header from "./Header";
import {bindDialog, usePopupState} from "material-ui-popup-state/hooks";
import {useForm} from "react-hook-form";
import { useNavigate } from "react-router";

type tForm = {
    roomName: string
}

export default function () {
    const navigate = useNavigate()
    const {register, handleSubmit} = useForm<tForm>()
    const popupState = usePopupState({variant: 'dialog'})
    const onCreateRoom = handleSubmit(data => {
        console.log(data)
    })
    const onEnterRoom = (id: string) => {
        navigate("/main/chatrooms/" + id)
    }
    return <Stack sx={{flex: 1}}>
        <Header title={"聊天室"}/>
        <Stack sx={{flex: 1, p: 2}}>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <Card sx={{minWidth: 300, p: 1}} variant={"outlined"}>
                        <CardHeader
                            title={"创建房间"}
                        />
                        <CardActions>
                            <Button size="small" variant={"contained"} disableElevation color={"primary"}
                                    onClick={popupState.open}>创建</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{minWidth: 300, p: 1}} variant={"outlined"}>
                        <CardHeader
                            title={"聊天1"}
                        />
                        <CardActions>
                            <Button
                                size="small"
                                variant={"contained"}
                                disableElevation
                                color={"secondary"}
                                onClick={() => {
                                    onEnterRoom("1")
                                }}
                            >进入</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
        <Dialog {...bindDialog(popupState)}>
            <DialogTitle>
                创建房间
            </DialogTitle>
            <DialogContent>
                <TextField
                    label={"房间名"}
                    placeholder={"请输入房间名"}
                    margin={"dense"}
                    {...register("roomName", {
                            required: {
                                value: true,
                                message: "必填项"
                            }
                        }
                    )}
                    sx={{minWidth: 280}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={popupState.close}>取消</Button>
                <Button onClick={onCreateRoom} autoFocus>
                    确认
                </Button>
            </DialogActions>
        </Dialog>
    </Stack>
}