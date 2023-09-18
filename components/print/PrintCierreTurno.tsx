import { getTodayDatetime } from '@/helpers';
import constantes from '@/helpers/constantes';
import { ICierreTurnoPrint, ICierreTurnoTotalesPrint, IComprobante } from '@/interfaces';
import { Grid } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { RefObject, forwardRef } from 'react'

type IPrintCierreProps = {
    totalGalones: ICierreTurnoPrint[];
    totalProducto: ICierreTurnoPrint[];
    totales: ICierreTurnoTotalesPrint;
    horaIngreso: string;
};
  
export const PrintCierreTurno = forwardRef(({horaIngreso, totalGalones, totalProducto, totales}: IPrintCierreProps, ref) => {

    const { data: session, status } = useSession()

    var today = new Date()
    today.setHours(today.getHours() - 5);    

    return (
        <div style={{ display: "none" }}>
          <div ref={ref as RefObject<HTMLDivElement>} style={{ fontSize:11, marginLeft: 14, marginTop:-1, marginRight: 15, paddingLeft: 0, paddingTop: 0 }}>
            <div style={{border:'2px solid'}}>
            <>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontSize:25 }}>CIERRE TURNO: {session?.user.jornada} - ISLA: {session?.user.isla}</div>
                <div style={{ fontSize:20 }}>INICIO: { horaIngreso } - FIN: {getTodayDatetime()}</div>
                <div style={{ fontSize:20 }}>USUARIO: {session?.user.nombre}</div>
            </div>
            <Grid container spacing={1} sx={{ mt: 0}}>
                <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>VENTA GALONES</Grid>
                {
                    totalGalones.map((galones:ICierreTurnoPrint)=>(
                        <>
                            <Grid item xs={6} style={{paddingTop: 0}}>{ galones.producto }</Grid>
                            <Grid item xs={6} style={{paddingTop: 0}}>{ galones.total.toFixed(3) }</Grid>
                        </>
                    ))
                }
                <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>VENTA SOLES</Grid>
                {
                    totalProducto.map((producto:ICierreTurnoPrint)=>(
                        <>
                            <Grid item xs={6} style={{paddingTop: 0}}>S/ { producto.producto }</Grid>
                            <Grid item xs={6} style={{paddingTop: 0}}>S/ { producto.total.toFixed(2) }</Grid>
                        </>
                    ))
                }
                <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>VENTA POR TIPO DE PAGO</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>EFECTIVO</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>S/ { (totales.efectivo?totales.efectivo:0).toFixed(2) }</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>TARJETA</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>S/ { (totales.tarjeta?totales.tarjeta:0).toFixed(2) }</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>YAPE/PLIN</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>S/ { (totales.yape?totales.yape:0).toFixed(2) }</Grid>                       

            </Grid>            
        </>
            </div>
            </div>
        </div>
      );

});

PrintCierreTurno.displayName = 'MyPrintCierreTurno';

