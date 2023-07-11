import { ShopLayout } from '@/components/layouts'
import { Chip, Grid, Typography, Link } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import NextLink from 'next/link'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { getOrdersByUser } from '@/database/dbOrders'
import { IOrder } from '@/interfaces'

const columns:GridColDef[] = [
{field:"id",headerName:"ID",width:100},
{field:"fullname",headerName:"Nombre Completo",width:300},
{field:"paid",headerName:"Pagada",description:"Muestra informacion si esta pagada la orden o no", width:200, renderCell:(params:GridRenderCellParams)=>{
return(
    params.row.paid 
    ? <Chip color='success' label="Pagada" variant='outlined' />
    : <Chip color='error' label="No pagada" variant='outlined' />
)
}},
{field:"Orden",headerName:"Detalle de orden",description:"Muestra la orden en detalle", width:250, sortable:false, renderCell:(params:GridRenderCellParams)=>{
  return (
    <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
        <Link underline='always'>
        Orden: {params.row.orderId}
        </Link>
    </NextLink>

  )
    }}
]

interface Props {
id:string,
orders:IOrder[]
}

const historyPage: NextPage<Props> = ({id,orders}) =>{

    const rows = orders.map((o,i)=>{
        return {id:i+1,paid:o.isPaid,fullname: `${o.shippingAddress?.firstName || ""} ${o.shippingAddress?.lastName || ""}`, orderId:o._id  }
    })

    return(
    
    <ShopLayout title="Historial de ordenes" pageDescription='Historial de ordenes de cliente'>
        <>
            <Typography variant="h1" component="h1">Historial de ordenes</Typography>

            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
                {/* pageSize={10} rowsPerPageOptions={[10]}  */}
                    <DataGrid columns={columns} rows={rows} />
                </Grid>
            </Grid>
        </>
    </ShopLayout>
    )
}









// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const  session:any = await  getSession({req})

    if(!session){
        return {
            redirect:{
                destination:'auth/login?p=orders/history',
                permanent:false
            }
        }
    }

    const {user} = session
    const orders = await getOrdersByUser(user._id)

    return {
        props: {
            id:user._id,
            orders
        }
    }
}

export default historyPage