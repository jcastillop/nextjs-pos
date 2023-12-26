import { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem}  from '@mui/material/';
import CreateIcon from '@mui/icons-material/Create';
import { useForm } from 'react-hook-form';

import { IDeposito } from '@/interfaces';
import { FuelContext, UiContext } from '@/context';
import { guardarDeposito, actualizarDeposito } from '@/hooks';

//export const FuelCard: FC<Props> = ({ fuel }) => {
interface Props{
    deposito? : IDeposito;
    newGasto : boolean;
}

export const DepositoDialog: FC<Props> = ({ deposito, newGasto }) => {

    const { data: session, status } = useSession();
    const { listarUsuarios } = useContext(FuelContext)
    const [usuarios, setUsuarios] = useState<any[]>()

    useEffect(() => {
        const callAPI = async () => {
            const { hasError, usuarios} = await listarUsuarios();
            setUsuarios(usuarios);      
          }
          callAPI()
    }, [listarUsuarios])
    

    const currencies = [
        {
          value: 'TURNO1',
          label: 'TURNO1',
        },
        {
          value: 'TURNO2',
          label: 'TURNO2',
        },
        {
          value: 'TURNO3',
          label: 'TURNO3',
        }
      ];

    const { showAlert } = useContext( UiContext );
    
    const router = useRouter();

    const { register, handleSubmit, setValue, getValues, formState: { errors } }  = useForm<IDeposito>({
        defaultValues: {
            id: deposito?.id,
            concepto: deposito?.concepto,
            monto: deposito?.monto,
            usuario: deposito?.usuario? deposito?.usuario:session?.user.usuario!,
            turno: deposito?.turno? deposito?.turno:session?.user.jornada!,
            UsuarioId: deposito?.UsuarioId? deposito?.UsuarioId:session?.user.id!
        }
    });
    

    const onSubmitUser = async (storageDeposito: IDeposito) => {
        const { hasError, message, deposito } = newGasto? await guardarDeposito(storageDeposito): await actualizarDeposito(storageDeposito);
        showAlert({mensaje: message, severity: hasError? 'error':'success', time: 1500})  
        handleClose();
        window.location.href = "/depositos"
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
        {
            newGasto? (
                <Button color="secondary" onClick={handleClickOpen} >
                    Nuevo deposito
                </Button>   
            ):(
                <Button color="success" onClick={handleClickOpen} endIcon={<CreateIcon />} >
                    Modificar
                </Button>   
            )
        }
     
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={ handleSubmit( onSubmitUser ) }>
            <DialogTitle>{`${ getValues("id")==0?'Creación':'Modificación'} de depositos parciales`}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1}}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Concepto'}
                            variant='standard' 
                            fullWidth
                            { ...register('concepto')}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.concepto }
                            helperText={ errors.concepto?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Monto'}
                            variant='standard' 
                            fullWidth
                            { ...register('monto', {
                                required: 'Este campo es requerido',
                                min: {
                                    value: 1,
                                    message: "El gasto debe tener un valor mayor a 0",
                                },
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.monto }
                            helperText={ errors.monto?.message }
                        />
                    </Grid> 
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Usuario'}
                            variant='standard' 
                            fullWidth
                            defaultValue={ session?.user.usuario }
                            { ...register('usuario', {
                            })}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true}}                            
                            error={ !!errors.usuario }
                            helperText={ errors.usuario?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            select
                            label={'Turno'}
                            variant='standard' 
                            fullWidth
                            defaultValue={ session?.user.jornada }
                            { ...register('turno')}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.turno }
                            helperText={ errors.turno?.message }   
                            InputProps={{ readOnly: true}}
                        >
                            {
                                currencies.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))
                            }   
                        </TextField>
                    </Grid>    
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Identificador'}
                            variant='standard' 
                            fullWidth
                            defaultValue={ session?.user.id }
                            { ...register('UsuarioId', {
                            })}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true}}                            
                            error={ !!errors.UsuarioId }
                            helperText={ errors.UsuarioId?.message }
                        />
                    </Grid>                                                                                                                                      
                </Grid>

            </DialogContent>
            <DialogActions>
            <Button
                color='success'
                className='circular-btn'
                type='submit'
            >                           
                Guardar deposito
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