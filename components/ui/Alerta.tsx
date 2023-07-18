import { FC, useContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { UiContext } from "@/context";

interface Props{
    mensaje : String;
    status : boolean;
}

export const Alerta: FC<Props> = ({ mensaje, status }) => {
    
    const { isAlertOpen, toggleAlert } = useContext( UiContext );

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        toggleAlert;
    };    
    return(
        <Snackbar open={isAlertOpen} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: '100%' }}>
                {mensaje}
            </Alert>
        </Snackbar>     
    )
}