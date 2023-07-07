import { ShopLayout } from "@/components/layouts"
import { Box, Button, Card, Divider, Grid, Typography, Link, CardContent } from "@mui/material"
import { CartList, OrderSumary } from "@/components/cart"
import NextLink from "next/link"
import { useContext, useEffect } from "react"
import { CartContext } from "@/context"
import { countries } from "@/utils/countries"
import Cookies from "js-cookie"
import { useRouter } from "next/router"

const SummaryPage = () => {

    const router = useRouter()

    const {shippingAddress} = useContext(CartContext)

    useEffect(()=>{
        if(!Cookies.get("firstName")){
            router.push("/checkout/address")
        }
    },[])

    if(!shippingAddress) return <></>

    const {firstName,lastName,address,address2="",city,zip,country} = shippingAddress
    
    return (
        <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden" >
            <>
                <Typography variant="h1" component="h1" >Resumen de la orden</Typography>
                <Grid container >
                    <Grid item xs={12} sm={7} >
                        <CartList />
                    </Grid>
                    <Grid item xs={12} sm={5} >
                        <Card className="summary-card" >
                        <CardContent>
                            <Typography variant="h2">Resumen (3 productos)</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle1">
                                Dirección de entrega
                            </Typography>
                                <NextLink href="/checkout/address" passHref legacyBehavior>
                                    <Link underline="always">
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>
 
                            <Typography >
                                {`${firstName} ${lastName}`}
                            </Typography>

                            <Typography >
                                {address} {address2 ? address2 : ''}
                            </Typography>

                            <Typography >
                               {city} {zip}
                            </Typography>

                            <Typography > 
                                {countries.find((c)=> c.code === country)?.name }
                                
                                
                            </Typography>

                            <Typography >
                                {shippingAddress.phone}
                            </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="flex-end">
                                <NextLink href="/cart" passHref legacyBehavior>
                                    <Link underline="always">
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>                        <OrderSumary />

                            <Box sx={{ mt: 3 }}>
                                <Button color="secondary" className="circular-btn" fullWidth>
                                    Confirmar Orden
                                </Button>
                            </Box>
                            </CardContent>
                        </Card>
                        
                    </Grid>
                </Grid>
            </>
        </ShopLayout>
    )
}

export default SummaryPage
