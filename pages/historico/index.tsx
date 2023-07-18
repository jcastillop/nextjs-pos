import React, { useRef } from 'react'
import { Button, Chip, Grid, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid'
import { useComprobantes, useFuels } from '@/hooks'
import { FuelLayout } from '@/components/layouts'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { useReactToPrint } from 'react-to-print'
import { useRouter } from 'next/router'
import { IPrintPosProps, PrintPos } from '@/components/print/PrintPos'

import { initialReceptor } from '@/database/receptor';
import { IComprobante } from '@/interfaces/comprobante'
import { initialComprobante } from '@/database/comprobante'
import { useState } from 'react';


const HistoricoPage: NextPage = () => {

  const { comprobantes } = useComprobantes()

  const [printObject, setPrintObject] = useState<IPrintPosProps>({receptor: initialReceptor, comprobante: initialComprobante})

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 2 },
    { field: 'fecha', headerName: 'Fecha', width: 150 },
    { field: 'cliente', headerName: 'Cliente', width: 220 },
    { field: 'comprobante', headerName: 'Comprobante', width: 150 },
    { field: 'gravadas', headerName: 'Subtotal', width: 150 },
    { field: 'igv', headerName: 'IGV', width: 150 },
    { field: 'total', headerName: 'Total', width: 150 },
    {
        field: 'sunat',
        headerName: 'SUNAT',
  
        renderCell: (params: GridRenderCellParams<String>) => {
            return <Chip variant='filled' label="Correcto" color="success" />
        }, width: 150
  
    },
    {
        field: 'imprimir',
        headerName: 'Re-imprimir',
        renderCell: (params: GridRenderCellParams<any>) => {
            return (
              <Button
              variant="contained"
              color="primary"
              onClick={async (event) => {               
                var dataReceptor = {
                  tipo_documento: 0,
                  razon_social: params.row.cliente,
                  numero_documento: params.row.documento,
                  direccion: "",
                  correo: ""
                }
                const dataComprobante = {
                  id:0,tipo_comprobante:"",tipo_operacion:"",tipo_nota:"",tipo_documento_afectado:"",motivo_documento_afectado:"",monto_letras:"",pdf_bytes:"",url:"",errors:"",
                  fecha_emision:params.row.fecha,
                  numeracion_documento_afectado:params.row.comprobante,
                  total_gravadas:params.row.gravadas,
                  total_igv:params.row.igv,
                  total_venta:params.row.total,
                  codigo_hash:params.row.hash,
                  cadena_para_codigo_qr:"",
                  tipo_moneda:""
                }                               
                await setPrintObject({receptor: dataReceptor, comprobante: dataComprobante});
                handlePrint();
              }}
            >
              Imprimir
            </Button>
            )
        }, width: 150  
    },
    { field: 'hash', headerName: 'Hash', width: 150 },
    { field: 'documento', headerName: 'Documento', width: 150 },
  ];

  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",        
    content: () => componentRef.current || null,
    onAfterPrint: () => {
        // Reset the Promise resolve so we can print again
        //emptyOrder();
        //router.push('/');
      }        
  });   

  if ( !comprobantes ) return (<></>);
    
  const rows = comprobantes.comprobantes!.map( (order: { id: any; fecha_emision: any; Receptore: { razon_social: any; numero_documento: any }; numeracion_documento_afectado: any; total_gravadas: any; total_igv: any; total_venta: any; tipo_moneda: any; tipo_operacion: any; codigo_hash: any }) => ({
      id          : order.id,
      fecha       : order.fecha_emision,
      cliente     : order.Receptore.razon_social,
      comprobante : order.numeracion_documento_afectado,
      gravadas    : order.total_gravadas,
      igv         : order.total_igv,
      total       : order.total_venta,
      sunat       : order.tipo_moneda,
      imprimir    : order.tipo_operacion,
      hash        : order.codigo_hash,
      documento   : order.Receptore.numero_documento,
      // name  : (order.user as IUser).name,
      // total : order.total,
      // isPaid: order.isPaid,
      // noProducts: order.numberOfItems,
      // createdAt: order.createdAt,
  }));
  
  return (
    <>
      <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
        <Typography variant='h1' component = 'h1'>Histórico de ventas</Typography>

        <div style={{ display: "none" }}>
            <PrintPos ref={componentRef} receptor={printObject.receptor} comprobante={printObject.comprobante}/>
        </div>

        <Grid container className='fadeIn'>
          <Grid item xs={12} sx={{ height:1500, width: '100%' }}>
              <DataGrid 
                  rows={ rows }
                  columns={ columns }
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


export default HistoricoPage
