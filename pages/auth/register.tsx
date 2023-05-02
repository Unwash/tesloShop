import { AuthLayout } from "@/components/layouts"
import { Box, Button, Grid, TextField, Typography, Link } from "@mui/material"
import NextLink from "next/link"

const RegisterPage = () => {
  return (
    <AuthLayout title="Ingresar">
        <Box sx={{width:350, padding:"10px 20px"}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h1" component="h1">Crear cuenta</Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Nombre completo" variant="filled" fullWidth />
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Correo" variant="filled" fullWidth />
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Contraseña" type="Password" variant="filled" fullWidth />
                </Grid>

                <Grid item xs={12}>
                   <Button color="secondary" className="circular-btn" size="large" fullWidth>
                    Ingresar
                   </Button>
                </Grid>

                <Grid item xs={12}>
                   <NextLink href="/auth/login" passHref legacyBehavior>
                    <Link underline="always" display="flex" justifyContent="flex-end">
                        ¿ya tienes una cuenta?
                    </Link>
                   </NextLink>
                </Grid>

            </Grid>
        </Box>
    </AuthLayout>
  )
}

export default RegisterPage