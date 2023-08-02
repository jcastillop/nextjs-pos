import React, { useContext, useEffect, useRef } from 'react'
import { Button, Chip, Grid, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid'

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
import { posApi } from '@/api'
import { FuelContext } from '@/context'
import { initialData } from '../../database/products';
import constantes from '@/helpers/constantes'

interface TotalizadoresState {
  totalEfectivo: number;
  totalTarjeta: number;
}

const TOTAL_INITIAL_STATE: TotalizadoresState = {
  totalEfectivo: 0,
  totalTarjeta: 0
}

const HistoricoPage: NextPage = () => {

  const { listarHistorico } = useContext(FuelContext)
  const [totalizadores, setTotalizadores] = useState(TOTAL_INITIAL_STATE)
  const [comprobantes, setComprobantes] = useState<any[]>()

  useEffect(() => {
    const callAPI = async () => {
      const session = await getSession();
      const idUsuario: number = +(session?.user.id||0)
      const { hasError, comprobantes} = await listarHistorico(idUsuario);
      const { totalEfectivo, totalTarjeta } : TotalizadoresState = comprobantes?.filter(({tipo_comprobante}) => (tipo_comprobante == constantes.TipoComprobante.Factura || tipo_comprobante == constantes.TipoComprobante.Boleta)).map(comprobante => ({ totalEfectivo: comprobante.pago_efectivo, totalTarjeta: comprobante.pago_tarjeta })).reduce((a, b) => {
        return ({
          totalEfectivo: a.totalEfectivo + b.totalEfectivo || 0,
          totalTarjeta: a.totalTarjeta + b.totalTarjeta || 0
        });
      }, {totalEfectivo: 0, totalTarjeta: 0})||TOTAL_INITIAL_STATE;
      setComprobantes(comprobantes);
      setTotalizadores({ totalEfectivo, totalTarjeta }) 
    }
    callAPI()
  }, [listarHistorico]);
  
  const [printObject, setPrintObject] = useState<IPrintPosProps>({receptor: initialReceptor, comprobante: initialComprobante})

  const currencyFormatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 2 },
    { field: 'fecha', headerName: 'Fecha', width: 150 },
    { field: 'cliente', headerName: 'Cliente', width: 220 },
    { field: 'comprobante', headerName: 'Comprobante', width: 150 },
    { field: 'gravadas', headerName: 'Subtotal', width: 150 },
    { field: 'igv', headerName: 'IGV', width: 150 },
    { 
      field: 'total', 
      headerName: 'Total', 
      type: 'number',
      width: 150,
      groupable: false,
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return currencyFormatter.format(value);
      },      
    },
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
                  id_receptor: 0,
                  tipo_documento: 0,
                  numero_documento: params.row.documento,
                  razon_social: params.row.cliente,
                  direccion: "",
                  correo: "",
                  placa: ""
                }
                const dataComprobante = {
                  id:0,tipo_operacion:"",tipo_nota:"",tipo_documento_afectado:"",motivo_documento_afectado:"",monto_letras:"",pdf_bytes:"",url:"",errors:"",
                  tipo_comprobante:params.row.tipo,
                  fecha_emision:params.row.fecha,
                  numeracion_documento_afectado:params.row.comprobante,
                  pago_efectivo: 0,
                  pago_tarjeta: 0,
                  total_gravadas:params.row.gravadas,
                  total_igv:params.row.igv,
                  total_venta:params.row.total,
                  codigo_hash:params.row.hash,
                  cadena_para_codigo_qr:"",
                  tipo_moneda:"",
                  dec_combustible:params.row.combustible,
                  volumen:params.row.volumen,
                  Receptore: {
                    id_receptor: 0,
                    tipo_documento: 0,
                    numero_documento: '',
                    razon_social: '',
                    direccion: '',
                    correo: '',
                    placa: ''
                  }
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
    { field: 'documento', headerName: 'Documento', width: 150 }
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
    
  const rows = comprobantes.map( (comprobante) => ({
      id          : comprobante.id,
      fecha       : comprobante.fecha_emision,
      cliente     : comprobante["Receptore.razon_social"],
      comprobante : comprobante.numeracion_documento_afectado,
      gravadas    : comprobante.total_gravadas,
      igv         : comprobante.total_igv,
      total       : comprobante.total_venta,
      sunat       : comprobante.tipo_moneda,
      imprimir    : comprobante.tipo_operacion,
      hash        : comprobante.codigo_hash,
      documento   : comprobante["Receptore.numero_documento"],
      tipo        : comprobante.tipo_comprobante,
      volumen     : comprobante.volumen,
      combustible : comprobante.dec_combustible
  }));

  
  
  return (
    <>
      <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
        <Typography variant='h1' component = 'h1'>Histórico de ventas</Typography>
        <Typography  variant="subtitle1" style={{ color: 'blue' }}>Tarjeta S/ {totalizadores.totalTarjeta.toFixed(2)} - Efectivo S/ {totalizadores.totalEfectivo.toFixed(2)}</Typography>
        <div style={{ display: "none" }}>
            <PrintPos ref={componentRef} receptor={printObject.receptor} comprobante={printObject.comprobante}/>
        </div>

        <Grid container className='fadeIn'>
          <Grid item xs={12} sx={{ height:700, width: '100%' }}>
              <DataGrid 
                  rows={ rows }
                  columns={ columns }
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 }},
                    columns: {
                      columnVisibilityModel: {
                        hash: false,
                        documento: false,
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


export default HistoricoPage

