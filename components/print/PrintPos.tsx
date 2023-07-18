import React from 'react'
import QRCode from "react-qr-code";
import { IComprobante, IReceptor } from '@/interfaces';

export type IPrintPosProps = {
  receptor: IReceptor | "";
  comprobante: IComprobante | "";
};

//TODO: crear el codigo QR correcto
// eslint-disable-next-line react/display-name
export const PrintPos = React.forwardRef((props: IPrintPosProps, ref) => {

    return (

      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ fontSize:11, margin:"auto", paddingLeft:15 }}>
        {
          (props.comprobante && props.receptor)?          
          <>
            <div>SIRCON ENERGY E.I.R.L.RUC: 20502293606</div>
            <div>CAL.ANTARES NRO. 119 URB. ALMTE. MIGUEL GRAU - VENTANILLA - CALLAO - CALLAO</div>
            <div>F. Emision: {props.comprobante.fecha_emision} {props.comprobante.numeracion_documento_afectado}</div>
            <div>TOTAL VENTA GRAVADAS S/{ props.comprobante.total_gravadas }</div>
            <div>IGV 18% S/{ props.comprobante.total_igv }</div>
            <div>IMPORTE TOTAL S/{ props.comprobante.total_venta }</div>
            <div>RUC: {props.receptor.numero_documento}</div>
            <div>Razon social: {props.receptor.razon_social}</div>
            <div>V.RESUMEN: {props.comprobante.codigo_hash}</div>
            <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
              
              <QRCode
                size={350}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={ props.comprobante.cadena_para_codigo_qr }
                viewBox={`0 0 256 256`}
              />
            </div>          
          </>:<></>
        }


      </div>
    );
});