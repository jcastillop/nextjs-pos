import { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem}  from '@mui/material/';
import { useForm } from 'react-hook-form';
import CreateIcon from '@mui/icons-material/Create';

import { IProduct } from '@/interfaces';
import { UiContext } from '@/context';
import { guardarProducto, actualizarProducto } from '@/hooks';
import { Constantes } from '@/helpers';

//export const FuelCard: FC<Props> = ({ fuel }) => {
interface Props{
    product? : IProduct;
    newProduct : boolean;
}

export const ProductDialog: FC<Props> = ({ product, newProduct }) => {

    
    const currencies = [
        {
          value: Constantes.UNIDADES,
          label: Constantes.UNIDADES
        },
        {
          value: Constantes.GALONES,
          label: Constantes.GALONES
        }
      ];

    const { showAlert } = useContext( UiContext );
    const router = useRouter();

    const { register, handleSubmit, setValue, getValues, formState: { errors } }  = useForm<IProduct>({
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
        console.log(product?.medida)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEfectivoValueChange = (event: { target: { value: any; }; }) => {
        const newEfectivoValue = +event.target.value
        setValue("valor", +((newEfectivoValue/1.18).toFixed(getValues("medida")==Constantes.GALONES?10:2)), { shouldValidate: true });
    };      

    const isDecimalValid = () => {
        const arr = getValues("valor").toString().split(".")
        if(arr.length != 2) return true;
        const decimales = arr[1].length
        if(getValues("medida") == Constantes.GALONES){
            return decimales == 10? true: `El cantidad de decimales es incorrecta para ${getValues("medida")}, la cantidad requerida es 10, vuelva a escribir el precio`
        }else{
            return decimales == 2? true: `El cantidad de decimales es incorrecta para ${getValues("medida")}, la cantidad requerida es 2, vuelva a escribir el precio`
        }
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
                            select
                            label={'Medida'}
                            variant='standard' 
                            fullWidth
                            defaultValue={ (product?.medida)? product?.medida : "NIU" }
                            { ...register('medida', {
                                required: 'Este campo es requerido'
                                
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.medida }
                            helperText={ errors.medida?.message }                    
                        >
                            {
                                currencies.map((option) => (
                                    <MenuItem key={option.value} value={option.value} selected={product?.medida==option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))
                            }   
                        </TextField>
                    </Grid> 
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Precio unitario'}
                            variant='standard' 
                            fullWidth
                            { ...register('precio', {
                                required: 'Este campo es requerido'
                                
                            })}
                            type='number'
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.precio }
                            helperText={ errors.precio?.message }
                            onChange={handleEfectivoValueChange}
                        />
                    </Grid>  
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Valor unitario'}
                            variant='standard' 
                            fullWidth
                            { ...register('valor', {
                                required: 'Este campo es requerido',
                                validate: isDecimalValid
                                
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.valor }
                            helperText={ errors.valor?.message }
                            disabled
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
                Guardar producto
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