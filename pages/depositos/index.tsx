import { FuelLayout } from '@/components/layouts';
import { ProductDialog } from '@/components/products';
import React from 'react'
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Grid, Typography } from '@mui/material';

import { IDeposito, IGasto, IProduct } from '@/interfaces';
import { useDepositos, useGastos } from '@/hooks';
import { DepositoDialog, GastoDialog } from '@/components';
import { getDatetimeFormatFromStringLocal } from '@/helpers';

export const DepositosPage = () => {   

    const nuevoDeposito: IDeposito = {
        id: 0,
        concepto: '',
        monto: 0,
        usuario: '',
        turno: '',
        estado: 0,
        fecha: '',
        UsuarioId: ''
    }
  
    const { data: session, status } = useSession()
  
    const { depositos, isLoadingGastos, hasErrorGastos } = useDepositos(session?.user.id || '0', { refreshInterval: 0});
  
    if ( !depositos ) return (<></>);

    const rows = depositos.map( (deposito: IDeposito) => ({
        id          : deposito.id,
        concepto    : deposito.concepto,
        monto       : deposito.monto,
        usuario     : deposito.usuario,
        turno       : deposito.turno,
        usuarioid   : deposito.UsuarioId,
        fecha       : getDatetimeFormatFromStringLocal(deposito.fecha),
        estado      : deposito.estado
    }));

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 2 },
        { field: 'concepto', headerName: 'Concepto', width: 200 },
        { field: 'monto', headerName: 'Monto', width: 200 },
        { field: 'usuario', headerName: 'Usuario', width: 200 },
        { field: 'turno', headerName: 'Turno', width: 150 },
        { field: 'fecha', headerName: 'Fecha', width: 150 },
        {
          field: 'accion',
          headerName: '',
    
          renderCell: (params: GridRenderCellParams<any>) => {
            const dataDeposito: IDeposito = {
                id: params.row.id,
                concepto: params.row.concepto,
                monto: params.row.monto,
                usuario: params.row.usuario,
                turno: params.row.turno,
                fecha: params.row.fecha,
                estado: params.row.estado,
                UsuarioId: params.row.usuarioid
            }
              return <DepositoDialog deposito={ dataDeposito } newGasto={ false } />
          }, width: 150
    
      },      
    ]
      
    return (
        <>
        <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
            <Typography variant='h1' component = 'h1'>Registro de depositos parciales por turno</Typography>

            <DepositoDialog deposito={ nuevoDeposito } newGasto={ true } />
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
    
export default DepositosPage
    
