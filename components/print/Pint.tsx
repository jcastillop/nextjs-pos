import React, { useContext, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrintCierre } from './PrintCierre';
import { IComprobante } from '@/interfaces';
import constantes from '@/helpers/constantes';
import router from 'next/router';
import { FuelContext, UiContext } from '@/context';
import { getSession, useSession } from 'next-auth/react';
import { formatDateSQL, getActualDate } from "@/helpers/util";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFuels } from '@/hooks';

interface PrintTotalizadoresState {
    totDiesel:  {gal: number, sol: number};
    totPremium: {gal: number, sol: number};
    totRegular: {gal: number, sol: number};
    totGlp:     {gal: number, sol: number};
    totGalones:     {gal: number, sol: number};
    tot:        {efectivo: number, tarjeta: number, yape: number};
    totDespacho: number;
    totCerafin: number;
    Total: number;
}

const TOT_GALONES_INITIAL_STATE: PrintTotalizadoresState = {
    totDiesel:  {gal: 0, sol: 0},
    totPremium: {gal: 0, sol: 0},
    totRegular: {gal: 0, sol: 0},
    totGlp:     {gal: 0, sol: 0},
    totGalones:     {gal: 0, sol: 0},
    tot:        {efectivo: 0, tarjeta: 0, yape: 0},
    totDespacho:0,
    totCerafin:0,
    Total:0,
}

type Props = {
    comprobantes: IComprobante[]
}


