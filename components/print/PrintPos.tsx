import React, { RefObject, forwardRef } from 'react'
import QRCode from "react-qr-code";
import { IComprobante, IReceptor } from '@/interfaces';
import { useSession } from 'next-auth/react';
import constantes from '@/helpers/constantes';

export type IPrintPosProps = {
  receptor: IReceptor;
  comprobante: IComprobante;
};

export const PrintPos = forwardRef((props: IPrintPosProps, ref) => {

  const { data: session, status } = useSession()

  const renderSwitch = (receptor: IReceptor, comprobante: IComprobante) => {
    
    switch(comprobante.tipo_comprobante) {
      case constantes.TipoComprobante.Factura:
      case constantes.TipoComprobante.Boleta:
        return <>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontSize:14 }}>{process.env.NEXT_PUBLIC_RS}</div>
              <div style={{ fontSize:10 }}>{process.env.NEXT_PUBLIC_DIR}</div>
              <div style={{ fontSize:12 }}>{process.env.NEXT_PUBLIC_RUC}</div>
            </div>
            <table style={{ width:270, padding: 0}}>
              <tbody>                    
                <tr>
                  <td style={{ width:100 }} colSpan={ 2 }>{(comprobante.tipo_comprobante==constantes.TipoComprobante.Factura)?'FACTURA':'BOLETA'} ELECTRONICA</td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:100 }} colSpan={ 2 }>{comprobante.numeracion_documento_afectado}</td>
                </tr>    
                <tr>
                  <td style={{ width:50 }}>{(comprobante.tipo_comprobante==constantes.TipoComprobante.Factura)?'Razon social: ':'Cliente: '}</td>
                  <td style={{ width:170 }} colSpan={ 4 }>{receptor.razon_social}</td>
                </tr> 
                <tr>
                  <td style={{ width:50 }}>{(comprobante.tipo_comprobante==constantes.TipoComprobante.Factura)?'RUC: ':'DNI: '}</td>
                  <td style={{ width:170 }} colSpan={ 4 }>{receptor.numero_documento}</td>
                </tr>                                                       
                <tr>
                  <td style={{ width:50 }}>Usuario</td>
                  <td style={{ width:50 }}>{session?.user.usuario}</td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:100 }} colSpan={ 2 }>Fecha: {comprobante.fecha_emision}</td>
                </tr>                 
                <tr>
                  <td style={{ width:50 }}>Product</td>
                  <td style={{ width:50 }}>{ comprobante.dec_combustible.substring(0,7) }</td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:50}}>IMP S/</td>
                  <td style={{ width:50}}>{ comprobante.total_gravadas }</td>
                </tr>  
                <tr>
                  <td style={{ width:50 }}>Galones</td>
                  <td style={{ width:50 }}>{ comprobante.volumen }</td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:50}}>IGV S/</td>
                  <td style={{ width:50}}>{ comprobante.total_igv }</td>
                </tr>
                <tr>
                  <td style={{ width:50 }}></td>
                  <td style={{ width:50 }}></td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:50}}>TOT S/</td>
                  <td style={{ width:50}}>{ comprobante.total_venta }</td>
                </tr>                
              </tbody>                                  
            </table>            
            <div style={{ height: "auto", margin: "0 auto", maxWidth: 80, width: "100%", borderTop:5 }}>
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
            <table style={{ width:270, padding: 0}}>
              <tbody>                    
                <tr>
                  <td style={{ width:100 }} colSpan={ 2 }>NOTA DE DESPACHO</td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:100 }} colSpan={ 2 }>{comprobante.numeracion_documento_afectado}</td>
                </tr>    
                <tr>
                  <td style={{ width:50 }}>Razon social: </td>
                  <td style={{ width:170 }} colSpan={ 4 }>{receptor.razon_social}</td>
                </tr> 
                <tr>
                  <td style={{ width:50 }}>RUC: </td>
                  <td style={{ width:170 }} colSpan={ 4 }>{receptor.numero_documento}</td>
                </tr>                                                       
                <tr>
                  <td style={{ width:50 }}>Usuario</td>
                  <td style={{ width:50 }}>{session?.user.usuario}</td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:100 }} colSpan={ 2 }>Fecha: {comprobante.fecha_emision}</td>
                </tr>                 
                <tr>
                  <td style={{ width:50 }}>Product</td>
                  <td style={{ width:50 }}>{ comprobante.dec_combustible.substring(0,7) }</td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:50}}>IMP S/</td>
                  <td style={{ width:50}}>{ comprobante.total_gravadas }</td>
                </tr>  
                <tr>
                  <td style={{ width:50 }}>Galones</td>
                  <td style={{ width:50 }}>{ comprobante.volumen }</td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:50}}>IGV S/</td>
                  <td style={{ width:50}}>{ comprobante.total_igv }</td>
                </tr>
                <tr>
                  <td style={{ width:50 }}></td>
                  <td style={{ width:50 }}></td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:50}}>TOT S/</td>
                  <td style={{ width:50}}>{ comprobante.total_venta }</td>
                </tr>                
              </tbody>                                  
            </table>
        </>;
      case constantes.TipoComprobante.Calibracion:
        return <>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontSize:14 }}>{process.env.NEXT_PUBLIC_RS}</div>
              <div style={{ fontSize:10 }}>{process.env.NEXT_PUBLIC_DIR}</div>
              <div style={{ fontSize:12 }}>{process.env.NEXT_PUBLIC_RUC}</div>
            </div>
            <table style={{ width:270, padding: 0}}>
              <tbody>                    
                <tr>
                  <td style={{ width:100 }} colSpan={ 2 }>CALIBRACION</td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:100 }} colSpan={ 2 }>{comprobante.numeracion_documento_afectado}</td>
                </tr>    
                <tr>
                  <td style={{ width:50 }}>Nombre: </td>
                  <td style={{ width:170 }} colSpan={ 4 }>{receptor.razon_social}</td>
                </tr> 
                <tr>
                  <td style={{ width:50 }}>DNI: </td>
                  <td style={{ width:170 }} colSpan={ 4 }>{receptor.numero_documento}</td>
                </tr>                                                       
                <tr>
                  <td style={{ width:50 }}>Usuario</td>
                  <td style={{ width:50 }}>{session?.user.usuario}</td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:100 }} colSpan={ 2 }>Fecha: {comprobante.fecha_emision}</td>
                </tr>                 
                <tr>
                  <td style={{ width:50 }}>Product</td>
                  <td style={{ width:50 }}>{ comprobante.dec_combustible.substring(0,7) }</td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:50}}></td>
                  <td style={{ width:50}}></td>
                </tr>  
                <tr>
                  <td style={{ width:50 }}>Galones</td>
                  <td style={{ width:50 }}>{ comprobante.volumen }</td>
                  <td style={{ width:20 }}></td>
                  <td style={{ width:50 }}></td>
                  <td style={{ width:50 }}></td>
                </tr>
              
              </tbody>                                  
            </table>
        </>;        
    }
  }


    return (
      <div style={{ display: "none" }}>
        <div ref={ref as RefObject<HTMLDivElement>} style={{ fontSize:11, margin:"auto", paddingLeft:15 }}>
          {
            (props.comprobante && props.receptor)?          
            <>
              <div style={{marginRight:8, marginTop:8}}>
                <div style={{border:'2px solid', padding: 3}}>
                  { renderSwitch(props.receptor, props.comprobante) }
                </div>
              </div>
            </>
            :<></>
          }
        </div>
      </div>
    );
});

PrintPos.displayName = 'MyPrintPos';