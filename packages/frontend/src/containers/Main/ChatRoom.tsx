import {Box, Button, Card, CardActions, CardHeader, Grid, Stack} from "@mui/material";
import React from "react";
import Header from "./Header";
import {useParams} from "react-router";


export default function (){
    const {id} = useParams<any>()
    return <Stack sx={{flex: 1}}>
        <Header title={"聊天室（名称）"}/>
        <Box>聊天室内{id}</Box>
    </Stack>
}