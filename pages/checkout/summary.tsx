import { ShopLayout } from "@/components/layouts"
import { Box, Button, Card, Divider, Grid, Typography, Link, CardContent } from "@mui/material"
import { CartList, OrderSumary } from "@/components/cart"
import NextLink from "next/link"

const SummaryPage = () => {
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
