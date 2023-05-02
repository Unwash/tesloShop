import { ShopLayout } from "@/components/layouts"
import { RemoveShoppingCartOutlined } from "@mui/icons-material"
import { Box, Typography,Link } from "@mui/material"
import NextLink from "next/link"

export const EmptyPage = () => {
    return (
        <ShopLayout title="Carrito vacio" pageDescription="No hay articulos en el carrito de compras" >
            <Box display="flex" justifyContent="center" height="calc(100vh - 200px)" alignItems="center" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
                <RemoveShoppingCartOutlined sx={{fontSize:100}} />
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography >Su carrito está vacio</Typography>
                    <NextLink href="/" passHref legacyBehavior >
                        <Link typography="h4" color="secondary">
                        Regresar
                        </Link>
                    </NextLink>
              </Box>
            </Box>
        </ShopLayout>
    )
}

export default EmptyPage