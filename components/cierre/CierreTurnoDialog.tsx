import React, { useContext, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { ICierreTurnoPrint, ICierreTurnoTotalesPrint, IComprobante, IDeposito, IGasto } from '@/interfaces';
import constantes from '@/helpers/constantes';
import router from 'next/router';
import { FuelContext, UiContext } from '@/context';
import { getSession, useSession } from 'next-auth/react';
import { formatDateSQL, getActualDate } from "@/helpers/util";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFuels } from '@/hooks';
import { PrintCierreTurno } from '../print/PrintCierreTurno';

type Props = {
    totalGalones: ICierreTurnoPrint[];
    totales: ICierreTurnoTotalesPrint;
    gastos: IGasto[];
    depositos: IDeposito[];
}


export const CierreTurnoDialog: React.FC<Props> = ({totalGalones, totales, gastos, depositos}) => {

    
    //cambios
    const [horaIngreso, setHoraIngreso] = useState("");
    const componentRef = useRef(null);
    const { createCierre } = useContext(FuelContext)
    const { showAlert } = useContext( UiContext );
    const [value, setValue] = React.useState<Date>(new Date());
    const [isOpenDialog, setOpenDialog] = useState(false);
    
    const handlePrint = useReactToPrint({
        pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",        
        content: () => componentRef.current,
        onAfterPrint: () => {
            router.push("/");
        }
    });
    const { fuels, isLoading, isError } = useFuels('/abastecimientos/count/total',null,null,{ refreshInterval: 3}, '0', '100')

    const handleAceptar = async () => {
        if(totalGalones.length > 0){
            const session = await getSession();
            setHoraIngreso(session?.user.fecha_registro || "")
            const { hasError, cierre, message, cantidad } = await createCierre(parseInt(session?.user.id?session?.user.id:"0"), new Date(formatDateSQL(value)), session?.user.jornada || '', session?.user.isla || '',totales.efectivo, totales.tarjeta, totales.yape);            
            if(hasError){
                showAlert({mensaje: message, severity: 'error'})
            }else if (cantidad == 0){
                showAlert({mensaje: "Ocurrió un error actualizando los comprobantes", severity: 'error'})
            }else if (!cierre){
                showAlert({mensaje: "Ocurrió un error generando el cierre de comprobantes", severity: 'error'})
            }else{
                handlePrint();                
                showAlert({mensaje: `Turno cerrado satisfactoriamente, ${cantidad} comprobantes`, severity: 'success'})                                
            }
        }else{
            showAlert({mensaje: 'No tiene cuenta por liquidar', severity: 'error'})
        }        
        // if(fuels.length > 0){
        //     showAlert({mensaje: `Tiene abastecimientos pendientes por liquidar: ${ fuels.length }, no puede cerrar turno`, severity: 'error'})
        // }else{
        //     if(comprobantes.length > 0){
        //         const session = await getSession();
        //         const data = await createCierre(parseInt(session?.user.id?session?.user.id:"0"), new Date(formatDateSQL(value)), session?.user.jornada || '', session?.user.isla || '',totalEfectivo, totalTarjeta, totalYape);            
        //         if(!data.hasError){
        //             handlePrint();                
        //             showAlert({mensaje: 'Turno cerrado satisfactoriamente', severity: 'success'})                
        //         }else{
        //             showAlert({mensaje: data.message.toString(), severity: 'error'})
        //         }
        //     }else{
        //         showAlert({mensaje: 'No tiene cuenta por liquidar', severity: 'error'})
        //     }
        // }

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
   

    return (
        <div>
            <PrintCierreTurno {...{horaIngreso, totalGalones, totales, gastos, depositos}} ref={componentRef} />
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
