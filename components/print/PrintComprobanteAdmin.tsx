import React, { RefObject, forwardRef } from 'react'
import QRCode from "react-qr-code";
import { IComprobante, IComprobanteAdmin, IReceptor } from '@/interfaces';
import { useSession } from 'next-auth/react';
import constantes from '@/helpers/constantes';
import { Grid } from '@mui/material';

import styles from './PrintPos.module.css';

export type IPrintComprobanteAdminProps = {
  comprobante: IComprobanteAdmin;
};

export const PrintComprobanteAdmin = forwardRef((props: IPrintComprobanteAdminProps, ref) => {

  const { data: session, status } = useSession()

  

  const renderSwitch = (comprobante: IComprobanteAdmin) => {
    const totalize = comprobante?.items.map(item => ({ igv: item.igv, total: item.precio_venta, gravadas: item.valor_venta })).reduce((a, b) => {
      return ({
          igv: (a.igv || 0) + (b.igv || 0),
          total: (a.total || 0) + (b.total || 0),
          gravadas: (a.gravadas || 0) + (b.gravadas || 0)
      })
  }, { igv: 0, total: 0, gravadas: 0 })

    if(comprobante){
      switch(comprobante.tipo_comprobante) {
        case constantes.TipoComprobante.Factura:
        case constantes.TipoComprobante.Boleta:
          return <>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontSize:14 }}>{process.env.NEXT_PUBLIC_RS}</div>
                <div style={{ fontSize:10 }}>{process.env.NEXT_PUBLIC_DIR}</div>
                <div style={{ fontSize:12 }}>{process.env.NEXT_PUBLIC_RUC}</div>
              </div>
              <Grid container spacing={1} sx={{ mt: 0}} className={styles['noPadding']}>

                <Grid item xs={6} style={{paddingTop: 0}}>
                  {(comprobante.tipo_comprobante==constantes.TipoComprobante.Factura)?'FACTURA':'BOLETA'} ELECTRONICA
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {comprobante.numeracion}
                </Grid>              
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {(comprobante.tipo_comprobante==constantes.TipoComprobante.Factura)?'RAZON SOCIAL ':'CLIENTE '}
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {comprobante.Receptor?.razon_social}
                </Grid>              
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {(comprobante.tipo_comprobante==constantes.TipoComprobante.Factura)?'RUC ':'DNI'}
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {comprobante.Receptor?.numero_documento}
                </Grid>   
                  
                {comprobante.placa? <>
                  <Grid item xs={6} style={{paddingTop: 0}}>PLACA</Grid>
                  <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.placa.toUpperCase() }</Grid>              
                </> : <></>}

                <Grid item xs={6} style={{paddingTop: 0}}>FECHA</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{ new Date(comprobante.fecha_abastecimiento).toLocaleString('es-PE', { timeZone: 'UTC' }) }</Grid>

                {comprobante.Receptor?.direccion? <>
                  <Grid item xs={6} style={{paddingTop: 0}}>DIRECCION:</Grid>
                  <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.Receptor?.direccion }</Grid>                
                </>:<></>
                }                                

                <Grid item xs={6} style={{paddingTop: 0}}>Usuario: </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{session?.user.nombre}</Grid>

                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Producto</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Cant</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Valor</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Importe</Grid>

                {
                    comprobante.items.map( item => (
                        <Grid container key={ item.codigo_producto } sx={{ml:1}}>
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.descripcion }</Grid>  
                          <Grid item xs={3} style={{paddingTop: 0}} sx={{ justifyContent:"flex-end"}}>{ item.cantidad }</Grid>  
                          <Grid item xs={3} style={{paddingTop: 0}} sx={{ justifyContent:"flex-end"}}>{ item.valor.toFixed(item.medida == "GAL"?5:2) }</Grid>  
                          <Grid item xs={3} style={{paddingTop: 0}} sx={{ justifyContent:"flex-end"}}>{ item.valor_venta.toFixed(item.medida == "GAL"?5:2) }</Grid>  

                        </Grid>
                    ))
                }
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Gravadas: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ totalize.gravadas.toFixed(2) }</Grid>  

                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>IGV(18%)</Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ totalize.igv.toFixed(2) }</Grid>  

                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Total: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ totalize.total.toFixed(2) }</Grid>  
              </Grid>

              <div style={{ height: "auto", margin: "0 auto", maxWidth: 80, width: "100%", marginTop:8 }}>
                <QRCode
                  size={350}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={ comprobante.cadena_para_codigo_qr }
                  viewBox={`0 0 256 256`}
                />
              </div>          
              <div>V.RESUMEN: {comprobante.codigo_hash}</div>        
          </>;
        case constantes.TipoComprobante.NotaCredito:
          return <>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontSize:14 }}>{process.env.NEXT_PUBLIC_RS}</div>
                <div style={{ fontSize:10 }}>{process.env.NEXT_PUBLIC_DIR}</div>
                <div style={{ fontSize:12 }}>{process.env.NEXT_PUBLIC_RUC}</div>
              </div>
              <Grid container spacing={1} sx={{ mt: 0}} className={styles['noPadding']}>

                <Grid item xs={6} style={{paddingTop: 0}}>
                  NOTA DE CREDITO ELECTRONICA
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {comprobante.numeracion}
                </Grid>              
                <Grid item xs={6} style={{paddingTop: 0}}>
                  RAZON SOCIAL
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {comprobante.Receptor?.razon_social}
                </Grid>              
                <Grid item xs={6} style={{paddingTop: 0}}>
                  RUC
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {comprobante.Receptor?.numero_documento}
                </Grid>   
                  
                {comprobante.placa? <>
                  <Grid item xs={6} style={{paddingTop: 0}}>PLACA</Grid>
                  <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.placa.toUpperCase() }</Grid>              
                </> : <></>}

                <Grid item xs={6} style={{paddingTop: 0}}>FECHA</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{ new Date(comprobante.fecha_abastecimiento).toLocaleString('es-PE', { timeZone: 'UTC' }) }</Grid>

                <Grid item xs={6} style={{paddingTop: 0}}>Usuario: </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{session?.user.nombre}</Grid>

                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Producto</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Cant</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Valor</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Importe</Grid>

                {
                    comprobante.items.map( item => (
                        <Grid container key={ item.codigo_producto } sx={{ml:1}}>
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.descripcion }</Grid>  
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.cantidad }</Grid>  
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.valor.toFixed(5) }</Grid>  
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.valor_venta.toFixed(5) }</Grid>  

                        </Grid>
                    ))
                }
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Gravadas: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.gravadas }</Grid>  

                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>IGV(18%)</Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.igv }</Grid>  

                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Total: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total }</Grid>  
              </Grid>

              <div style={{ height: "auto", margin: "0 auto", maxWidth: 80, width: "100%", marginTop:8 }}>
                <QRCode
                  size={350}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={ comprobante.cadena_para_codigo_qr }
                  viewBox={`0 0 256 256`}
                />
              </div>          
              <div>V.RESUMEN: {comprobante.codigo_hash}</div>        
          </>;          
        case constantes.TipoComprobante.NotaDespacho:
          return <>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontSize:14 }}>{process.env.NEXT_PUBLIC_RS}</div>
                <div style={{ fontSize:10 }}>{process.env.NEXT_PUBLIC_DIR}</div>
                <div style={{ fontSize:12 }}>{process.env.NEXT_PUBLIC_RUC}</div>
              </div>
              <Grid container spacing={1} sx={{ mt: 0}} className={styles['noPadding']}>

                <Grid item xs={6} style={{paddingTop: 0}}>
                  NOTA DE DESPACHO
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {comprobante.numeracion}
                </Grid>              
                <Grid item xs={6} style={{paddingTop: 0}}>
                  RAZON SOCIAL
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {comprobante.Receptor?.razon_social}
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  RUC
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {comprobante.Receptor?.numero_documento}
                </Grid>                             
                  
                {comprobante.placa? <>
                  <Grid item xs={6} style={{paddingTop: 0}}>PLACA</Grid>
                  <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.placa.toUpperCase() }</Grid>              
                </> : <></>}

                <Grid item xs={6} style={{paddingTop: 0}}>FECHA</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{ new Date(comprobante.fecha_abastecimiento).toLocaleString('es-PE', { timeZone: 'UTC' }) }</Grid>

                <Grid item xs={6} style={{paddingTop: 0}}>Usuario: </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{session?.user.nombre}</Grid>

                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Producto</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Cant</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Valor</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Importe</Grid>

                {
                    comprobante.items.map( item => (
                        <Grid container key={ item.codigo_producto } sx={{ml:1}}>
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.descripcion }</Grid>  
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.cantidad }</Grid>  
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.valor.toFixed(5) }</Grid>  
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.valor_venta.toFixed(5) }</Grid>  

                        </Grid>
                    ))
                }
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Gravadas: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.gravadas }</Grid>  

                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>IGV(18%)</Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.igv }</Grid>  

                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Total: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total }</Grid>  
              </Grid>            
          </>;
        case constantes.TipoComprobante.Calibracion:
          return <>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontSize:14 }}>{process.env.NEXT_PUBLIC_RS}</div>
                <div style={{ fontSize:10 }}>{process.env.NEXT_PUBLIC_DIR}</div>
                <div style={{ fontSize:12 }}>{process.env.NEXT_PUBLIC_RUC}</div>
              </div>
              <Grid container spacing={1} sx={{ mt: 0}} className={styles['noPadding']}>

                <Grid item xs={6} style={{paddingTop: 0}}>
                  CALIBRACION
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {comprobante.numeracion}
                </Grid>              
                <Grid item xs={6} style={{paddingTop: 0}}>
                  CLIENTE
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {comprobante.Receptor?.razon_social}
                </Grid> 
                <Grid item xs={6} style={{paddingTop: 0}}>
                  DNI
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {comprobante.Receptor?.numero_documento}
                </Grid>                           
                  
                {comprobante.placa? <>
                  <Grid item xs={6} style={{paddingTop: 0}}>PLACA</Grid>
                  <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.placa.toUpperCase() }</Grid>              
                </> : <></>}

                <Grid item xs={6} style={{paddingTop: 0}}>FECHA</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{ new Date(comprobante.fecha_abastecimiento).toLocaleString('es-PE', { timeZone: 'UTC' }) }</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>Usuario: </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{session?.user.nombre}</Grid>

                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Producto</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Cant</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Valor</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Importe</Grid>

                {
                    comprobante.items.map( item => (
                        <Grid container key={ item.codigo_producto } sx={{ml:1}}>
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.descripcion }</Grid>  
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.cantidad }</Grid>  
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.valor.toFixed(5) }</Grid>  
                          <Grid item xs={3} style={{paddingTop: 0}}>{ item.valor_venta.toFixed(5) }</Grid>  

                        </Grid>
                    ))
                }
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Gravadas: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.gravadas }</Grid>  

                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>IGV(18%)</Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.igv }</Grid>  

                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Total: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total }</Grid>  
              </Grid>  
          </>;        
      }
    }else{
      return(<></>)
    }
  }
    return (
        <div style={{ display: "none" }}>

            <div ref={ref as RefObject<HTMLDivElement>} style={{ fontSize:11, marginLeft: 14, marginTop:-1, marginRight: 15, paddingLeft: 0, paddingTop: 0 }}>
            <div>
                { renderSwitch(props.comprobante) }
            </div>
            </div>
        </div>
    );
});

PrintComprobanteAdmin.displayName = 'MyPrintComprobanteAdmin';