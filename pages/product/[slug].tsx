import { ShopLayout } from "@/components/layouts"
import { ProductSlideShow, SizeSelector } from "@/components/products"
import { ItemCounter } from "@/components/ui"
import { dbProducts } from "@/database"
import { IProduct } from "@/interfaces"
import { Box, Button, Chip, Grid, Typography } from "@mui/material"
import { GetStaticProps, NextPage, GetStaticPaths } from "next"
import { useRouter } from 'next/router';


interface Props {
  product:IProduct
}


export const ProductPage : NextPage <Props> = ({product}) => {

    // const {query} =  useRouter()

    // const {products:product,isLoading} = useProducts(`/products/${query.slug}`)

    // if(isLoading) return <h1>Cargando...</h1>

    // if(!product) return <h1>No existe producto</h1>


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

          <Box sx={{my:2}}>
            <Typography variant="subtitle2">Cantidad</Typography>
            <ItemCounter />
            <SizeSelector sizes={product.sizes} 
            // selectedSize={product.sizes[0]} 
             />
          </Box>

          <Button color="secondary" className="circular-btn">
            Agregar al carrito
          </Button>

          {/* <Chip label="No hay disponibles" color="error" variant="outlined" /> */}

          <Box
          sx={{mt:3}}
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


    const  productSlugs = await  dbProducts.getAllProductsBySlug()

    return {
      paths: productSlugs.map(({slug})=>({
        params:{
          slug 
        }
      })),
      fallback: "blocking",
      
    }
  }


export const getStaticProps: GetStaticProps = async ({params}) => {
  const {slug = ""} = params as {slug:string}
  const product  = await  dbProducts.getProductBySlug(slug)

    if(!product) return {
      redirect:{
        destination:"/",
        permanent:false
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