
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material"
import NextLink from "next/link"
import { ItemCounter } from "../ui"
import { FC } from "react"

import { useContext } from "react"
import { CartContext } from "@/context"
import { ICartProduct, IProduct } from "@/interfaces"

interface Props {
    editable?: boolean,
}


export const CartList: FC<Props> = ({ editable = false }) => {

    const { cart: products, updateCartQuantity, removeCartProduct } = useContext(CartContext)

   
    const updatedQuantity = (product:ICartProduct ,quantity:number) =>{
       if(quantity === 1 && product.quantity === 1 ) return 
       product.quantity = quantity
        updateCartQuantity(product)
    }

    


    return (
        <>
            {
                products.map((product) => (
                    <Grid container spacing={2} key={product._id + product.size} sx={{ mb: 1 }} >
                        <Grid item xs={3}>
                            <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
                                <Link>
                                    <CardActionArea>
                                        <CardMedia image={`/products/${product.image}`} component="img" sx={{ borderRadius: "5px" }} />
                                    </CardActionArea>
                                </Link>
                            </NextLink>
                        </Grid>
                        <Grid item xs={7}>
                            <Box display="flex" flexDirection="column">
                                <Typography variant="body1">{product.title}</Typography>
                                <Typography variant="body1">Talla: <strong>{product.size}</strong></Typography>
                                {editable ?
                                    <ItemCounter currentValue={product.quantity} maxValue={10}  updatedQuantity={(quantity)=>updatedQuantity(product,quantity)}/>
                                    : <Typography variant="h5">{product.quantity} {product.quantity === 1 ? "producto" : "productos"}</Typography>
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={2} display="flex" alignItems="center" flexDirection="column">
                            <Typography variant="subtitle1">{`$${product.price}`}
                                {editable &&
                                    <Button variant="text" color="secondary" onClick={()=>removeCartProduct(product)}>
                                        Remover
                                    </Button>
                                }
                            </Typography>
                        </Grid>

                    </Grid>
                ))
            }
        </>
    )
}
