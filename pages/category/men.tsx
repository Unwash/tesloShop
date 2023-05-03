
import { useProducts } from '@/hooks';
import { Typography } from '@mui/material';
import { FullScreenLoading } from '@/components/ui';
import { ProductList } from '@/components/products';
import { IProduct } from '@/interfaces';
import { ShopLayout } from '@/components/layouts';

const MensPage = () => {
    const {products,isLoading} = useProducts("/products?gender=men")
  return (
    <ShopLayout title='Teslo-shop - Men' pageDescription='Articulos para hombre'>
         <>
        <Typography variant="h1" component="h1" >Tienda</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>
        {isLoading ? <FullScreenLoading /> :  <ProductList products={ products as IProduct[]} /> }
      </>
    </ShopLayout>
  )
}

export default MensPage