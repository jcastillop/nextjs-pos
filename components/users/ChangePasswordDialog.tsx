import { FC, useContext, useState } from 'react';
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography}  from '@mui/material/';
import { IUser } from '@/interfaces';
import { useForm } from 'react-hook-form';
import { FuelContext, UiContext } from '@/context';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface Props{
    user? : IUser;
}

export const ChangePasswordDialog: FC<Props> = ({ }) => {
    
    const { cambiarPassword } = useContext(FuelContext)
    const { showAlert } = useContext( UiContext );
    const router = useRouter();
    const { data: session, status } = useSession()

    type FormData = {
        password: string;
    }

    const { register, reset, handleSubmit, trigger, setValue, getValues, formState: { errors } }  = useForm<FormData>({
        defaultValues: {
            password: ''
        }
    });

    const onSubmitUser = async (data: FormData) => {
        const id = session?+session.user.id:0
        const { hasError, message } = await cambiarPassword(id, data.password);
        showAlert({mensaje: message, severity: hasError? 'error':'success', time: 1500})
        handleClose();
        router.push('/perfil');   

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
                <TextField 
                    label={'Nombres'}
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