import { Grid, Typography } from "@mui/material"


export const OrderSumary = () => {
  return (
    <Grid container>
        <Grid item xs={6}>
                <Typography>No. Productos</Typography>
        </Grid>

        <Grid item xs={6} display="flex" justifyContent="end">
                <Typography>3 items</Typography>
        </Grid>
        
        <Grid item xs={6}>
                <Typography>SubTotal</Typography>
        </Grid>

        <Grid item xs={6} display="flex" justifyContent="end">
                <Typography>{`$${156.36}`}</Typography>
        </Grid>

        <Grid item xs={6}>
                <Typography>impuestos (15%)</Typography>
        </Grid>

        <Grid item xs={6} display="flex" justifyContent="end">
                <Typography>{`$${35.34}`}</Typography>
        </Grid>

        <Grid item xs={6} sx={{mt:2}}>
                <Typography variant="subtitle1">Total:</Typography>
        </Grid>

        <Grid item xs={6} sx={{mt:2}} display="flex" justifyContent="end">
                <Typography variant="subtitle1">{`$${191.70}`}</Typography>
        </Grid>
    </Grid>
  )
}