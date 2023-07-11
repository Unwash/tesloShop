import { CartContext } from "@/context";
import { Grid, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { format } from "../../utils/currency";
import { IOrder } from "@/interfaces";
import { NextPage } from "next";

interface Props {
  order?: IOrder;
}

export const OrderSumary: NextPage<Props> = ({ order }) => {
 
  const {numberOfItems,tax,subTotal,total} = order ? order : useContext(CartContext);

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>

      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {numberOfItems} {numberOfItems === 1 ? "item" : "items"}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>

      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{format(subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>
          impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 || 0}%){" "}
        </Typography>
      </Grid>

      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{format(tax)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total:</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }} display="flex" justifyContent="end">
        <Typography variant="subtitle1">{format(total)}</Typography>
      </Grid>
    </Grid>
  );
};
