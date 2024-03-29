import { AuthLayout } from "@/components/layouts"
import { Box, Button, Grid, TextField, Typography, Link, Chip, Divider } from "@mui/material"
import NextLink from "next/link"
import { useForm } from "react-hook-form"
import { isEmail } from "@/utils"
import { ErrorOutline } from "@mui/icons-material"
import { useState, useEffect } from 'react';
import { useRouter } from "next/router"
import { getSession, signIn, getProviders } from "next-auth/react"
import { GetServerSideProps } from 'next'
type FormData = {
    email:string,
    password:string
}

const LoginPage = () => {

    const router = useRouter()
    const {register,handleSubmit,formState:{errors}} = useForm<FormData>();

    const [showError, setShowError] = useState(false)

    const [providers, setProviders] = useState<any>({});

    useEffect(()=>{
        getProviders().then((p)=>{
            setProviders(p)
        })
    },[])

    const onLoginUser = async ({email,password}:FormData)=>{
        
        setShowError(false)

        // const isValidLogin = await loginUser(email,password)
        // if(!isValidLogin){
        //     setShowError(true)
        //     setTimeout(()=>setShowError(false),3000)
        //     return console.log("error en credenciales")
        // }

        // const destination = router.query.p?.toString() || "/"
        // router.replace(destination)
     
        await signIn("credentials", {email,password})

    }

  return (
    <AuthLayout title="Ingresar" >
        <form onSubmit={handleSubmit(onLoginUser)}>
        <Box sx={{width:350, padding:"10px 20px"}}> 
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h1" component="h1">Iniciar Sesion</Typography>
                    { showError === true && <Chip
                    label="No reconocemos ese usuario/contraseña"
                    color="error"
                    icon={<ErrorOutline/>}
                    className="fade-in"
                    />}
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Correo" type="email" variant="filled" fullWidth
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
                   <Button color="secondary" className="circular-btn" size="large" fullWidth type="submit">
                    Ingresar
                   </Button>
                </Grid>

                <Grid item xs={12}>
                   <NextLink href={`/auth/register${ router.query.p ? ('?p='+router.query.p) :'' }`} passHref legacyBehavior>
                    <Link underline="always" display="flex" justifyContent="flex-end">
                        ¿No tienes cuenta?
                    </Link>
                   </NextLink>
                </Grid>



                <Grid item xs={12} display="flex" flexDirection="column" justifyContent="end">
                    <Divider sx={{width:"100%",mb:2}} />
                    {
                        Object.values(providers).map((provider:any)=>{

                            if(provider.id === "credentials") return (<div key={"credentials"}></div>)

                            return (
                                <Button
                                key={provider.id}
                                variant="outlined"
                                fullWidth
                                color="primary"
                                sx={{mb:1}}
                                onClick={()=>signIn(provider.id)}
                                >
                                    {provider.name}
                                </Button>
                            )
                        })
                    }
                </Grid>

            </Grid>
        </Box>
        </form>
    </AuthLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


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

export default LoginPage