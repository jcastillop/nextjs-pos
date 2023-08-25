import React, { useContext, useEffect, useRef } from 'react'
import { Button, Chip, Grid, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid'

import { FuelLayout } from '@/components/layouts'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { useReactToPrint } from 'react-to-print'
import { useRouter } from 'next/router'
import { IPrintPosProps, PrintPos } from '@/components/print/PrintPos'

import { initialReceptor } from '@/database/receptor';
import { IComprobante } from '@/interfaces/comprobante'
import { initialComprobante } from '@/database/comprobante'
import { useState } from 'react';

import constantes from '@/helpers/constantes'
import { Print } from '@/components/print/Pint'
import Link from 'next/link'
import { Constantes } from '@/helpers'
import { listarHistorico } from '@/hooks'

interface TotalizadoresState {
  totalEfectivo: number;
  totalTarjeta: number;
}

const TOTAL_INITIAL_STATE: TotalizadoresState = {
  totalEfectivo: 0,
  totalTarjeta: 0
}

const HistoricoPage = ({ comprobantes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const { data: session, status } = useSession()
  const typeComprobante = comprobantes as IComprobante[]
  const { totalEfectivo, totalTarjeta } : TotalizadoresState = typeComprobante?.filter(({tipo_comprobante}) => (tipo_comprobante == constantes.TipoComprobante.Factura || tipo_comprobante == constantes.TipoComprobante.Boleta)).map(comprobante => ({ totalEfectivo: comprobante.pago_efectivo, totalTarjeta: comprobante.pago_tarjeta })).reduce((a, b) => {
    return ({
      totalEfectivo: a.totalEfectivo + b.totalEfectivo || 0,
      totalTarjeta: a.totalTarjeta + b.totalTarjeta || 0
    });
  }, {totalEfectivo: 0, totalTarjeta: 0})||TOTAL_INITIAL_STATE;
  
  const [printObject, setPrintObject] = useState<IPrintPosProps>({receptor: initialReceptor, comprobante: initialComprobante})

  const currencyFormatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 2, disableColumnMenu: true },
    { field: 'fecha', headerName: 'Fecha', width: 150, sortable: false },
    { field: 'cliente', headerName: 'Cliente', width: 220, sortable: false },
    { 
      field: 'tipo', 
      headerName: 'Tipo', 
      width: 150, 
      sortable: false, 
      filterable: false, 
      renderCell: (params: GridRenderCellParams<any>) => {
        switch (params.row.tipo) {
          case Constantes.TipoComprobante.Boleta:
              return "Boleta"
          case Constantes.TipoComprobante.Factura:
              return "Factura"
          case Constantes.TipoComprobante.NotaCredito:
              return "Nota credito"
          case Constantes.TipoComprobante.NotaDespacho:
              return "Nota despacho"
          case Constantes.TipoComprobante.Calibracion:
            return "Calibracion" 
        }
      }
    },
    { field: 'comprobante', headerName: 'Comprobante', width: 120, sortable: false },
    { field: 'gravadas', headerName: 'Subtotal', width: 150, sortable: false, filterable: false },
    { field: 'igv', headerName: 'IGV', width: 150, sortable: false, filterable: false },
    { 
      field: 'total', 
      headerName: 'Total', 
      type: 'number',
      width: 100,
      groupable: false,
      sortable: false,
      filterable: false,
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return currencyFormatter.format(value);
      },      
    },
    { field: 'isla', headerName: 'Isla', width: 100, sortable: false },
    { field: 'turno', headerName: 'Turno', width: 100, sortable: false },
    { field: 'usuario', headerName: 'Usuario', width: 100, sortable: false },    
    {
        field: 'sunat',
        headerName: 'SUNAT',
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams<any>) => {
          if(params.row.tipo == constantes.TipoComprobante.Factura || params.row.tipo == constantes.TipoComprobante.Boleta || params.row.tipo == constantes.TipoComprobante.NotaCredito){
            if(params.row.error){
              return <Chip variant='filled' label="Error SUNAT" color="error" />
            }else{
              return <Chip variant='filled' label="Correcto" color="success" />
            }
            
          }else{
            return(<></>)
          }
        }, width: 120
  
    },
    {
        field: 'imprimir',
        headerName: 'Re-imprimir',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams<any>) => {
          if(params.row.error){
            return (<></>)
          }else{
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
                  numeracion_comprobante:params.row.comprobante,
                  numeracion_documento_afectado:params.row.numeracion_documento_afectado,
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
                  placa:params.row.placa,
                  billete:0,
                  producto_precio:params.row.precio,
                  codigo_combustible:params.row.codcombustible,
                  id_abastecimiento:params.row.abastecimiento,
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
          }

        }, width: 100  
    },
    { field: 'hash', headerName: 'Hash', width: 150, sortable: false, filterable: false },
    { field: 'documento', headerName: 'Documento', width: 150, sortable: false, filterable: false },
    { 
      field: 'abastecimiento', 
      headerName: 'N. Credito',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<any>) => {
        if(params.row.tipo == constantes.TipoComprobante.Factura){
          return (
            <Link
              href={{
                pathname: '/historico/notacredito',
                query: {
                  id: params.row.abastecimiento,
                  numero_documento: params.row.documento,
                  razon_social: params.row.cliente,
                  descripcion: params.row.combustible,
                  tipo_afectado: params.row.tipo,
                  numeracion_afectado: params.row.comprobante,
                  fecha_afectado: params.row.fecha,
                }
              }}
            >
              <Button variant="contained" color="secondary">Generar</Button>
            </Link>
          )
        }else{
          return(<></>)
        }
      }, width: 100  
    }
  ];

  const router = useRouter();
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",        
    content: () => componentRef.current,
    onAfterPrint: () => {
        console.log("test")
        // Reset the Promise resolve so we can print again
        //emptyOrder();
        //router.push('/');
      }        
  });   

  if ( !comprobantes ) return (<></>);
    
  const rows = comprobantes.map( (comprobante : any) => ({
      id          : comprobante.id,
      fecha       : comprobante.fecha_emision,
      cliente     : comprobante["Receptore.razon_social"],
      comprobante : comprobante.numeracion_comprobante,
      gravadas    : comprobante.total_gravadas,
      igv         : comprobante.total_igv,
      total       : comprobante.total_venta,
      sunat       : comprobante.tipo_moneda,
      imprimir    : comprobante.tipo_operacion,
      hash        : comprobante.codigo_hash,
      documento   : comprobante["Receptore.numero_documento"],
      tipo        : comprobante.tipo_comprobante,
      volumen     : comprobante.volumen,
      combustible : comprobante.dec_combustible,
      placa       : comprobante.placa,
      precio      : comprobante.producto_precio,
      codcombustible: comprobante.codigo_combustible,
      isla        : comprobante["Cierreturno.isla"],
      turno       : comprobante["Cierreturno.turno"],
      usuario     : comprobante["Usuario.usuario"],
      abastecimiento: comprobante.id_abastecimiento,
      error       : comprobante.errors
  }));

  
  
  return (
    <>
      <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
        <Typography variant='h1' component = 'h1'>Histórico de ventas</Typography>
        
        {
          session?.user.rol == 'USER_ROLE' &&  (
            <>
              <Typography  variant="subtitle1" style={{ color: 'blue' }}>Tarjeta S/ {totalTarjeta.toFixed(2)} - Efectivo S/ {totalEfectivo.toFixed(2)}</Typography>
              <Print comprobantes={comprobantes}/> 
            </>
          )
        }
        
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
                        gravadas: session?.user.rol == 'USER_ROLE',
                        igv: session?.user.rol == 'USER_ROLE',
                        isla: session?.user.rol == 'ADMIN_ROLE',
                        turno: session?.user.rol == 'ADMIN_ROLE',
                        usuario: session?.user.rol == 'ADMIN_ROLE',
                        abastecimiento: session?.user.rol == 'ADMIN_ROLE',
                      }
                    },
                    sorting:{
                      sortModel: [{ field: 'id', sort: 'desc' }],
                    }
                  }}
                  pageSizeOptions={[5, 10, 25]}
              />
          </Grid>
        </Grid>    
      </FuelLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{ comprobantes: any }> = async ({ req, query})=>{

  const session: any = await getSession({ req });
  const { p = '/auth/login'} = query

  var returnComprobante: any = [ initialComprobante ];
  
  

  if(!session){
      return {
          redirect: {
              destination: p.toString(),
              permanent: false
          }
      }
  }else{
    const { hasError, comprobantes} = await listarHistorico(session.user.id || 0);
    returnComprobante = comprobantes;
  }
  return{
      props: { comprobantes: returnComprobante }
  }
}


export default HistoricoPage

