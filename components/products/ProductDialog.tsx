import { FC, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid}  from '@mui/material/';
import { useForm } from 'react-hook-form';
import CreateIcon from '@mui/icons-material/Create';

import { IProduct } from '@/interfaces';
import { UiContext } from '@/context';
import { guardarProducto, actualizarProducto } from '@/hooks';

//export const FuelCard: FC<Props> = ({ fuel }) => {
interface Props{
    product? : IProduct;
    newProduct : boolean;
}

export const ProductDialog: FC<Props> = ({ product, newProduct }) => {

    const { showAlert } = useContext( UiContext );
    const router = useRouter();

    const { register, reset, handleSubmit, trigger, setValue, getValues, formState: { errors } }  = useForm<IProduct>({
        defaultValues: {
            id: product?.id,
            nombre: product?.nombre,
            descripcion: product?.descripcion,
            stock: product?.stock,
            codigo: product?.codigo,
            medida: product?.medida,
            precio: product?.precio,
            valor: product?.valor,
        }
    });

    const onSubmitUser = async (storageProducto: IProduct) => {
        const { hasError, message, producto } = newProduct? await guardarProducto(storageProducto): await actualizarProducto(storageProducto);
        showAlert({mensaje: message, severity: hasError? 'error':'success', time: 1500})  
        handleClose();
        window.location.href = "/products"
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
            newProduct? (
                <Button color="secondary" onClick={handleClickOpen} >
                    Nuevo producto
                </Button>   
            ):(
                <Button color="success" onClick={handleClickOpen} endIcon={<CreateIcon />} >
                    Modificar
                </Button>   
            )
        }
     
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={ handleSubmit( onSubmitUser ) }>
            <DialogTitle>{`${ getValues("id")==0?'Creación':'Modificación'} de productos`}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1}}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Nombre'}
                            variant='standard' 
                            fullWidth
                            { ...register('nombre', {
                                required: 'Este campo es requerido'
                                
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.nombre }
                            helperText={ errors.nombre?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Descripcion'}
                            variant='standard' 
                            fullWidth
                            { ...register('descripcion', {
                                required: 'Este campo es requerido'
                                
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.descripcion }
                            helperText={ errors.descripcion?.message }
                        />
                    </Grid> 
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Stock'}
                            variant='standard' 
                            fullWidth
                            { ...register('stock', {
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.stock }
                            helperText={ errors.stock?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Codigo'}
                            variant='standard' 
                            fullWidth
                            { ...register('codigo', {
                                required: 'Este campo es requerido'
                                
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.codigo }
                            helperText={ errors.codigo?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Medida'}
                            variant='standard' 
                            fullWidth
                            { ...register('medida', {
                                required: 'Este campo es requerido'
                                
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.medida }
                            helperText={ errors.medida?.message }
                        />
                    </Grid> 
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Precio unitario'}
                            variant='standard' 
                            fullWidth
                            { ...register('precio', {
                                required: 'Este campo es requerido'
                                
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.precio }
                            helperText={ errors.precio?.message }
                        />
                    </Grid>  
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Valor unitario'}
                            variant='standard' 
                            fullWidth
                            { ...register('valor', {
                                required: 'Este campo es requerido'
                                
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.valor }
                            helperText={ errors.valor?.message }
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
                Guardar usuario
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