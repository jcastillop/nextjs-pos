import { getDatetimeFormatFromString, getTodayDatetime } from '@/helpers';
import constantes from '@/helpers/constantes';
import { ICierreTurnoPrint, ICierreTurnoTotalesPrint, IComprobante } from '@/interfaces';
import { Grid, Typography } from '@mui/material';
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

    const efectivo: number = totales.efectivo?totales.efectivo:0
    const tarjeta = totales.tarjeta?totales.tarjeta:0
    const yape = totales.yape?totales.yape:0

    return (
        <div style={{ display: "none" }}>
          <div ref={ref as RefObject<HTMLDivElement>} style={{ fontSize:11, marginLeft: 14, marginTop:-1, marginRight: 15, paddingLeft: 0, paddingTop: 0 }}>
          <div>
            <>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontSize:15 }}>CIERRE TURNO</div>
                <div style={{ fontSize:15 }}>{session?.user.jornada} - {session?.user.isla}</div>
                <div style={{ fontSize:12 }}>INICIO: { getDatetimeFormatFromString(horaIngreso) }</div>
                <div style={{ fontSize:12 }}>FIN: { getTodayDatetime()}</div>
                <div style={{ fontSize:12 }}>USUARIO: {session?.user.nombre}</div>
            </div>
            <Grid container spacing={1} sx={{ mt: 0}}>
                <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 3, fontSize:15}}>VENTA GALONES</Grid>
                <Grid item xs={6} justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>PRODUCTO</Typography></Grid> 
                <Grid item xs={2} justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>TOT.</Typography></Grid> 
                <Grid item xs={2} justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>DES.</Typography></Grid> 
                <Grid item xs={2} justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>CERA.</Typography></Grid>                 
                {
                    totalGalones.map((galones:ICierreTurnoPrint)=>(
                        <Grid container key={ galones.producto } style={{ marginLeft: 10 }}>
                            <Grid item xs={6} style={{paddingTop: 0}}>{ galones.producto }</Grid>
                            <Grid item xs={2} style={{paddingTop: 0}}>{ galones.total.toFixed(3) }</Grid>
                            <Grid item xs={2} style={{paddingTop: 0}}>{ (galones.despacho?galones.despacho:0).toFixed(3) }</Grid>
                            <Grid item xs={2} style={{paddingTop: 0}}>{ (galones.calibracion?galones.calibracion:0).toFixed(3) }</Grid>
                        </Grid>
                    ))
                }
                <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 3, fontSize:15}}>VENTA SOLES</Grid>
                <Grid item xs={6} justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>PRODUCTO</Typography></Grid> 
                <Grid item xs={2} justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>TOT.</Typography></Grid> 
                <Grid item xs={2} justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>DES.</Typography></Grid> 
                <Grid item xs={2} justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>CERA.</Typography></Grid>                   
                {
                    totalProducto.map((producto:ICierreTurnoPrint)=>(
                        <Grid container key={ producto.producto } style={{ marginLeft: 10 }}>
                            <Grid item xs={6} style={{paddingTop: 0}}>{ producto.producto }</Grid>
                            <Grid item xs={2} style={{paddingTop: 0}}>S/ { producto.total.toFixed(2) }</Grid>
                            <Grid item xs={2} style={{paddingTop: 0}}>S/ { (producto.despacho?producto.despacho:0).toFixed(2) }</Grid>
                            <Grid item xs={2} style={{paddingTop: 0}}>S/ { (producto.calibracion?producto.calibracion:0).toFixed(2) }</Grid>
                        </Grid>
                    ))
                }
                <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 3, fontSize:15}}>VENTA POR TIPO DE PAGO</Grid>
                <Grid container style={{ marginLeft: 10 }}>
                    <Grid item xs={6} style={{paddingTop: 0}}>EFECTIVO</Grid>
                    <Grid item xs={6} style={{paddingTop: 0}}>S/ { efectivo.toFixed(2) }</Grid>
                    <Grid item xs={6} style={{paddingTop: 0}}>TARJETA</Grid>
                    <Grid item xs={6} style={{paddingTop: 0}}>S/ { tarjeta.toFixed(2) }</Grid>
                    <Grid item xs={6} style={{paddingTop: 0}}>YAPE/PLIN</Grid>
                    <Grid item xs={6} style={{paddingTop: 0}}>S/ { yape.toFixed(2) }</Grid>                       
                    <Grid item xs={6} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>TOTAL</Grid>
                    <Grid item xs={6} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>S/ { (efectivo + tarjeta + yape).toFixed(2) }</Grid>                                       
                </Grid>

            </Grid>            
        </>
            </div>
            </div>
        </div>
      );

});

PrintCierreTurno.displayName = 'MyPrintCierreTurno';

