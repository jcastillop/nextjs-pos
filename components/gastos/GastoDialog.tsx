import { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem}  from '@mui/material/';
import { useForm } from 'react-hook-form';
import CreateIcon from '@mui/icons-material/Create';

import { IGasto } from '@/interfaces';
import { FuelContext, UiContext } from '@/context';
import { guardarProducto, actualizarProducto, guardarGasto, actualizarGasto } from '@/hooks';
import { getSession, useSession } from 'next-auth/react';

//export const FuelCard: FC<Props> = ({ fuel }) => {
interface Props{
    gasto? : IGasto;
    newGasto : boolean;
}

export const GastoDialog: FC<Props> = ({ gasto, newGasto }) => {

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

    const { register, handleSubmit, setValue, getValues, formState: { errors } }  = useForm<IGasto>({
        defaultValues: {
            id: gasto?.id,
            concepto: gasto?.concepto,
            monto: gasto?.monto,
            usuario_gasto: gasto?.usuario_gasto? gasto?.usuario_gasto:session?.user.usuario!,
            autorizado: gasto?.autorizado,
            turno: gasto?.turno? gasto?.turno:session?.user.jornada!,
            UsuarioId: gasto?.UsuarioId? gasto?.UsuarioId:session?.user.id!
        }
    });
    

    const onSubmitUser = async (storageGasto: IGasto) => {
        const { hasError, message, gasto } = newGasto? await guardarGasto(storageGasto): await actualizarGasto(storageGasto);
        showAlert({mensaje: message, severity: hasError? 'error':'success', time: 1500})  
        handleClose();
        window.location.href = "/gastos"
    }

    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // const handleEfectivoValueChange = (event: { target: { value: any; }; }) => {
    //     const newEfectivoValue = +event.target.value
    //     setValue("valor", +((newEfectivoValue/1.18).toFixed(getValues("medida")=="GAL"?10:2)), { shouldValidate: true });
    // };      

    // const isDecimalValid = () => {
    //     const arr = getValues("valor").toString().split(".")
    //     if(arr.length != 2) return true;
    //     const decimales = arr[1].length
    //     if(getValues("medida") == "GAL"){
    //         return decimales == 10? true: `El cantidad de decimales es incorrecta para ${getValues("medida")}, la cantidad requerida es 10`
    //     }else{
    //         return decimales == 2? true: `El cantidad de decimales es incorrecta para ${getValues("medida")}, la cantidad requerida es 2`
    //     }
    // };

    return (
        <div>
        {
            newGasto? (
                <Button color="secondary" onClick={handleClickOpen} >
                    Nuevo gasto
                </Button>   
            ):(
                <Button color="success" onClick={handleClickOpen} endIcon={<CreateIcon />} >
                    Modificar
                </Button>   
            )
        }
     
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={ handleSubmit( onSubmitUser ) }>
            <DialogTitle>{`${ getValues("id")==0?'Creación':'Modificación'} de gastos`}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1}}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={'Concepto'}
                            variant='standard' 
                            fullWidth
                            { ...register('concepto', {
                                required: 'Este campo es requerido'
                                
                            })}
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
                            { ...register('usuario_gasto', {
                            })}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true}}                            
                            error={ !!errors.usuario_gasto }
                            helperText={ errors.usuario_gasto?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                        select
                            label={'Autorizado'}
                            variant='standard' 
                            fullWidth
                            { ...register('autorizado', {
                                required: 'Este campo es requerido'
                                
                            })}
                            InputLabelProps={{ shrink: true }}
                            error={ !!errors.autorizado }
                            helperText={ errors.autorizado?.message }
>
                            {
                                usuarios && usuarios.filter((option) => (option.rol == "ADMIN_ROLE" )).map((option) => (
                                    <MenuItem key={option.usuario} value={option.usuario}>
                                    {option.usuario}
                                    </MenuItem>
                                ))
                            }   
                        </TextField>
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
                Guardar gasto
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