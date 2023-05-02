import { ShopLayout } from "@/components/layouts"
import { Box, Typography } from '@mui/material';


export const Custom404 = () => {
  return (
    <ShopLayout title="Page not found" pageDescription="No hay nada que mostrar aqui">
       <Box display="flex" justifyContent="center" height="calc(100vh - 200px)" alignItems="center"  sx={{ flexDirection: {xs:"column", sm:"row" } }}>
        <Typography  variant="h1" component="h1" fontSize={80} fontWeight={200}> 404 | </Typography>
        <Typography marginLeft={2}>No se encontro ninguna pagina aqui</Typography>
       </Box>
    </ShopLayout>
  )
}

export default Custom404