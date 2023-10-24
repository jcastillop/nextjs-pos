import React from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { FuelLayout } from '../../components/layouts';
import { getSession, useSession } from 'next-auth/react';
import { ICustomer } from '../../interfaces/customers';
import { useReceptores } from '../../hooks/useReceptores';
import { Typography, Grid } from '@mui/material';
import { CustomerDialog } from '@/components/customers/CustomerDialog';

const nuevoReceptor: ICustomer = {
    id: 0,
    numero_documento: '',
    tipo_documento: '',
    razon_social: '',
    direccion: '',
    correo: '',
    placa: ''
}

const CustomerPage: NextPage = () => {

    const { hasError, isLoading, receptores } = useReceptores({ refreshInterval: 0});

    if ( !receptores ) return (<></>);

    const rows = receptores.map( (receptor: ICustomer) => ({
        id              : receptor.id,
        numero_documento: receptor.numero_documento,
        tipo_documento  : receptor.tipo_documento,
        razon_social    : receptor.razon_social,
        direccion       : receptor.direccion,
        correo          : receptor.correo,
        placa           : receptor.placa
    }))

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 2 },
        { field: 'tipo_documento', headerName: 'Tipo', width: 100 },
        { field: 'numero_documento', headerName: 'Documento', width: 150 },
        { field: 'razon_social', headerName: 'R. Social / Nombres', width: 400 },
        { field: 'direccion', headerName: 'Dirección', width: 300 },
        { field: 'correo', headerName: 'Correo', width: 150 },
        { field: 'placa', headerName: 'Placa', width: 150 },
        {
            field: 'accion',
            headerName: '',
            renderCell: (params: GridRenderCellParams<any>) => {
                const dataReceptor: ICustomer = {
                    id              : params.row.id,
                    numero_documento: params.row.numero_documento,
                    tipo_documento  : params.row.tipo_documento,
                    razon_social    : params.row.razon_social,
                    direccion       : params.row.direccion,
                    correo          : params.row.correo,
                    placa           : params.row.placa                    
                }
                return <CustomerDialog customer={dataReceptor} newCustomer={false}/>
            }, width: 150         
        }
    ]

    return (
        <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
            <Typography variant='h1' component = 'h1'>Clientes</Typography>
            {/* <CustomerDialog customer={nuevoReceptor} newCustomer={true}/> */}
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
    }
  
    return{
        props: {}
    }
  }
  
  export default CustomerPage