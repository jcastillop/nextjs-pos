import React from 'react'
import { FC, useContext, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';

import { ICustomer } from '@/interfaces';
import { UiContext } from '@/context';
import { useForm } from 'react-hook-form';
import { actualizarReceptor, guardarReceptor } from '@/hooks';

interface Props{
    customer : ICustomer;
    newCustomer : boolean;
}

const doctypes = [
    {
      value: '0',
      label: 'DNI',
    },
    {
      value: '6',
      label: 'RUC',
    }
  ];

export const CustomerDialog: FC<Props> = ({ customer, newCustomer }) => {

    const { showAlert } = useContext( UiContext );

    const { register, handleSubmit, setValue, getValues, formState: { errors } }  = useForm<ICustomer>({
        defaultValues: {
            id              : customer.id,
            numero_documento: customer.numero_documento,
            tipo_documento  : customer.tipo_documento,
            razon_social    : customer.razon_social,
            direccion       : customer.direccion,
            correo          : customer.correo,
            placa           : customer.placa
        }
    })

    const onSubmitCustomer = async (storageCustomer: ICustomer) => {
        const { hasError, message, receptor } = newCustomer? await guardarReceptor(storageCustomer): await actualizarReceptor(storageCustomer);
        showAlert({mensaje: message, severity: hasError? 'error':'success', time: 1500})  
        handleClose();
        //window.location.href = "/customers"
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
            newCustomer? (
                <Button color="secondary" onClick={handleClickOpen} >
                    Nuevo cliente
                </Button>   
            ):(
                <Button color="success" onClick={handleClickOpen} endIcon={<CreateIcon />} >
                    Modificar
                </Button>   
            )
        }   

        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={ handleSubmit( onSubmitCustomer ) }>
            <DialogTitle>{`${ getValues("id")==0?'Creación':'Modificación'} de productos`}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1}}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Numero documento'}
                            variant='standard' 
                            fullWidth
                            { ...register('numero_documento', {
                                required: 'Este campo es requerido'
                                
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.numero_documento }
                            helperText={ errors.numero_documento?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            select
                            label={'Tipo documento'}
                            variant='standard' 
                            fullWidth
                            defaultValue={ newCustomer? "0": getValues("tipo_documento") }                            
                            { ...register('tipo_documento', {
                                required: 'Este campo es requerido'
                                
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.tipo_documento }
                            helperText={ errors.tipo_documento?.message }
                        >
                            {
                                doctypes.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))
                            } 
                        </TextField>
                    </Grid> 
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Razon social/Nombre'}
                            variant='standard' 
                            fullWidth
                            { ...register('razon_social', {
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.razon_social }
                            helperText={ errors.razon_social?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Dirección'}
                            variant='standard' 
                            fullWidth
                            { ...register('direccion')}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.direccion }
                            helperText={ errors.direccion?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Correo'}
                            variant='standard' 
                            fullWidth
                            { ...register('correo')}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.correo }
                            helperText={ errors.correo?.message }
                        />
                    </Grid>  
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Placa'}
                            variant='standard' 
                            fullWidth
                            { ...register('placa')}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.placa }
                            helperText={ errors.placa?.message }
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
                Guardar cliente
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
