import constantes from '@/helpers/constantes';
import { IComprobante } from '@/interfaces';
import { Grid } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { RefObject, forwardRef } from 'react'

type IPrintCierreProps = {
    totalizadores: TotalizadoresState;
};

interface TotalizadoresState {
    totDiesel:  {gal: number, sol: number};
    totPremium: {gal: number, sol: number};
    totRegular: {gal: number, sol: number};
    totGlp:     {gal: number, sol: number};
    totGalones: {gal: number, sol: number};
    tot:        {efectivo: number, tarjeta: number, yape: number};
    totDespacho: number;
    totCerafin: number;
    Total: number;
}
  
export const PrintCierre = forwardRef((props: IPrintCierreProps, ref) => {

    const { data: session, status } = useSession()
    const totalizadores = props.totalizadores;

    var today = new Date()
    today.setHours(today.getHours() - 5);    

    return (
        <div style={{ display: "none" }}>
          <div ref={ref as RefObject<HTMLDivElement>} style={{ fontSize:11, marginLeft: 14, marginTop:-1, marginRight: 15, paddingLeft: 0, paddingTop: 0 }}>
            <div style={{border:'2px solid'}}>
            <>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontSize:25 }}>CIERRE TURNO: {session?.user.jornada}</div>
                <div style={{ fontSize:20 }}>ISLA: {session?.user.isla}</div>
                <div style={{ fontSize:20 }}>SALIDA: {today.toLocaleString('es-PE', { timeZone: 'UTC' })}</div>
                <div style={{ fontSize:20 }}>USUARIO: {session?.user.nombre}</div>
            </div>
            <Grid container spacing={1} sx={{ mt: 0}}>
                <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>VENTA GALONES</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>DIESEL DB5 S50</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{ totalizadores.totDiesel.gal.toFixed(3) }</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>PREMIUM</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{ totalizadores.totPremium.gal.toFixed(3) }</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>REGULAR</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{ totalizadores.totRegular.gal.toFixed(3) }</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>GLP</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>{ totalizadores.totGlp.gal.toFixed(3) }</Grid>

                <Grid item xs={6} style={{paddingTop: 0, fontWeight: 'bold'}}>TOTAL GALONES</Grid>
                <Grid item xs={6} style={{paddingTop: 0, fontWeight: 'bold'}}>{ totalizadores.totGalones.gal.toFixed(3) }</Grid>                

                <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>VENTA SOLES</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>DIESEL DB5 S50</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>S/ { totalizadores.totDiesel.sol }</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>PREMIUM</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>S/ { totalizadores.totPremium.sol.toFixed(2) }</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>REGULAR</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>S/ { totalizadores.totRegular.sol.toFixed(2) }</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>GLP</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>S/ { totalizadores.totGlp.sol.toFixed(2) }</Grid>

                <Grid item xs={6} style={{paddingTop: 0, fontWeight: 'bold'}}>TOTAL SOLES</Grid>
                <Grid item xs={6} style={{paddingTop: 0, fontWeight: 'bold'}}>S/ { totalizadores.totGalones.sol.toFixed(2) }</Grid>                    

                <Grid item xs={12} style={{paddingTop: 0, fontWeight: 'bold', marginTop: 2, fontSize:15}}>VENTA POR TIPO DE PAGO</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>EFECTIVO</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>S/ { totalizadores.tot.efectivo.toFixed(2) }</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>TARJETA</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>S/ { totalizadores.tot.tarjeta.toFixed(2) }</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>YAPE/PLIN</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>S/ { totalizadores.tot.yape.toFixed(2) }</Grid>                
                <Grid item xs={6} style={{paddingTop: 0}}>CREDITO</Grid>
                <Grid item xs={6} style={{paddingTop: 0}}>S/ { totalizadores.totDespacho.toFixed(2) }</Grid>                

                <Grid item xs={6} style={{paddingTop: 0, fontWeight: 'bold'}}>TOTAL</Grid>
                <Grid item xs={6} style={{paddingTop: 0, fontWeight: 'bold'}}>S/ { totalizadores.Total.toFixed(2) }</Grid>
            </Grid>            
        </>
            </div>
            </div>
        </div>
      );

});

PrintCierre.displayName = 'MyPrintCierre';
