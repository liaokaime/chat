import {
    Button,
    Card,
    CardActions,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField
} from "@mui/material";
import React, {useState} from "react";
import Header from "./Header";
import {bindDialog, usePopupState} from "material-ui-popup-state/hooks";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router";
import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import {enqueueSnackbar} from "notistack";
import {useRedux} from "../../store";

type tForm = {
    roomName: string
}
type tChatRoom = {
    "id": number
    "name": string
    "created_at": string
    "updated_at": string
    "creatorId": number
}

export default function () {
    const navigate = useNavigate()
    const {id} = useRedux(state => state.loginInfo.user)
    const {register, handleSubmit, setValue, reset} = useForm<tForm>({
        defaultValues: {
            roomName: ""
        }
    })
    const popupStateCreate = usePopupState({variant: 'dialog'})
    const popupStateUpdate = usePopupState({variant: 'dialog'})
    const {data: chatRooms, refetch} = useQuery({
        queryKey: ["chatRoom"],
        queryFn: () => axios.get("/chatroom") as Promise<tChatRoom[]>
    })
    const {mutate: createChatRoom} = useMutation({
        mutationFn: (params: unknown) => axios.post("/chatroom", params),
        onSuccess: () => {
            enqueueSnackbar("聊天室创建成功", {variant: "success"})
            popupStateCreate.close()
            reset()
            refetch()
        }
    })
    const {mutate: deleteChatRoom} = useMutation({
        mutationKey: ["deleteChatRoom"],
        mutationFn: (id: unknown) => axios.delete(`/chatroom/${id}`),
        onSuccess: () => {
            enqueueSnackbar("删除成功", {variant: "success"})
            refetch()
        }
    })
    const {mutate: updateChatRoom} = useMutation({
        mutationKey: ["updateChatRoom"],
        mutationFn: (params: { id: number, name: string }) => axios.put(`/chatroom/${params.id}`, {name: params.name}),
        onSuccess: () => {
            enqueueSnackbar("更新成功", {variant: "success"})
            popupStateUpdate.close()
            refetch()
        }
    })
    const onCreateRoom = handleSubmit(data => {
        createChatRoom({
            name: data.roomName
        })
    })
    const [roomId, setRoomId] = useState(-1)
    const onUpdateRoom = handleSubmit(data => {
        updateChatRoom({
            id: roomId,
            name: data.roomName
        })
    })
    const onEnterRoom = (id: number) => {
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
                            <Button size="small" variant={"contained"} disableElevation color={"success"}
                                    onClick={() => {
                                        popupStateCreate.open()
                                        setValue("roomName", "")
                                    }}>创建</Button>
                        </CardActions>
                    </Card>
                </Grid>
                {chatRooms?.map(chatroom => {
                    return <Grid item xs={4}>
                        <Card sx={{minWidth: 300, p: 1}} variant={"outlined"}>
                            <CardHeader
                                title={chatroom.name}
                            />
                            <CardActions>
                                <Button
                                    size="small"
                                    variant={"contained"}
                                    disableElevation
                                    onClick={() => {
                                        onEnterRoom(chatroom.id)
                                    }}
                                >进入</Button>
                                {chatroom.creatorId === id && <Button
                                    size="small"
                                    variant={"contained"}
                                    disableElevation
                                    color={"error"}
                                    onClick={() => deleteChatRoom(chatroom.id)}
                                >删除</Button>}
                                {chatroom.creatorId === id && <Button
                                    size="small"
                                    variant={"contained"}
                                    disableElevation
                                    color={"secondary"}
                                    onClick={() => {
                                        popupStateUpdate.open()
                                        setValue("roomName", chatroom.name)
                                        setRoomId(chatroom.id)
                                    }}
                                >编辑</Button>}
                            </CardActions>
                        </Card>
                    </Grid>
                })}
            </Grid>
        </Stack>
        <Dialog {...bindDialog(popupStateCreate)}>
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
                <Button onClick={popupStateCreate.close}>取消</Button>
                <Button onClick={onCreateRoom} autoFocus>
                    确认
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog {...bindDialog(popupStateUpdate)}>
            <DialogTitle>
                更新房间
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
                <Button onClick={popupStateUpdate.close}>取消</Button>
                <Button onClick={onUpdateRoom} autoFocus>
                    更新
                </Button>
            </DialogActions>
        </Dialog>
    </Stack>
}