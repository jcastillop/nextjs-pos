import { FC, useContext, useState } from "react";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { UiContext } from "@/context";

export const Alerta: FC = () => {
    
    const { alerta, hideAlert } = useContext( UiContext );

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        hideAlert();
    };  
    return(
        <Snackbar open={alerta.status} autoHideDuration={alerta.time} onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity={alerta.severity} sx={{ width: '100%' }}>
            {alerta.mensaje}
        </Alert>
    </Snackbar>    
    )
}