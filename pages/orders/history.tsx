import NextLink from "next/link";
import { ShopLayout } from '@/components/layouts'
import { Chip, Grid, Link, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid/models'

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width:100 },
    { field: 'fullName', headerName: 'Nombre completo', width:300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description:'Muestra información de la ordens, si esta pagada o no',
        width:200,
        renderCell: (params: GridRenderCellParams) => {
            return (
                params.row.paid
                    ? <Chip color='success' label='pagada' variant='outlined'/>
                    : <Chip color='error' label='no pagada' variant='outlined'/>
            )
        }
    },
    {
        field: 'orden',
        headerName: 'Ver orden',
        description:'Muestra información de la ordens, si esta pagada o no',
        width:200,
        sortable:false,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <NextLink href={`/orders/${params.row.id}`} passHref legacyBehavior>
                    <Link underline="always">
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
    }    
]

const rows = [
    { id:1, paid: false, fullName:'Jorge Castillo' },
    { id:2, paid: true, fullName:'Jorge Castillo' },
    { id:3, paid: false, fullName:'Jorge Castillo' },
    { id:4, paid: false, fullName:'Jorge Castillo' },
    { id:5, paid: true, fullName:'Jorge Castillo' },
    { id:6, paid: false, fullName:'Jorge Castillo' },
    { id:7, paid: false, fullName:'Jorge Castillo' },
]

const HistoryPage = () => {
  return (
    <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
        <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

        <Grid container>
            <Grid item xs={12} sx={{ height: 650, width:'100%'}}>
                <DataGrid
                    rows={ rows }
                    columns={ columns }
                />
            </Grid>
        </Grid>

    </ShopLayout>
  )
}

export default HistoryPage