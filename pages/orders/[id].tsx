import { ShopLayout } from "@/components/layouts"
import { Box, Card, Divider, Grid, Typography, Link, CardContent, Chip } from "@mui/material"
import { CartList, OrderSumary } from "@/components/cart"
import NextLink from "next/link"
import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material"

const OrderPage = () => {
    return (
        <ShopLayout title="Resumen de orden 213213" pageDescription="Resumen de la orden" >
            <>
                <Typography variant="h1" component="h1" >Orden: ABC123 </Typography>

                {/* <Chip 
                        sx={{my:2}}
                        label="Pendiente de pago"
                        variant="outlined"
                        color="error"
                        icon={<CreditCardOffOutlined />}
                    
                    /> */}

                <Chip
                    sx={{ my: 2 }}
                    label="Orden ya fue pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}

                />

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
                                    Cesar Millan
                                </Typography>

                                <Typography >
                                    adsdasdds
                                </Typography>

                                <Typography >
                                    Polly
                                </Typography>

                                <Typography >
                                    Mexico
                                </Typography>

                                <Typography >
                                    +52 6672027152
                                </Typography>

                                <Divider sx={{ my: 1 }} />

                                <Box display="flex" justifyContent="flex-end">
                                    <NextLink href="/cart" passHref legacyBehavior>
                                        <Link underline="always">
                                            Editar
                                        </Link>
                                    </NextLink>
                                </Box>

                                <OrderSumary />

                                <Box sx={{ mt: 3 }}>

                                    <h1>Pagar</h1>

                                    <Chip
                                        sx={{ my: 2 }}
                                        label="Orden ya fue pagada"
                                        variant="outlined"
                                        color="success"
                                        icon={<CreditScoreOutlined />}

                                    />

                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </>
        </ShopLayout>
    )
}

export default OrderPage