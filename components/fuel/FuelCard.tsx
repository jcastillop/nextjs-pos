import { IFuel } from '@/interfaces';
import NextLink from 'next/link';
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from '@mui/material'
import React, { FC, useMemo, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FuelSelectInvoiceType } from './FuelSelectInvoiceType';

interface Props{
    fuel? : IFuel;
}

// const columns: GridColDef[] = [
//     { field: 'id', headerName: 'ID',sortable:false, width:50 },
//     { field: 'fullName', headerName: 'Nombre completo',sortable:false, width:100 },
//     {
//         field: 'paid',
//         headerName: 'Pagada',
//         description:'Muestra información de la ordens, si esta pagada o no',
//         width:70,
//         sortable:false,
//         renderCell: (params: GridRenderCellParams) => {
//             return (
//                 params.row.paid
//                     ? <Chip color='success' label='pagada' variant='outlined'/>
//                     : <Chip color='error' label='no pagada' variant='outlined'/>
//             )
//         }
//     },
//     {
//         field: 'orden',
//         headerName: 'Ver orden',
//         description:'Muestra información de la ordens, si esta pagada o no',
//         width:50,
//         sortable:false,
//         renderCell: (params: GridRenderCellParams) => {
//             return (
//                 <NextLink href={`/orders/${params.row.id}`} passHref legacyBehavior>
//                     <Link underline="always">
//                         Ver orden
//                     </Link>
//                 </NextLink>
//             )
//         }
//     }    
// ]

// const rows = [
//     { id:1, paid: false, fullName:'Jorge Castillo' },
//     { id:2, paid: true, fullName:'Jorge Castillo' },
//     { id:3, paid: false, fullName:'Jorge Castillo' },
//     { id:4, paid: false, fullName:'Jorge Castillo' },
//     { id:5, paid: true, fullName:'Jorge Castillo' },
//     { id:6, paid: false, fullName:'Jorge Castillo' },
//     { id:7, paid: false, fullName:'Jorge Castillo' },
// ]

export const FuelCard: FC<Props> = ({ fuel }) => {

  const [isHovered, setIsHovered] = useState(false);

//   const productImage = useMemo(() => {
//     return isHovered
//       ? `products/${ product.images[1] }`
//       : `products/${ product.images[0] }`
//   }, [isHovered, product.images])

  return (
    <Grid item 
      xs={6} 
      sm={3}
    //   onMouseEnter={ () => setIsHovered(true) }
    //   onMouseLeave={ () => setIsHovered(false) }
    >     
    <Card>
      <NextLink href={`/fuel/${fuel?.idAbastecimiento}`} passHref prefetch={false} legacyBehavior>
      <Link>
        <Box sx={{mt: 1}} className='fadeIn'>
        <Typography fontWeight={700}>S/.{ '123.123' }</Typography>
          <Typography fontWeight={700}>{ fuel?.valorTotal }</Typography>
          <Typography fontWeight={500}>{ fuel?.volTotal }</Typography>
        </Box>
      </Link>
      </NextLink>
      {/* <FuelSelectInvoiceType/> */}
    </Card>

  </Grid>
  )
}
