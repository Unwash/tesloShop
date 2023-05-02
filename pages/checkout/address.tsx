import { ShopLayout } from "@/components/layouts"
import { Box, Button, FormControl, Grid,  MenuItem, Select, TextField, Typography } from "@mui/material"

 const AddressPage = () => {
  return (
    <ShopLayout title="Dirección" pageDescription="Confirmar dirección del destino" >
        <>
        <Typography variant="h1" component="h1">Dirección</Typography>

        <Grid container spacing={2} sx={{mt:2}}>
            <Grid item xs={12} sm={6} >
                    <TextField label="Nombre" variant="filled" fullWidth /> 
            </Grid>

            <Grid item xs={12} sm={6} >
                    <TextField label="Apellido" variant="filled" fullWidth /> 
            </Grid>

            <Grid item xs={12} sm={6} >
                    <TextField label="Direccion" variant="filled" fullWidth /> 
            </Grid>

            <Grid item xs={12} sm={6} >
                    <TextField label="Direccion 2 (opcional)" variant="filled" fullWidth /> 
            </Grid>

            <Grid item xs={12} sm={6} >
                    <FormControl fullWidth >
                        <Select variant="filled" label="pais" value={1}>
                            <MenuItem value={1}>Costa Rica</MenuItem>
                            <MenuItem value={2}>Honduras</MenuItem>
                            <MenuItem value={3}>El salvador</MenuItem>
                            <MenuItem value={4}>México</MenuItem>
                        </Select>
                        </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} >
                    <TextField label="Teléfono" variant="filled" fullWidth /> 
            </Grid>

            <Box sx={{mt:5}}  display="flex" justifyContent="center" width="100%">
                <Button color="secondary" className="circular-btn" size="large">
                    Revisar pedido
                </Button>
            </Box>
            
        </Grid>
        </>
    </ShopLayout>
  )
}

export default AddressPage
