import { ShopLayout } from "@/components/layouts"
import { ProductSlideShow, SizeSelector } from "@/components/products"
import { ItemCounter } from "@/components/ui"
import { CartContext } from "@/context"
import { dbProducts } from "@/database"
import { IProduct, ICartProduct, ISize } from "@/interfaces"
import { Box, Button, Chip, Grid, Typography } from "@mui/material"
import { GetStaticProps, NextPage, GetStaticPaths } from "next"
import { useRouter } from "next/router"
import { useState, useContext } from 'react';


interface Props {
  product: IProduct
}


export const ProductPage: NextPage<Props> = ({ product }) => {

  // const {query} =  useRouter()

  // const {products:product,isLoading} = useProducts(`/products/${query.slug}`)

  // if(isLoading) return <h1>Cargando...</h1>

  // if(!product) return <h1>No existe producto</h1>

  const {addProductToCart} = useContext(CartContext)

  const router = useRouter()

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  // const [productsInCart, setProductsInCart] = useState(1)

  const updatedQuantity = (quantity:number)=>{
      // setProductsInCart(quantity)
      setTempCartProduct({
        ...tempCartProduct,
        quantity
      })

      

  }

  const getSelectedSize = (size:ISize) =>{
      setTempCartProduct({
        ...tempCartProduct,
        size
      })
  }

  const onAddProduct =()=>{
    // FUNCION DE CONTEXT PARA ALIMENTAR CARRITO
   addProductToCart(tempCartProduct)
   router.push("/cart")
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideShow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column" >

            <Typography variant="h1" component="h1" >{product.title}</Typography>
            <Typography variant="subtitle1" component="h2" >{`$${product.price}`}</Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter currentValue={tempCartProduct.quantity} updatedQuantity={updatedQuantity} maxValue={product.inStock} />
              <SizeSelector sizes={product.sizes} getSelectedSize={getSelectedSize}
              selectedSize={tempCartProduct.size} 
              />
            </Box>
            {
              (product.inStock > 0) ? (
                <Button color="secondary" className="circular-btn" disabled={tempCartProduct.size ? false : true} onClick={onAddProduct}  >
                  {
                    tempCartProduct.size ?  "Agregar al carrito" : "Seleccione una talla"
                  }
                  
                </Button>
              )
                : <Chip label="No hay disponibles" color="error" variant="outlined" />


            }

            <Box
              sx={{ mt: 3 }}
            >
              <Typography variant="subtitle2" >Descripcion</Typography>
              <Typography variant="body2" >{product.description}</Typography>
            </Box>

          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// NO USAR, ES UN EJEMPLO
// export const getServerSideProps:GetServerSideProps = async(ctx) =>{
//   const {slug = ""} = ctx.query

//   const product = await dbProducts.getProductBySlug(`${slug}`)

//   if(!product) return {
//     redirect:{
//       destination:"/",
//       permanent:false
//     }
//   }

//   return{
//     props:{
//       product
//     }
//   }

// } 

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes


export const getStaticPaths: GetStaticPaths = async (ctx) => {


  const productSlugs = await dbProducts.getAllProductsBySlug()

  return {
    paths: productSlugs.map(({ slug }) => ({
      params: {
        slug
      }
    })),
    fallback: "blocking",

  }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string }
  const product = await dbProducts.getProductBySlug(slug)

  if (!product) return {
    redirect: {
      destination: "/",
      permanent: false
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86400
  }
}

export default ProductPage