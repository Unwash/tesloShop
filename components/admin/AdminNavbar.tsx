import {  UiContext } from "@/context"
import {   ShoppingCartOutlined } from "@mui/icons-material"
import { AppBar, Badge, Box, Button, IconButton, Link, Toolbar, Typography } from "@mui/material"
import NextLink from "next/link"
import { useContext, useState } from "react"


export const AdminNavbar = () => {

    const { toogleSideMenu } = useContext(UiContext)


    return (
        <AppBar>
            <Toolbar>
                <NextLink href="/" passHref legacyBehavior>
                    <Link display="flex" alignItems="center" >
                        <Typography variant="h6">
                            Teslo |
                        </Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1} />

                <Button onClick={toogleSideMenu}>
                    Menu
                </Button>

            </Toolbar>
        </AppBar>
    )
}
