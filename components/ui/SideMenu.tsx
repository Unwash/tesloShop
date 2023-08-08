import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';
import { useContext, useState } from "react"
import { AuthContext, UiContext } from "@/context"
import { useRouter } from 'next/router';


export const SideMenu = () => {

    const { isMenuOpen,toogleSideMenu } = useContext(UiContext)
    const { user,isLoggedIn,logOutUser } = useContext(AuthContext)
    const router = useRouter()

    const [searchTerm, setSearchTerm] = useState("")


    const onSearchTerm = () =>{
        if(searchTerm.trim().length < 1) return;
        navigateTo(`/search/${searchTerm}`)
    }

    const handleLogOut = ()=>{
        logOutUser()
    }

    const navigateTo = (url: string) => {
        router.push(url)
        toogleSideMenu()
    }


    return (
        <Drawer
            open={isMenuOpen}
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
            onBackdropClick={toogleSideMenu}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>

                <List>

                    <ListItem>
                        <Input
                            autoFocus
                            value={searchTerm}
                            onKeyPress={(e)=>e.key === "Enter" ? onSearchTerm() : ""}
                            type='text'
                            onChange={(e)=>setSearchTerm(e.target.value)}
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={onSearchTerm}
                                        aria-label="toggle password visibility"
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    <ListItem button sx={{ display: isLoggedIn ? '' : 'none' }}>
                        <ListItemIcon>
                            <AccountCircleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Perfil'} />
                    </ListItem>

                    <ListItem button sx={{ display: isLoggedIn ? '' : 'none' }} onClick={()=>navigateTo("/orders/history")}>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mis Ordenes'} />
                    </ListItem>


                    <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <MaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} onClick={()=>navigateTo("/category/men")} />
                    </ListItem>

                    <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <FemaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} onClick={()=>navigateTo("/category/women")} />
                    </ListItem>

                    <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <EscalatorWarningOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} onClick={()=>navigateTo("/category/kid")} />
                    </ListItem>


                    <ListItem button sx={{ display: isLoggedIn ? 'none' : '' }} onClick={()=>navigateTo(`/auth/login?p=${router.asPath}`)} >
                        <ListItemIcon>
                            <VpnKeyOutlined />
                        </ListItemIcon>
                        <ListItemText  primary={'Ingresar'} />
                    </ListItem>

                    <ListItem button sx={{ display: isLoggedIn ? '' : 'none' }} > 
                        <ListItemIcon>
                            <LoginOutlined />
                        </ListItemIcon>
                        <ListItemText onClick={handleLogOut} primary={'Salir'} />
                    </ListItem>


                    {/* Admin */}
                    <Box sx={{ display: user?.role === "admin" ? '' : 'none' }} >
                    <Divider />
                    <ListSubheader >Admin Panel</ListSubheader>

                    <ListItem button onClick={()=>navigateTo(`/admin`)}>
                        <ListItemIcon>
                            <DashboardOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Dashboard'} />
                    </ListItem>

                    <ListItem button onClick={()=>navigateTo(`/admin/products`)}> 
                        <ListItemIcon>
                            <CategoryOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Productos'} />
                    </ListItem>

                    <ListItem button onClick={()=>navigateTo(`/admin/orders`)}> 
                        <ListItemIcon>
                            <ConfirmationNumberOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Ordenes'} />
                    </ListItem>

                    <ListItem button onClick={()=>navigateTo(`/admin/users`)}>
                        <ListItemIcon>
                            <AdminPanelSettings />
                        </ListItemIcon>
                        <ListItemText primary={'Usuarios'} />
                    </ListItem>


                    </Box>
                </List>
            </Box>
        </Drawer>
    )
}