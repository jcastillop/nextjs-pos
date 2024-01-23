import React, { FC, useContext, useRef, useState } from 'react';
import { UiContext } from '../../context/ui/UiContext';
import { PrintComprobanteAdmin } from '../print/PrintComprobanteAdmin';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material';
import { FuelContext } from '../../context/fuel/FuelContext';
import { useSession } from 'next-auth/react';

import { IComprobanteAdmin, IComprobanteAdminItem, IReceptor } from '@/interfaces';
import { Constantes } from '@/helpers';
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetStaticProps, NextPageContext } from 'next';




type Props = {
    comprobante: IComprobanteAdmin;
    idUsuario: number;
    receptor: IReceptor;
}

export const NotaCreditoDialog: FC<Props> = ({ comprobante, idUsuario, receptor }) => {

    const router = useRouter();
    const componentRef = useRef(null);
    const { emptyOrder, createOrderAdministrador } = useContext(FuelContext)
    const { showAlert } = useContext( UiContext );

    const [isOpenDialog, setOpenDialog] = useState(false);

    // const [comprobanteAdministrador, setComprobanteAdministrador] = useState(dataComprobanteAdmin)

    

    const handleAceptar = async () => {

        // eslint-disable-next-line react-hooks/rules-of-hooks

        

        // setComprobanteAdministrador( current => ({
        //     ...current,
        //     Receptor: receptor,
        //     tipo_comprobante: Constantes.TipoComprobante.NotaCredito,
        //     tipo_documento_afectado: comprobante.tipo_comprobante,
        //     numeracion_documento_afectado: comprobante.numeracion_comprobante,
        //     fecha_documento_afectado: comprobante.fecha_emision,
        //     gravadas: comprobante.total_gravadas,
        //     igv: comprobante.total_igv,
        //     total: comprobante.total_venta,            
        //     prefijo: (comprobante.tipo_comprobante || "") == Constantes.TipoComprobante.Boleta?"B":"F",
        //     items: (comprobante.Items as IComprobanteAdminItem[])
        // }))

        // const { hasError, respuesta, storage } = await createOrderAdministrador(comprobanteAdministrador, receptor, Constantes.TipoComprobante.NotaCredito, idUsuario);

        // if(!hasError){
        //     setComprobanteAdministrador( current => ({
        //         ...current,
        //         numeracion: storage.numeracion_comprobante,
        //         cadena_para_codigo_qr: storage.cadena_para_codigo_qr,
        //         codigo_hash: storage.codigo_hash,
        //         fecha_abastecimiento: storage.fecha_abastecimiento
        //     }))

        //     showAlert({mensaje: respuesta, time: 1500})         
        //     await setTimeout(function(){      
        //         handlePrint();
        //     }, 2000);
            
        // }else{
        //     emptyOrder();
        //     showAlert({mensaje: respuesta, severity: 'error', time: 7000})
        //     router.push('/');
        // }        
    }
    
    const handlePrint = useReactToPrint({
        pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",        
        content: () => componentRef.current || null,
        onAfterPrint: () => {
            // Reset the Promise resolve so we can print again
            emptyOrder();
            router.push('/');
          }        
    });    

    const handleClickOpen = () => {
        setOpenDialog(true);
    };
  
    const handleClose = () => {
        setOpenDialog(false);
    };       

  return (
    <div>
        {/* <PrintComprobanteAdmin ref={componentRef} comprobante={comprobanteAdministrador}/> */}

        <Button variant="contained" color="secondary"  onClick={handleClickOpen}>Generar</Button>

        <Dialog open={isOpenDialog} onClose={handleClose}>
        <DialogTitle>
            <Typography>Cierre de turno</Typography>
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                Esta creando una nota de credito para este comprobante. Esta seguro ?
            </DialogContentText>
            <Typography variant="subtitle2"  style={{color: 'blue'}}>
                Usted no podrá revertir esta operación.
            </Typography>         
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}  color="error">Cancelar</Button>
            <Button onClick={handleAceptar} color="success">Aceptar</Button>
        </DialogActions>
    </Dialog>               
</div>
  )
}


export const getStaticProps = (async (context) => {
    return { props: { repo:"hola" } }
  }) satisfies GetStaticProps<{repo: string}>

