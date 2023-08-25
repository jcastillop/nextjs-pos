import { ICierreTurno } from '@/interfaces/cierreturno';
import { Grid } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { RefObject, forwardRef } from 'react'

type IPrintCierreDiaProps = {
    cierreTurnos: ICierreTurno[];
};

export const PrintCierreDia = forwardRef((props: IPrintCierreDiaProps, ref) => {

    const { data: session, status } = useSession()
    const cierreTurnos: ICierreTurno[]= props.cierreTurnos;

    const { totalEfectivo, totalTarjeta } = cierreTurnos
    .map(cierre=>({totalEfectivo: +cierre.efectivo, totalTarjeta: +cierre.tarjeta}))
    .reduce((a, b) => {
        return ({
            totalEfectivo: a.totalEfectivo + b.totalEfectivo || 0,
            totalTarjeta: a.totalTarjeta + b.totalTarjeta || 0
            });
    },{totalEfectivo: 0, totalTarjeta: 0 })    


    return (
        <div style={{ display: "none" }}>
            <div ref={ref as RefObject<HTMLDivElement>} style={{ fontSize:11, marginLeft: 14, marginTop:-1, marginRight: 15, paddingLeft: 0, paddingTop: 0 }}>
                <div style={{border:'2px solid'}}>
                    <div style={{ textAlign: 'center', marginBottom: 8 }}>
                        <div style={{ fontSize:25 }}>{session?.user.jornada}</div>
                        <div style={{ fontSize:20 }}>{session?.user.isla}</div>
                        <div style={{ fontSize:20 }}>USUARIO: {session?.user.nombre}</div>
                    </div>
                    <Grid container spacing={1} sx={{ mt: 0}}>
                        {
                            cierreTurnos.map( (cierres: any) =>(
                                <div key={ cierres.id }>
                                <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>
                                    { cierres.turno } - { cierres.isla } - { cierres.Usuario.usuario }
                                </Grid>
                                <Grid item xs={6} style={{paddingTop: 0}}>EFECTIVO</Grid>
                                <Grid item xs={6} style={{paddingTop: 0}}>S/ { cierres.efectivo.toFixed(2) }</Grid>
                                <Grid item xs={6} style={{paddingTop: 0}}>TARJETA</Grid>
                                <Grid item xs={6} style={{paddingTop: 0}}>S/ { cierres.tarjeta.toFixed(2) }</Grid>
                                </div>
                            ))
                        }
                        <Grid item xs={6} style={{paddingTop: 0}}>TOTAL EFECTIVO</Grid>
                        <Grid item xs={6} style={{paddingTop: 0}}>S/ { totalEfectivo.toFixed(2) }</Grid>
                        <Grid item xs={6} style={{paddingTop: 0}}>TOTAL TARJETA</Grid>
                        <Grid item xs={6} style={{paddingTop: 0}}>S/ { totalTarjeta.toFixed(2) }</Grid>
                    </Grid>            
                </div>
            </div>
        </div>
      );
});

PrintCierreDia.displayName = 'MyPrintCierreDia';