export const Print: React.FC<Props> = ({comprobantes}) => {

    var totalizadores = TOT_GALONES_INITIAL_STATE;
    const componentRef = useRef(null);
    const { createCierre } = useContext(FuelContext)
    const { showAlert } = useContext( UiContext );
    const [value, setValue] = React.useState<Date>(new Date());
    const [isOpenDialog, setOpenDialog] = useState(false);
    const { data: session, status } = useSession()
    const handlePrint = useReactToPrint({
        pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",        
        content: () => componentRef.current,
        onAfterPrint: () => {
            totalizadores = TOT_GALONES_INITIAL_STATE;
            router.push("/");
        }
    });
    const { fuels, isLoading, isError } = useFuels('/abastecimientos/count/total',null,null,{ refreshInterval: 3}, '0', '100')

    const handleAceptar = async () => {
        if(fuels.length > 0){
            showAlert({mensaje: `Tiene abastecimientos pendientes por liquidar: ${ fuels.length }, no puede cerrar turno`, severity: 'error'})
        }else{
            if(comprobantes.length > 0){
                const session = await getSession();
                const data = await createCierre(parseInt(session?.user.id?session?.user.id:"0"), new Date(formatDateSQL(value)), session?.user.jornada || '', session?.user.isla || '',totalEfectivo, totalTarjeta, totalYape);            
                if(!data.hasError){
                    handlePrint();                
                    showAlert({mensaje: 'Turno cerrado satisfactoriamente', severity: 'success'})                
                }else{
                    showAlert({mensaje: data.message.toString(), severity: 'error'})
                }
            }else{
                showAlert({mensaje: 'No tiene cuenta por liquidar', severity: 'error'})
            }
        }

    }

    const [isOpenDate, setOpenDate] = useState(false);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };
  
    const handleClose = () => {
        setOpenDialog(false);
    };   

    function toggle() {
        setOpenDate((isOpenDate) => !isOpenDate);
    }

    

    const { totalDieselSol, totalDieselGal } = comprobantes
        .filter((comprobante)=>(comprobante.codigo_combustible == constantes.CodigoCombustible.DB5S50))
        .map(comprobante=>({totalDieselSol: +comprobante.total_venta, totalDieselGal: +comprobante.volumen}))
        .reduce((a, b) => {
            return ({
                totalDieselSol: a.totalDieselSol + b.totalDieselSol || 0,
                totalDieselGal: a.totalDieselGal + b.totalDieselGal || 0
                });
        },{totalDieselSol: 0, totalDieselGal: 0 })

    const { totalPremiumSol, totalPremiumGal } = comprobantes
        .filter((comprobante)=>(comprobante.codigo_combustible == constantes.CodigoCombustible.GPREMIUM1 || comprobante.codigo_combustible == constantes.CodigoCombustible.GPREMIUM2))
        .map(comprobante=>({totalPremiumSol: +comprobante.total_venta, totalPremiumGal: +comprobante.volumen}))
        .reduce((a, b) => {
            return ({
                totalPremiumSol: a.totalPremiumSol + b.totalPremiumSol || 0,
                totalPremiumGal: a.totalPremiumGal + b.totalPremiumGal || 0
                });
        },{totalPremiumSol: 0, totalPremiumGal: 0 })
        
    const { totalRegularSol, totalRegularGal } = comprobantes
        .filter((comprobante)=>(comprobante.codigo_combustible == constantes.CodigoCombustible.GREGULAR))
        .map(comprobante=>({totalRegularSol: +comprobante.total_venta, totalRegularGal: +comprobante.volumen}))
        .reduce((a, b) => {
            return ({
                totalRegularSol: a.totalRegularSol + b.totalRegularSol || 0,
                totalRegularGal: a.totalRegularGal + b.totalRegularGal || 0
                });
        },{totalRegularSol: 0, totalRegularGal: 0 })

    const { totalGlpSol, totalGlpGal } = comprobantes
        .filter((comprobante)=>(comprobante.codigo_combustible == constantes.CodigoCombustible.GLP))
        .map(comprobante=>({totalGlpSol: +comprobante.total_venta, totalGlpGal: +comprobante.volumen}))
        .reduce((a, b) => {
            return ({
                totalGlpSol: a.totalGlpSol + b.totalGlpSol || 0,
                totalGlpGal: a.totalGlpGal + b.totalGlpGal || 0
                });
        },{totalGlpSol: 0, totalGlpGal: 0 })    

    const { totalGalonesSol, totalGalonesGal } = comprobantes
        .map(comprobante=>({totalGalonesSol: +comprobante.total_venta, totalGalonesGal: +comprobante.volumen}))
        .reduce((a, b) => {
            return ({
                totalGalonesSol: a.totalGalonesSol + b.totalGalonesSol || 0,
                totalGalonesGal: a.totalGalonesGal + b.totalGalonesGal || 0
                });
        },{totalGalonesSol: 0, totalGalonesGal: 0 })          

    const { totalDespacho } = comprobantes
        .filter((comprobante)=>(comprobante.tipo_comprobante == constantes.TipoComprobante.NotaDespacho))
        .map(comprobante=>({totalDespacho: +comprobante.total_venta}))
        .reduce((a, b) => {
            return ({
                totalDespacho: a.totalDespacho + b.totalDespacho || 0
                });
        },{totalDespacho: 0 })

    const { totalCalibracion } = comprobantes
        .filter((comprobante)=>(comprobante.tipo_comprobante == constantes.TipoComprobante.Calibracion))
        .map(comprobante=>({totalCalibracion: +comprobante.total_venta}))
        .reduce((a, b) => {
            return ({
                totalCalibracion: a.totalCalibracion + b.totalCalibracion || 0
                });
        },{totalCalibracion: 0 }) 
        
    const { totalEfectivo, totalTarjeta, totalYape, total } = comprobantes
        .map(comprobante=>({totalEfectivo: +comprobante.pago_efectivo, totalTarjeta: +comprobante.pago_tarjeta, totalYape: +comprobante.pago_yape, total: +comprobante.total_venta}))
        .reduce((a, b) => {
            return ({
                totalEfectivo: a.totalEfectivo + b.totalEfectivo || 0,
                totalTarjeta: a.totalTarjeta + b.totalTarjeta || 0,
                totalYape: a.totalYape + b.totalYape || 0,
                total: a.total + b.total || 0,
                });
        },{totalEfectivo: 0, totalTarjeta: 0, totalYape: 0, total: 0 })      

    totalizadores.totDiesel.gal = totalDieselGal
    totalizadores.totDiesel.sol = totalDieselSol
    totalizadores.totPremium.gal = totalPremiumGal
    totalizadores.totPremium.sol = totalPremiumSol
    totalizadores.totRegular.gal = totalRegularGal
    totalizadores.totRegular.sol = totalRegularSol    
    totalizadores.totGlp.gal = totalGlpGal
    totalizadores.totGlp.sol = totalGlpSol   
    totalizadores.totGalones.sol = totalGalonesSol
    totalizadores.totGalones.gal = totalGalonesGal
    totalizadores.totDespacho = totalDespacho       
    totalizadores.totCerafin = totalCalibracion
    totalizadores.tot.efectivo = totalEfectivo
    totalizadores.tot.tarjeta = totalTarjeta
    totalizadores.tot.yape = totalYape
    totalizadores.Total = +total

    return (
        <div>
            <PrintCierre ref={componentRef} totalizadores={totalizadores} />
            <Button color="secondary" onClick={handleClickOpen} >
                CERRAR TURNO
            </Button>    

            <Dialog open={isOpenDialog} onClose={handleClose}>
            <DialogTitle>
                <Typography>Cierre de turno</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Esta cerrando su turno con fecha <Link href="#"  onClick={toggle}>{getActualDate('dd-mm-yyyy')}</Link>. Esta seguro ?
                </DialogContentText>
                <Typography variant="subtitle2"  style={{color: 'blue'}}>
                    Usted no podrá revertir esta operación.
                </Typography>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ paddingTop: 2 }}
                >
                {
                    isOpenDate && 
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Editar fecha de cierre"
                        value={value}
                        format="dd-MM-yyyy"
                        onChange={(newValue) => setValue(newValue?newValue:new Date())}
                    />
                  </LocalizationProvider>
                }     
                </Grid>           
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}  color="error">Cancelar</Button>
            <Button onClick={handleAceptar} color="success">Aceptar</Button>
            </DialogActions>
        </Dialog>               
        </div>
    );
};
