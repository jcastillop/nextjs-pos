import React from 'react'
import { getSession, useSession } from 'next-auth/react';
import { useProductos } from '@/hooks';
import { FuelLayout } from '@/components/layouts';
import { Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ProductDialog } from '@/components/products/ProductDialog';
import { IProduct } from '@/interfaces';
import { GetServerSideProps, NextPage } from 'next';
import { FuelContext } from '@/context';

const ProductPage: NextPage = () => {

  const nuevoProducto: IProduct = {
      id: 0,
      nombre: '',
      descripcion: '',
      stock: 0,
      codigo: '',
      medida: 'NIU',
      precio: 0,
      valor: 0,
      estado: 1
  }

  const { data: session, status } = useSession()

  const { productos, isLoadingProduct, hasErrorProduct } = useProductos({ refreshInterval: 0});

  if ( !productos ) return (<></>);

  const rows = productos.map( (producto: IProduct) => ({
    id          : producto.id,
    codigo      : producto.codigo,
    nombre      : producto.nombre,
    medida      : producto.medida,
    valor       : producto.valor,
    precio      : producto.precio,
    stock       : producto.stock,
    descripcion : producto.descripcion,
    estado      : producto.estado
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 2 },
    { field: 'codigo', headerName: 'Codigo', width: 100 },
    { field: 'nombre', headerName: 'Nombre', width: 200 },
    { field: 'medida', headerName: 'Unidad de medida', width: 150 },
    { field: 'descripcion', headerName: 'Descripcion', width: 250 },
    { field: 'valor', headerName: 'Valor unitario', width: 150 },
    { field: 'precio', headerName: 'Precio unitario', width: 150 },
    { field: 'stock', headerName: 'Stock', width: 100 },
    {
      field: 'accion',
      headerName: '',

      renderCell: (params: GridRenderCellParams<any>) => {
        const dataProducto: IProduct = {
          id: params.row.id,
          nombre: params.row.nombre,
          descripcion: params.row.descripcion,
          stock: params.row.stock,
          codigo: params.row.codigo,
          medida: params.row.medida,
          precio: params.row.precio,
          valor: params.row.valor,
          estado: params.row.estado
        }
          return <ProductDialog product={ dataProducto } newProduct={ false } />
      }, width: 150

  },      
  ]

  return (
    <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
      <Typography variant='h1' component = 'h1'>Productos</Typography>

      <ProductDialog product={ nuevoProducto } newProduct={ true } />
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height:700, width: '100%', mt:2}}>
            <DataGrid 
                rows={ rows }
                columns={ columns }
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 }},
                    columns: {
                    columnVisibilityModel: {
                        // hash: false,
                        // documento: false,
                    }
                    },
                }}
                pageSizeOptions={[5, 10, 25]}
            />
        </Grid>
      </Grid>

    </FuelLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query})=>{

  const session = await getSession({ req });
  const { p = '/auth/login'} = query
  const { q = '/'} = query

  if(!session){
      return {
          redirect: {
              destination: p.toString(),
              permanent: false
          }
      }
  }else{
      if(session.user.rol != 'ADMIN_ROLE'){
          return {
              redirect: {
                  destination: q.toString(),
                  permanent: false
              }
          }        
      }
  }

  return{
      props: {}
  }
}

export default ProductPage