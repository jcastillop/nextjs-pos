import { ICierreTurno } from '@/interfaces/cierreturno';
import { Divider, Grid } from '@mui/material';
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
                <div>
                    <div style={{ textAlign: 'center', marginBottom: 8 }}>
                        <div style={{ fontSize:15 }}>CIERRE DIA</div>
                        <div style={{ fontSize:15 }}>{session?.user.jornada} - {session?.user.isla}</div>
                        <div style={{ fontSize:12 }}>USUARIO: {session?.user.nombre}</div>
                        <div style={{ fontSize:12 }}>CANTIDAD: { cierreTurnos.length } cierres</div>
                    </div>
                    <Grid container spacing={1} sx={{ mt: 0}}>
                        <Grid item xs={12} style={{paddingTop: 0}}>------------------</Grid>
                        {
                            cierreTurnos.map( (cierres: any) =>(
                                <Grid container key={ cierres.id } style={{ marginLeft: 10, marginTop: 2 }}>
                                    <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', fontSize:12}}>
                                        { cierres.turno }/{ cierres.isla }
                                    </Grid>
                                    <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', fontSize:12}}>
                                        Usuario: { cierres.Usuario.nombre }
                                    </Grid>                                    
                                    <Grid item xs={4} style={{paddingTop: 0}}>EFECTIVO</Grid>
                                    <Grid item xs={4} style={{paddingTop: 0}}>TARJETA</Grid>
                                    <Grid item xs={4} style={{paddingTop: 0}}>PLIN/YAPE</Grid>
                                    <Grid item xs={4} style={{paddingTop: 0}}>S/ { cierres.efectivo.toFixed(2) }</Grid>
                                    <Grid item xs={4} style={{paddingTop: 0}}>S/ { cierres.tarjeta.toFixed(2) }</Grid>
                                    <Grid item xs={4} style={{paddingTop: 0}}>S/ { (cierres.yape?cierres.yape:0).toFixed(2) }</Grid>
                                    <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', fontSize:12}}>
                                        TOTAL: S/ { cierres.total.toFixed(2) }
                                    </Grid>
                                    <Grid item xs={12} style={{paddingTop: 0}}>------------------</Grid>
                                </Grid>
                            ))
                        }
                        {/* <Grid item xs={6} style={{paddingTop: 0}}>TOTAL EFECTIVO</Grid>
                        <Grid item xs={6} style={{paddingTop: 0}}>S/ { totalEfectivo.toFixed(2) }</Grid>
                        <Grid item xs={6} style={{paddingTop: 0}}>TOTAL TARJETA</Grid>
                        <Grid item xs={6} style={{paddingTop: 0}}>S/ { totalTarjeta.toFixed(2) }</Grid> */}
                    </Grid>            
                </div>
            </div>
        </div>
      );
});

PrintCierreDia.displayName = 'MyPrintCierreDia';