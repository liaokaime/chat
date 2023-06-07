import {Avatar, Box, IconButton, Paper, Stack, TextField, Typography} from "@mui/material";
import React from "react";
import Header from "./Header";
import {useNavigate, useParams} from "react-router";
import SendIcon from '@mui/icons-material/Send';
import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useForm} from "react-hook-form";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

type tMessage = {
    id: number;
    content: string;
    sent_at: string;
    user_id: number;
    chatroom_id: number;
    User: {
        username: string;
    };
    isMine: boolean;
    senderName: string;
};

export default function () {
    const {id} = useParams<any>()
    const navigate = useNavigate()
    const {data: messages} = useQuery({
        queryKey: ["chatroom", id, "messages"],
        queryFn: () => axios.get(`/message/chatrooms/${id}/messages`) as Promise<tMessage[]>,
        refetchInterval: 1000   //轮询
    })
    const {reset, register, handleSubmit} = useForm<{ content: string }>({
        defaultValues: {
            content: ""
        }
    })
    const {mutate: querySendMessage} = useMutation({
        mutationFn: (params: unknown) => {
            return axios.post(`/message/chatrooms/${id}/messages`, params)
        },
        onSuccess: () => {
            reset()
        }
    })

    const onSendMessage = handleSubmit(formData => {
        querySendMessage(formData)
    })
    return <Stack sx={{height: 1, backgroundColor: "#f5f5f5"}}>
        <Header title={"聊天室"} iconButton={
            <IconButton
                color={"inherit"}
                onClick={() => navigate("/main/chatrooms")}
            >
                <NavigateBeforeIcon/>
            </IconButton>}/>
        <Stack sx={{flex: 1, overflow: "auto", px: 2, pt: 2}} gap={1}>
            {messages?.map(message =>
                <MessageItem
                    direction={message.isMine ? "right" : "left"}
                    content={message.content}
                    name={message.User.username}
                    time={message.sent_at}
                />)}
        </Stack>
        <Box p={2}>
            <TextField
                label={"发送消息"}
                fullWidth
                InputProps={{
                    endAdornment: <IconButton onClick={onSendMessage}>
                        <SendIcon/>
                    </IconButton>
                }}
                {...register("content", {
                        required: {
                            value: true,
                            message: "必填项"
                        }
                    }
                )}
            />
        </Box>
    </Stack>
}

function MessageItem({direction = "left", content, time, name}: {
    direction?: "left" | "right",
    content: string,
    time: string,
    name: string
}) {
    const isRight = direction === "right"
    return <Stack direction={isRight ? "row-reverse" : "row"} gap={1}>
        <Avatar>{name?.[0]}</Avatar>
        <Stack sx={{alignItems: isRight ? "end" : "start"}}>
            <Stack direction={isRight ? "row-reverse" : "row"} gap={1}>
                <Typography variant={"caption"}>{name}</Typography>
                <Typography variant={"caption"}>{time}</Typography>
            </Stack>
            <Paper sx={{backgroundColor: isRight ? "#95ec69" : "#fff", p: 1.5}} variant={"outlined"}>
                <Typography
                    variant={"body1"}>{content}</Typography>
            </Paper>
        </Stack>
    </Stack>
}