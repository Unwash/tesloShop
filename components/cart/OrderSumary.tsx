import { CartContext } from "@/context"
import { Grid, Typography } from "@mui/material"
import { useContext } from "react"
import {format} from "../../utils/currency"

export const OrderSumary = () => {


        const { numberOfItems, subTotal, impuestos, total } = useContext(CartContext)

        return (
                <Grid container>
                        <Grid item xs={6}>
                                <Typography>No. Productos</Typography>
                        </Grid>

                        <Grid item xs={6} display="flex" justifyContent="end">
                                <Typography>{numberOfItems} {numberOfItems === 1 ?  'item' : 'items'}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                                <Typography>SubTotal</Typography>
                        </Grid>

                        <Grid item xs={6} display="flex" justifyContent="end">
                                <Typography>{format(subTotal)}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                                <Typography>impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE)*100 || 0}%) </Typography>
                        </Grid>

                        <Grid item xs={6} display="flex" justifyContent="end">
                                <Typography>{format(impuestos)}</Typography>
                        </Grid>

                        <Grid item xs={6} sx={{ mt: 2 }}>
                                <Typography variant="subtitle1">Total:</Typography>
                        </Grid>

                        <Grid item xs={6} sx={{ mt: 2 }} display="flex" justifyContent="end">
                                <Typography variant="subtitle1">{format(total)}</Typography>
                        </Grid>
                </Grid>
        )
}
