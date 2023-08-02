import { FC, useContext, useState } from 'react';
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography}  from '@mui/material/';
import CreateIcon from '@mui/icons-material/Create';
import { IUser } from '@/interfaces';
import { useForm } from 'react-hook-form';
import { FuelContext, UiContext } from '@/context';
import { useRouter } from 'next/router';

interface Props{
    user? : IUser;
}

export const ResetPasswordDialog: FC<Props> = ({ user }) => {
    
    const { reiniciarPassword } = useContext(FuelContext)
    const { showAlert } = useContext( UiContext );
    const router = useRouter();

    const { register, reset, handleSubmit, trigger, setValue, getValues, formState: { errors } }  = useForm<IUser>({
        defaultValues: {
            id: user?.id,
            nombre: user?.nombre,
            usuario: user?.usuario,
            correo: user?.correo,
            img: user?.img,
            rol: user?.rol,
            estado: user?.estado,
            EmisorId: user?.EmisorId
        }
    });

    const onSubmitUser = async (data: IUser) => {
        const { hasError, message } = await reiniciarPassword(data);
        showAlert({mensaje: message, severity: hasError? 'error':'success', time: 1500})
        handleClose();
        router.push('/users');   
    }

    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
        <Button color="secondary" onClick={handleClickOpen} >
            Reiniciar
        </Button>   
     
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={ handleSubmit( onSubmitUser ) }>
            <DialogTitle>{`Reinicio de contraseña`}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Esta creiniciando la contraseña del usuario {user?.usuario}. Esta seguro ?
                <Typography variant="subtitle2"  style={{color: 'blue'}}>
                    Usted no podrá revertir esta operación.
                </Typography>
                </DialogContentText>
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
    );
}