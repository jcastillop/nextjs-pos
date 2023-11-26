import { getDatetimeFormatFromString, getTodayDatetime } from '@/helpers';
import constantes from '@/helpers/constantes';
import { ICierreTurnoPrint, ICierreTurnoTotalesPrint, IComprobante, IGasto } from '@/interfaces';
import { Grid, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { RefObject, forwardRef } from 'react'

type IPrintCierreProps = {
    totalGalones: ICierreTurnoPrint[];
    totales: ICierreTurnoTotalesPrint;
    gastos: IGasto[];
    horaIngreso: string;
};
  
export const PrintCierreTurno = forwardRef(({horaIngreso, totalGalones, totales, gastos}: IPrintCierreProps, ref) => {

    const { data: session, status } = useSession()

    var today = new Date()
    today.setHours(today.getHours() - 5);    

    const efectivo: number = totales.efectivo?totales.efectivo:0
    const tarjeta: number  = totales.tarjeta?totales.tarjeta:0
    const yape: number  = totales.yape?totales.yape:0

    const { tot_notas_serafin_soles, tot_notas_serafin_galones, tot_venta_soles, tot_venta_galones } = totalGalones.reduce((a,b) => {
        return ({
            tot_notas_serafin_soles: a.tot_notas_serafin_soles + b.calibracion_soles + b.despacho_soles,
            tot_notas_serafin_galones: a.tot_notas_serafin_galones + b.calibracion_galones + b.despacho_galones,
            tot_venta_soles: a.tot_venta_soles + b.total_soles,
            tot_venta_galones: a.tot_venta_galones + b.total_galones,
        })
    }, {tot_notas_serafin_soles : 0, tot_notas_serafin_galones: 0, tot_venta_soles: 0, tot_venta_galones:0})

    return (
        <div style={{ display: "none" }}>
          <div ref={ref as RefObject<HTMLDivElement>} style={{ fontSize:11, marginLeft: 14, marginTop:-1, marginRight: 15, paddingLeft: 0, paddingTop: 0 }}>
          <div>
            <>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize:15 }}>CIERRE TURNO</div>
                <div style={{ fontSize:15 }}>{session?.user.jornada} - {session?.user.isla}</div>
                <div style={{ fontSize:12 }}>INICIO: { getDatetimeFormatFromString(horaIngreso) }</div>
                <div style={{ fontSize:12 }}>FIN: { getTodayDatetime()}</div>
                <div style={{ fontSize:12 }}>USUARIO: {session?.user.nombre}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize:15, marginTop: 8 }}><b>NOTA DESPACHO/SERAFIN</b></div>
            </div>
            <Grid container spacing={1} sx={{ mt: 0}} style={{ border: "1px solid grey" }}>
                <Grid item xs={6}><Typography sx={{ fontWeight: 'bold' }}>NOTAS DE DESPACHO</Typography></Grid> 
                <Grid item xs={3}><Typography sx={{ fontWeight: 'bold' }}>GALONES</Typography></Grid>               
                <Grid item xs={3}><Typography sx={{ fontWeight: 'bold' }}>MONTO</Typography></Grid>                      
                {
                    totalGalones.map((galones:ICierreTurnoPrint)=>(
                        <Grid container key={ galones.producto } style={{ marginLeft: 10 }}>
                            <Grid item xs={6} style={{paddingTop: 0}}>{ galones.producto }</Grid>
                            <Grid item xs={3} style={{paddingTop: 0, paddingLeft: 5}}>{ galones.despacho_galones.toFixed(3) }</Grid>
                            <Grid item xs={3} style={{paddingTop: 0, paddingLeft: 5}}>S/{ galones.despacho_soles.toFixed(2) }</Grid>
                        </Grid>
                    ))
                }

                <Grid item xs={6}><Typography sx={{ fontWeight: 'bold' }}>CALIBRACION/SERAFIN</Typography></Grid> 
                <Grid item xs={3}><Typography sx={{ fontWeight: 'bold' }}>GALONES</Typography></Grid>               
                <Grid item xs={3}><Typography sx={{ fontWeight: 'bold' }}>MONTO</Typography></Grid>                                      
                {
                    totalGalones.map((galones:ICierreTurnoPrint)=>(
                        <Grid container key={ galones.producto } style={{ marginLeft: 10 }}>
                            <Grid item xs={6} style={{paddingTop: 0}}>{ galones.producto }</Grid>
                            <Grid item xs={3} style={{paddingTop: 0, paddingLeft: 5}}>{ galones.calibracion_galones.toFixed(3) }</Grid>
                            <Grid item xs={3} style={{paddingTop: 0, paddingLeft: 5}}>S/{ galones.calibracion_soles.toFixed(2) }</Grid>
                        </Grid>
                    ))
                }                
                <Grid item xs={6} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>TOTAL</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>{ tot_notas_serafin_galones.toFixed(3) }</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>S/ { tot_notas_serafin_soles.toFixed(2) }</Grid>
            </Grid>            

            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize:15, marginTop: 8 }}><b>VENTA POR GALONES</b></div>
            </div>

            <Grid container spacing={1} sx={{ mt: 0}} style={{ border: "1px solid grey" }}>
                <Grid item xs={6}><Typography sx={{ fontWeight: 'bold' }}>PRODUCTO</Typography></Grid> 
                <Grid item xs={3}><Typography sx={{ fontWeight: 'bold' }}>GALONES</Typography></Grid>               
                <Grid item xs={3}><Typography sx={{ fontWeight: 'bold' }}>MONTO</Typography></Grid>               
                {
                    totalGalones.map((galones:ICierreTurnoPrint)=>(
                        <Grid container key={ galones.producto } style={{ marginLeft: 10 }}>
                            <Grid item xs={6} style={{paddingTop: 0}}>{ galones.producto }</Grid>
                            <Grid item xs={3} style={{paddingTop: 0, paddingLeft: 5}}>{ galones.total_galones.toFixed(3) }</Grid>
                            <Grid item xs={3} style={{paddingTop: 0, paddingLeft: 5}}>S/ { galones.total_soles.toFixed(2) }</Grid>
                        </Grid>
                    ))
                }
                <Grid item xs={6} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>TOTAL</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>{ tot_venta_galones.toFixed(3) }</Grid>
                <Grid item xs={3} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>S/ { tot_venta_soles.toFixed(2) }</Grid>                
            </Grid>

            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize:15, marginTop: 8 }}><b>VENTA POR TIPO DE PAGO</b></div>
            </div>
                        
            <Grid container spacing={1} sx={{ mt: 0}} style={{ border: "1px solid grey" }}>
                <Grid container style={{ marginLeft: 10 }}>
                    <Grid item xs={6}><Typography sx={{ fontWeight: 'bold' }}>METODO PAGO</Typography></Grid> 
                    <Grid item xs={3}><Typography sx={{ fontWeight: 'bold' }}>MONTO</Typography></Grid>                                   
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
            {
                gastos && gastos.length > 0 && (
                    <>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize:15, marginTop: 8 }}><b>GASTOS</b></div>
                        </div>        
                        <Grid container spacing={1} sx={{ mt: 0}} style={{ border: "1px solid grey" }}>
                            <Grid item xs={6} justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>CONCEPTO</Typography></Grid> 
                            <Grid item xs={6} justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>MONTO</Typography></Grid>                             
                        {
                            gastos.map((gasto:IGasto)=>(
                                <Grid container key={ gasto.id } style={{ marginLeft: 10 }}>
                                    <Grid item xs={6} style={{paddingTop: 0}}>{ gasto.concepto }</Grid>
                                    <Grid item xs={6} style={{paddingTop: 0}}>S/ { gasto.monto.toFixed(2) }</Grid>
                                </Grid>
                            ))
                        }
                        </Grid>
                    </>
                )
            }
            </>
            </div>
            </div>
        </div>
      );

});

PrintCierreTurno.displayName = 'MyPrintCierreTurno';

