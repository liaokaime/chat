import React from "react"
import {Box, GlobalStyles} from "@mui/material"

type tProps = {}

export default function GlobalCss(props: tProps) {
    return (
        <GlobalStyles
            styles={{
                "html, body, #root": {
                    width: "100%",
                    height: "100%"
                }
            }}
        />
    )
}
