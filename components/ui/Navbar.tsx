import { CartContext, UiContext } from "@/context"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material"
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useContext, useState } from "react"


export const Navbar = () => {

    const { toogleSideMenu } = useContext(UiContext)

    const { numberOfItems } = useContext(CartContext)

    const {cart} = useContext(CartContext)

    const { asPath, push } = useRouter()

    const [searchTerm, setSearchTerm] = useState("")

    const [isSearchVisible, setisSearchVisible] = useState(false)


    const onSearchTerm = () => {
        if (searchTerm.trim().length < 1) return;
        push(`/search/${searchTerm}`)
    }

  


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

                <Box  sx={{ display: isSearchVisible ? "none" : { xs: "none", sm: "block" } }} className="fadeIn" >
                    <NextLink href="/category/men" passHref legacyBehavior>
                        <Link>
                            <Button color={asPath === '/category/men' ? "primary" : "info"}  >Hombres</Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/women" passHref legacyBehavior>
                        <Link>
                            <Button color={asPath === '/category/women' ? "primary" : "info"} >Mujeres</Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/kid" passHref legacyBehavior>
                        <Link>
                            <Button color={asPath === '/category/kid' ? "primary" : "info"} >Niños</Button>
                        </Link>
                    </NextLink>
                </Box>

                <Box flex={1} />
                {/* PANTALLAS GRANDES */}
              

                {
                    isSearchVisible
                    ?(
                        <Input
                        autoFocus
                        className="fadeIn"
                        value={searchTerm}
                        onKeyPress={(e) => e.key === "Enter" ? onSearchTerm() : ""}
                        type='text'
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={onSearchTerm}
                                    aria-label="toggle password visibility"
                                >
                                    <ClearOutlined onClick={()=>setisSearchVisible(false)} />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    )
                    :(
                           <IconButton
                           sx={{ display: { xs: "none", sm: "flex" } }}
                           onClick={()=>setisSearchVisible(true)}
                           className="fadeIn"
                           >
                    <SearchOutlined />
                </IconButton> 
                    )
                }

               


                {/* PANTALLAS PEQUEÑAS */}
                <IconButton
                    sx={{ display: { xs: "flex", sm: "none" } }}
                    onClick={toogleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href="/cart" passHref legacyBehavior>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems  } color="secondary">
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button onClick={toogleSideMenu}>
                    Menu
                </Button>

            </Toolbar>
        </AppBar>
    )
}
