import React from 'react'
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import { IFuel, IReceptor } from '@/interfaces';

type IPrintPosProps = {
  receptor: IReceptor;
  ticket: string;
  fuel?: IFuel;
  hash?: string;
  qr?: string;
};

//TODO: crear el codigo QR correcto
// eslint-disable-next-line react/display-name
export const PrintPos = React.forwardRef((props: IPrintPosProps, ref) => {
    // console.log(props.ticket);
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ fontSize:11, margin:"auto", paddingLeft:15 }}>
        <div>SIRCON ENERGY E.I.R.L.RUC: 20502293606</div>
        <div>CAL.ANTARES NRO. 119 URB. ALMTE. MIGUEL GRAU - VENTANILLA - CALLAO - CALLAO</div>
        <div>F. Emision: 21/03/23 {props.ticket}</div>
        <div>TOTAL VENTA GRAVADAS S/{ ((props.fuel?props.fuel.valorTotal:0)/1.18).toFixed(2) }</div>
        <div>IGV 18% S/{ (((props.fuel?props.fuel.valorTotal:0)/1.18)*0.18).toFixed(2) }</div>
        <div>IMPORTE TOTAL S/{ props.fuel?.valorTotal }</div>
        <div>RUC: {props.receptor.numero_documento}</div>
        <div>Razon social: {props.receptor.razon_social}</div>
        <div>V.RESUMEN: {props.hash}</div>
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
          
      <QRCode
        size={350}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={props.qr?props.qr:""}
        viewBox={`0 0 256 256`}
      />
</div>
      </div>
    );
  });
