import React, { RefObject, forwardRef } from 'react'
import QRCode from "react-qr-code";
import { IComprobante, IReceptor } from '@/interfaces';
import { useSession } from 'next-auth/react';
import constantes from '@/helpers/constantes';
import { Grid } from '@mui/material';

import styles from './PrintPos.module.css';

export type IPrintPosProps = {
  receptor: IReceptor;
  comprobante: IComprobante;
};

export const PrintPos = forwardRef((props: IPrintPosProps, ref) => {

  const { data: session, status } = useSession()

  const renderSwitch = (receptor: IReceptor, comprobante: IComprobante) => {

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
                  {comprobante.numeracion_comprobante}
                </Grid>              
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {(comprobante.tipo_comprobante==constantes.TipoComprobante.Factura)?'RAZON SOCIAL ':'CLIENTE '}
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {receptor.razon_social}
                </Grid>              
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {(comprobante.tipo_comprobante==constantes.TipoComprobante.Factura)?'RUC ':'DNI'}
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {receptor.numero_documento}
                </Grid>   
                  
                {comprobante.placa? <>
                  <Grid item xs={6} style={{paddingTop: 0}}>PLACA</Grid>
                  <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.placa }</Grid>              
                </> : <></>}

                <Grid item xs={6} style={{paddingTop: 0}}>FECHA</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.fecha_emision }</Grid>

                <Grid item xs={3} style={{paddingTop: 0}}>Usuario: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>{session?.user.usuario}</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Producto: </Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>{ comprobante.dec_combustible.substring(0,9) }</Grid>

                <Grid item xs={3} style={{paddingTop: 0}}>Galones: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>{ comprobante.volumen }</Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Importe: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total_gravadas }</Grid>     

                <Grid item xs={3} style={{paddingTop: 0}}>Precio: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.producto_precio }</Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Igv: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total_igv }</Grid> 

                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Total: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total_venta }</Grid>                

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
                  {comprobante.numeracion_comprobante}
                </Grid>              
                <Grid item xs={6} style={{paddingTop: 0}}>
                  RAZON SOCIAL
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {receptor.razon_social}
                </Grid>              
                <Grid item xs={6} style={{paddingTop: 0}}>
                  RUC
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {receptor.numero_documento}
                </Grid>   
                  
                {comprobante.placa? <>
                  <Grid item xs={6} style={{paddingTop: 0}}>PLACA</Grid>
                  <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.placa }</Grid>              
                </> : <></>}

                <Grid item xs={6} style={{paddingTop: 0}}>FECHA</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.fecha_emision }</Grid>

                <Grid item xs={3} style={{paddingTop: 0}}>Usuario: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>{session?.user.usuario}</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Producto: </Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>{ comprobante.dec_combustible.substring(0,9) }</Grid>

                <Grid item xs={3} style={{paddingTop: 0}}>Galones: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>{ comprobante.volumen }</Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Importe: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total_gravadas }</Grid>     

                <Grid item xs={3} style={{paddingTop: 0}}>Precio: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.producto_precio }</Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Igv: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total_igv }</Grid> 

                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Total: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total_venta }</Grid>                

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
                  {comprobante.numeracion_comprobante}
                </Grid>              
                <Grid item xs={6} style={{paddingTop: 0}}>
                  RAZON SOCIAL
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {receptor.razon_social}
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  RUC
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {receptor.numero_documento}
                </Grid>                             
                  
                {comprobante.placa? <>
                  <Grid item xs={6} style={{paddingTop: 0}}>PLACA</Grid>
                  <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.placa }</Grid>              
                </> : <></>}

                <Grid item xs={6} style={{paddingTop: 0}}>FECHA</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.fecha_emision }</Grid>

                <Grid item xs={3} style={{paddingTop: 0}}>Usuario: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>{session?.user.usuario}</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Producto: </Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>{ comprobante.dec_combustible.substring(0,9) }</Grid>

                <Grid item xs={3} style={{paddingTop: 0}}>Galones: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>{ comprobante.volumen }</Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Importe: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total_gravadas }</Grid>     

                <Grid item xs={3} style={{paddingTop: 0}}>Precio: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.producto_precio }</Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Igv: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total_igv }</Grid> 

                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Total: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total_venta }</Grid>                

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
                  {comprobante.numeracion_comprobante}
                </Grid>              
                <Grid item xs={6} style={{paddingTop: 0}}>
                  CLIENTE
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {receptor.razon_social}
                </Grid> 
                <Grid item xs={6} style={{paddingTop: 0}}>
                  DNI
                </Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>
                  {receptor.numero_documento}
                </Grid>                           
                  
                {comprobante.placa? <>
                  <Grid item xs={6} style={{paddingTop: 0}}>PLACA</Grid>
                  <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.placa }</Grid>              
                </> : <></>}

                <Grid item xs={6} style={{paddingTop: 0}}>FECHA</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{ comprobante.fecha_emision }</Grid>

                <Grid item xs={3} style={{paddingTop: 0}}>Usuario: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>{session?.user.usuario}</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>Producto: </Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold'}}>{ comprobante.dec_combustible.substring(0,8) }</Grid>

                <Grid item xs={3} style={{paddingTop: 0}}>Galones: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>{ comprobante.volumen }</Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Importe: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total_gravadas }</Grid>     

                <Grid item xs={3} style={{paddingTop: 0}}>Precio: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.producto_precio }</Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Igv: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total_igv }</Grid> 

                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}></Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>Total: </Grid>
                <Grid item xs={3} style={{paddingTop: 0}}>S/{ comprobante.total_venta }</Grid>                

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
          <div style={{border:'2px solid'}}>
                    { renderSwitch(props.receptor, props.comprobante) }
                  </div>
          </div>
      </div>
    );
});

PrintPos.displayName = 'MyPrintPos';