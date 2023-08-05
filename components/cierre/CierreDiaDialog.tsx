import { FuelContext, UiContext } from "@/context";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FC, useContext, useState } from "react";
import { useForm } from "react-hook-form";

interface Props{
    idUser : number;
}

interface ICierreDia{
    id: number
}

export const CierreDiaDialog: FC<Props> = ({ idUser }) => {

    const router = useRouter();

    const { createCierreDia } = useContext(FuelContext)

    const { showAlert } = useContext( UiContext );

    const { register, reset, handleSubmit, trigger, setValue, getValues, formState: { errors } }  = useForm<ICierreDia>({
        defaultValues: {
            id: idUser
        }
    });

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmitUser = async (data: ICierreDia) => {

        const { hasError, message } = await createCierreDia(data.id);
        showAlert({mensaje: message, severity: hasError? 'error':'success', time: 1500})
        handleClose();
        router.push('/');
    }

    return(
        <div>
            <Button color="secondary" onClick={handleClickOpen} >
                Cerrar día
            </Button>   
        
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={ handleSubmit( onSubmitUser ) }>
                <DialogTitle>{`Cierre de día`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Esta cerrando el día seleccionado. Esta seguro ?
                    </DialogContentText>
                    <Typography variant="subtitle2"  style={{color: 'blue'}}>
                        Usted no podrá revertir esta operación.
                    </Typography>
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
        </div>
    )

}