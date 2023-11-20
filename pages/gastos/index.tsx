import { FuelLayout } from '@/components/layouts';
import { ProductDialog } from '@/components/products';
import React from 'react'
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Grid, Typography } from '@mui/material';

import { IGasto, IProduct } from '@/interfaces';
import { useGastos } from '@/hooks';
import { GastoDialog } from '@/components';
import { getDatetimeFormatFromStringLocal } from '@/helpers';

export const GastosPage = () => {   

    const nuevoGasto: IGasto = {
        id: 0,
        concepto: '',
        monto: 0,
        usuario_gasto: '',
        autorizado: '',
        turno: '',
        estado: 0,
        usuario_registro: '',
        fecha: '',
        UsuarioId: ''
    }
  
    const { data: session, status } = useSession()
  
    const { gastos, isLoadingGastos, hasErrorGastos } = useGastos(session?.user.id || '0', { refreshInterval: 0});
  
    if ( !gastos ) return (<></>);

    const rows = gastos.map( (gasto: IGasto) => ({
        id          : gasto.id,
        concepto    : gasto.concepto,
        monto       : gasto.monto,
        usuario     : gasto.usuario_gasto,
        autorizado  : gasto.autorizado,
        turno       : gasto.turno,
        usuarioid       : gasto.UsuarioId,
        fecha       : getDatetimeFormatFromStringLocal(gasto.fecha),
        estado      : gasto.estado
    }));

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 2 },
        { field: 'concepto', headerName: 'Concepto', width: 200 },
        { field: 'monto', headerName: 'Monto', width: 200 },
        { field: 'usuario', headerName: 'Usuario', width: 200 },
        { field: 'autorizado', headerName: 'Autorizado', width: 200 },
        { field: 'turno', headerName: 'Turno', width: 150 },
        { field: 'fecha', headerName: 'Fecha', width: 150 },
        {
          field: 'accion',
          headerName: '',
    
          renderCell: (params: GridRenderCellParams<any>) => {
            const dataGasto: IGasto = {
                id: params.row.id,
                concepto: params.row.concepto,
                monto: params.row.monto,
                usuario_gasto: params.row.usuario,
                autorizado: params.row.autorizado,
                turno: params.row.turno,
                fecha: params.row.fecha,
                estado: params.row.estado,
                usuario_registro: '',
                UsuarioId: params.row.usuarioid
            }
              return <GastoDialog gasto={ dataGasto } newGasto={ false } />
          }, width: 150
    
      },      
    ]
      
    return (
        <>
        <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
            <Typography variant='h1' component = 'h1'>Registro de gastos por turno</Typography>

            <GastoDialog gasto={ nuevoGasto } newGasto={ true } />
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
        </>
      )
    }
    
export const getServerSideProps: GetServerSideProps = async ({ req, query})=>{
    
    const session = await getSession({ req });  
    const { p = '/auth/login'} = query

    if(!session){
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }
    return{
        props: {}
    }
}
    
export default GastosPage
    
