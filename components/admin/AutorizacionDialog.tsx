import { FuelContext, UiContext } from "@/context";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material"
import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import { useForm } from "react-hook-form"

type CalibracionData = {
    password: string;
}

type CalibracionOpenState = {
    open: boolean;
    state: boolean;
}

interface Props{
    open: CalibracionOpenState;
    setOpen: Dispatch<SetStateAction<CalibracionOpenState>>;
}

export const AutorizacionDialog: FC<Props> = ({ open, setOpen}) => {

    const { validarAdministrador } = useContext( FuelContext );
    const { showAlert } = useContext( UiContext );
    
    const handleClose = () => {
        setOpen({open: false, state: false});
    };

    const { handleSubmit, register, formState: { errors } } = useForm<CalibracionData>({
        defaultValues: {
            password: ''
        }
    })

    const onSubmitCalibracion = async(data: CalibracionData) => {
        const { hasSuccess, message} = await validarAdministrador(data.password)
        showAlert({mensaje: message, severity: hasSuccess?'success':'error', time: 1500})
        setOpen({open: false, state: hasSuccess});
    }
    
    return(
        <Dialog open={open.open} onClose={handleClose}>
            <form onSubmit={ handleSubmit( onSubmitCalibracion ) } autoComplete='off'>
            <DialogTitle>{`Cambio de contraseña`}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                </DialogContentText>
                <TextField 
                    label={'Contraseña'}
                    type='password' 
                    variant='standard' 
                    fullWidth
                    { ...register('password', {
                        required: 'Este campo es requerido'
                        
                    })}
                    InputLabelProps={{ shrink: true }}
                    error={ !!errors.password }
                    helperText={ errors.password?.message }
                />
            </DialogContent>
            <DialogActions>
            <Button
                color='success'
                className='circular-btn'
                type='submit'
            >                           
                Confirmar
            </Button>
            <Button 
            onClick={handleClose}
            color='error'
            className='circular-btn'            
            >
                Cancelar
            </Button>
            </DialogActions>
            </form>
        </Dialog> 
    )
}