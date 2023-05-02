import { ShopLayout } from '@/components/layouts'
import { Chip, Grid, Typography, Link } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import NextLink from 'next/link'


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
{field:"Orden",headerName:"Detalle de orden",description:"Muestra la orden en detalle", width:200, sortable:false, renderCell:(params:GridRenderCellParams)=>{
  return (
    <NextLink href={`/orders/${params.row.id}`} passHref legacyBehavior>
        <Link underline='always'>
        Orden: {params.row.id}
        </Link>
    </NextLink>

  )
    }}
]

const rows = [
    {id:1, paid: true ,fullname:"Cesar Millan"},
    {id:2, false: true ,fullname:"Daniel Saleme"},
    {id:3, paid: true ,fullname:"Paloma lie"},
    {id:4, paid: true ,fullname:"Jorge mascarriatas"},
    {id:5, false: true ,fullname:"Daniel Sandoval"},
    {id:6, paid: true ,fullname:"Maria Rivas"},
    {id:7, paid: true ,fullname:"Macizo Millan"},
    {id:8, false: false ,fullname:"Hera Millan"},
    {id:9, paid: true ,fullname:"Polly Millan"},
    {id:10, paid: true ,fullname:"Zeus Millan"}
]

const historyPage = () => (
    <ShopLayout title="Historial de ordenes" pageDescription='Historial de ordenes de cliente'>
        <>
            <Typography variant="h1" component="h1">Historial de ordenes</Typography>

            <Grid container>
                <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
                {/* pageSize={10} rowsPerPageOptions={[10]}  */}
                    <DataGrid columns={columns} rows={rows} />
                </Grid>
            </Grid>
        </>
    </ShopLayout>
)

export default historyPage