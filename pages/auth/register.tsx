import { tesloApi } from "@/api"
import { AuthLayout } from "@/components/layouts"
import { AuthContext } from "@/context"
import { isEmail } from "@/utils"
import { ErrorOutline } from "@mui/icons-material"
import { Box, Button, Grid, TextField, Typography, Link, Chip } from "@mui/material"
import { GetServerSideProps } from "next"
import { getSession, signIn } from "next-auth/react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"

type FormData = {
    name:string,
    email:string,
    password:string
}


const RegisterPage = () => {

    const router = useRouter()

    const {registerUser} = useContext(AuthContext)

    const {register,handleSubmit,formState:{errors}} = useForm<FormData>();

    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onRegisterForm = async ({name,email,password}:FormData)=>{
        
        setShowError(false)

        const resp = await registerUser(name,email,password)

        if(resp.hasError){
            setShowError(true)
            setTimeout(()=>setShowError(false),3000)
           return  setErrorMessage(resp.message || '')
        }

        // const destination = router.query.p?.toString() || "/"
        // router.replace(destination)

        await signIn("credentials",{email,password })
        
    }


  return (
    <AuthLayout title="Ingresar">
        <form onSubmit={handleSubmit(onRegisterForm)}>
        <Box sx={{width:350, padding:"10px 20px"}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h1" component="h1">Crear cuenta</Typography>
                    <Chip
                    label="No fue posible registrarse"
                    color="error"
                    icon={<ErrorOutline/>}
                    className="fade-in"
                    sx={showError ? {display:"flex"} : {display:"none"} }
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Nombre completo" variant="filled" fullWidth 
                      {...register("name",{
                        required:"Este campo es requerido",
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Correo" variant="filled" fullWidth type="email"
                      {...register("email",{
                        required:"Este campo es requerido",
                        validate:isEmail
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    />
                    
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Contraseña" type="Password" variant="filled" fullWidth
                     {...register("password",{
                        required:"Este campo es requerido",
                        minLength:{value:6,message:"Minimo 6 caracteres"}
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    />
                </Grid>

                <Grid item xs={12}>
                   <Button type="submit" color="secondary" className="circular-btn" size="large" fullWidth>
                    Ingresar
                   </Button>
                </Grid>

                <Grid item xs={12}>
                   <NextLink href={`/auth/login${ router.query.p ? ('?p='+router.query.p) :'' }`} passHref legacyBehavior>
                    <Link underline="always" display="flex" justifyContent="flex-end">
                        ¿ya tienes una cuenta?
                    </Link>
                   </NextLink>
                </Grid>

            </Grid>
        </Box>
        </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({req,query}) => {
    const session = await getSession({req})

    const { p = "/" } = query

    if(session){
        return{
            redirect:{
                destination:p.toString(),
                permanent:false
            }
        }
    }

    return {
        props: {
            
        }
    }
}



export default RegisterPage