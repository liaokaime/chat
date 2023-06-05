import {Box, Stack} from "@mui/material";
import React from "react";
import Header from "./Header";

export default function (){
    return <Stack sx={{flex: 1}}>
        <Header title={"用户信息"}/>
        <Box>用户信息</Box>
    </Stack>
}