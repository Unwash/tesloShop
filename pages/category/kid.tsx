
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { useProducts } from '@/hooks';
import { Typography } from '@mui/material';
import { FullScreenLoading } from '@/components/ui';
import { ProductList } from '@/components/products';
import { IProduct } from '@/interfaces';

const KidsPage = () => {
    const {products,isLoading} = useProducts("/products?gender=kid")
  return (
    <ShopLayout title='Teslo-shop - kids' pageDescription='Articulos para niño'>
         <>
        <Typography variant="h1" component="h1" >Tienda</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>
        {isLoading ? <FullScreenLoading /> :  <ProductList products={ products as IProduct[]} /> }
      </>
    </ShopLayout>
  )
}

export default KidsPage