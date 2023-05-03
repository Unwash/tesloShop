

import { ShopLayout } from '@/components/layouts'
import { ProductList } from '@/components/products'

import { dbProducts } from '@/database'

import { IProduct } from '@/interfaces'
import { Box, Typography } from '@mui/material'

interface Props {
products:IProduct[],
foundProducts:boolean,
searchQuery:string
}

 const  SearchPage : NextPage <Props> = ({products,foundProducts,searchQuery})  => {



  return (
    <ShopLayout title='Teslo - Search ' pageDescription='Encuentra los mejores productos de teslo aqui' >
      <>
        <Typography variant="h1" component="h1" >Buscar producto</Typography>

      {foundProducts 
      ? <Typography variant='h2' sx={{ mb: 1 }} textTransform="capitalize">Término: {searchQuery}</Typography>

        
      : (
        <Box display="flex">
        <Typography variant='h2' sx={{ mb: 1 }}>No se encontro ningun producto </Typography>
        <Typography variant='h2' sx={{ ml: 1 }} color="secondary" textTransform="capitalize">Término: {searchQuery} </Typography>
        </Box>
      )
      }

<ProductList products={ products as any } />

      </>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps, NextPage } from 'next'

export const getServerSideProps: GetServerSideProps = async ({query}) => {

    const {query:searchQuery = ""} = query

    let products = await dbProducts.getProductsBySearch(`${searchQuery}`) // your fetch function here 

    const foundProducts = products.length > 0 ? true : false

    if(!foundProducts){
      // products = await dbProducts.getAllProducts();
      products = await dbProducts.getProductsBySearch(`shirt`)
        }

    if(products.length < 1) return{
      redirect:{
        destination:"/",
        permanent:false
      }
    }
    return {
        props: {
            products,
            foundProducts,
            searchQuery
        }
    }
}

export default SearchPage