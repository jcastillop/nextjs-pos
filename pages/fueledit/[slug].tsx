import React, { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';
import { useReactToPrint } from 'react-to-print';
import { Box, Button, Card, CardContent, Divider, Grid, TextField, Typography, ToggleButtonGroup, ToggleButton, InputAdornment, IconButton, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent } from '@mui/material'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentsIcon from '@mui/icons-material/Payments';

import { FuelContext, UiContext } from '@/context'
import { FuelLayout } from '@/components/layouts'
import { PrintPos } from '@/components/print/PrintPos'
import { useFuel } from '@/hooks/useFuel';
import { getSession } from 'next-auth/react';

import { IReceptor } from '@/interfaces';
import constantes from '@/helpers/constantes';
import { AutorizacionDialog } from '@/components/admin/AutorizacionDialog';
import { Constantes } from '@/helpers';
import { FuelSummary } from '@/components';

type FormData = {
    numeroDocumento: string;
    razonSocial: string;
    direccion: string;
    correo: string;
    placa: string;
    comentario: string;
    tarjeta: number;
    efectivo: number;
}

type CalibracionData = {
    open: boolean;
    state: boolean;
}

const InvoicePage : NextPage = () => {

    

    const router = useRouter();
    const componentRef = useRef();
    const { showAlert } = useContext( UiContext );

    const { fuel, isLoading, isError } = useFuel(`/${ router.query.slug }`,{ refreshInterval: 0});

    const { modifyOrder, findRuc, comprobante, receptor, emptyOrder, cleanOrder, isLoaded } = useContext(FuelContext)

    const { register, reset, handleSubmit, trigger, setValue, getValues, formState: { errors } }  = useForm<FormData>({
        defaultValues: {
            numeroDocumento: '', razonSocial: '', direccion: '', correo: '', placa: '', comentario: '', tarjeta: 0, efectivo: 0
        }
    });

    useEffect(() => {
        setValue("efectivo", fuel?.valorTotal||0, { shouldValidate: true });
    }, [fuel?.valorTotal, setValue])    

    const [tipoComprobante, setTipoComprobante] = useState<string>('03');

    const [openAlertaCalibracion, setOpenAlertaCalibracion] = useState<CalibracionData>({open: false, state: false});

    useEffect(() => {
        if(openAlertaCalibracion.state){
            setTipoComprobante(constantes.TipoComprobante.Calibracion);
            reset({ numeroDocumento: '', razonSocial: '', direccion: '', correo: '', placa: '', comentario: ''});
        }
    }, [openAlertaCalibracion, reset])
    

    const handlePrint = useReactToPrint({
        pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",        
        content: () => componentRef.current || null,
        onAfterPrint: () => {
            // Reset the Promise resolve so we can print again
            emptyOrder();
            router.push('/');
          }        
    });

    const handleClickMedioPago = () => {
        const tmpTarjeta = getValues("tarjeta");
        const tmpEfectivo = getValues("efectivo");

        setValue("efectivo", tmpTarjeta, { shouldValidate: true });
        setValue("tarjeta", tmpEfectivo, { shouldValidate: true });
    }

    const onSubmitFuel = async (data: FormData) => {
        const receptorForm: IReceptor = {
            id_receptor: 0,
            numero_documento: data.numeroDocumento,
            tipo_documento: data.numeroDocumento.length===11?6:0,
            razon_social: data.razonSocial,
            direccion: data.direccion,
            correo: data.correo,
            placa: data.placa,
        }     

        const { hasError, respuesta } = await modifyOrder(router.query.correlativo?.toString() || "", router.query.id?.toString() || "", tipoComprobante, receptorForm, data.comentario, fuel?.descripcionCombustible || "", data.tarjeta, data.efectivo,"","","","", fuel?.idAbastecimiento); 

        if(!hasError){
            showAlert({mensaje: respuesta, time: 1500})         
            await setTimeout(function(){      
                handlePrint();
            }, 2000);
            
        }else{
            emptyOrder();
            showAlert({mensaje: respuesta, severity: 'error', time: 7000})
            router.push('/');
        }


    }    
    
    const checkKeyDown = async (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter'){
            e.preventDefault();
            const bTrigger: boolean = await trigger("numeroDocumento")
            if(bTrigger){
                const data = await findRuc((e.target as HTMLInputElement).value);
                if(data.receptores && !data.hasError && data.receptores.length > 0){
                    reset({ razonSocial: '', direccion: '', correo: '', placa: ''});
                    showAlert({mensaje: 'Cliente encontrado'})
                    setValue("numeroDocumento", data.receptores[0].numero_documento, { shouldValidate: true });
                    setValue("razonSocial", data.receptores[0].razon_social, { shouldValidate: true });
                    setValue("direccion", data.receptores[0].direccion, { shouldValidate: true });
                }else{
                    showAlert({mensaje: 'Cliente NO encontrado, se registrará un nuevo cliente', severity: 'warning', time: 3000})
                }
            }
            }

    };    

    const handleTipoDocumento = (
      event: React.MouseEvent<HTMLElement>,
      nuevoTipoDocumento: string,
    ) => {
        
        if(nuevoTipoDocumento == constantes.TipoComprobante.Calibracion){
            setOpenAlertaCalibracion({open: true, state: false});
        }else{
            setTipoComprobante(nuevoTipoDocumento);
            reset({ numeroDocumento: '', razonSocial: '', direccion: '', correo: '', placa: '', comentario: ''});
        }        
    };

    const handleTarjetaValueChange = (event: { target: { value: any; }; }) => {
        const newTarjetaValue = +event.target.value
        setValue("efectivo", +(((fuel?.valorTotal||0) - newTarjetaValue).toFixed(2)), { shouldValidate: true });
    };

    const handleEfectivoValueChange = (event: { target: { value: any; }; }) => {
        const newEfectivoValue = +event.target.value
        setValue("tarjeta", +(((fuel?.valorTotal||0) - newEfectivoValue).toFixed(2)), { shouldValidate: true });
    };    

    return (
        <FuelLayout title='Resumen de compra' pageDescription={'Resumen de la compra'}>
            <Typography variant='h1' component='h1'>Detalle de la orden</Typography>
            <AutorizacionDialog open={openAlertaCalibracion} setOpen={setOpenAlertaCalibracion}/>
            <>
                <PrintPos ref={componentRef} receptor={receptor} comprobante={comprobante}/>
                <form onSubmit={ handleSubmit( onSubmitFuel ) } onKeyDown={(e) => checkKeyDown(e)}>
                    <Grid container  spacing={2}>
                        <Grid item xs={12} sm={7}>
                            <Card className='sumary-card'>
                                <CardContent>
                                    {/* <Typography variant='h2'>Datos del cliente</Typography>

                                    <Divider sx={{mt: 2}}/> */}
                                    <Grid 
                                        container
                                        spacing={0}
                                        direction="column"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <ToggleButtonGroup
                                            value={tipoComprobante}
                                            exclusive
                                            onChange={handleTipoDocumento}
                                            aria-label="Tipo de documento"        
                                            sx={{ mt: 1}}                                       
                                        >
                                            <ToggleButton value="03">BOLETA</ToggleButton>
                                            <ToggleButton value="01">FACTURA</ToggleButton>
                                            <ToggleButton value="50">NOTA DESPACHO</ToggleButton>
                                            <ToggleButton value="51">CALIBRACION</ToggleButton>
                                        </ToggleButtonGroup>    
                                    </Grid>
                                    <Grid container spacing={2} sx={{ mt: 1}}>
                                        {/* <Grid item xs={12} sm={6} display={{ xs: (tipoComprobante=='51')?"none":"block" }}> */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label={(tipoComprobante=='03'||tipoComprobante=='51')?'DNI':'RUC'}
                                                variant='standard' 
                                                fullWidth
                                                { ...register('numeroDocumento', {
                                                    validate:{
                                                        required: value => {
                                                            if (!value) return 'Este campo es requerido';
                                                            return true;
                                                          },
                                                    },
                                                    pattern: {
                                                        value: (tipoComprobante=='03'||tipoComprobante=='51')?/^([0-9]{8}|0)$/:/^([0-9]{11})$/,
                                                        message: `El ${ (tipoComprobante=='03'||tipoComprobante=='51')?'DNI':'RUC' } ingresado es incorrecto`
                                                      }
                                                })}
                                                InputLabelProps={{ shrink: true }} 
                                                error={ !!errors.numeroDocumento }
                                                helperText={ errors.numeroDocumento?.message }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label={(tipoComprobante=='03'||tipoComprobante=='51')?'Nombres':'Razón social'}
                                                variant='standard' 
                                                fullWidth
                                                { ...register('razonSocial', {
                                                    required: 'Este campo es requerido'
                                                    
                                                })}
                                                InputLabelProps={{ shrink: true }}
                                                error={ !!errors.razonSocial }
                                                helperText={ errors.razonSocial?.message }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} display={{ xs: (tipoComprobante=='03'||tipoComprobante=='51')?"none":"block" }}>
                                            <TextField 
                                                label='Direccion' 
                                                variant='standard' 
                                                InputLabelProps={{ shrink: true }} 
                                                fullWidth
                                                { ...register('direccion')}
                                                error={ !!errors.direccion }
                                                helperText={ errors.direccion?.message }
                                            />
                                        </Grid>                                 
                                        <Grid item xs={12} sm={6} display={{ xs: (tipoComprobante=='51')?"none":"block" }}>
                                        <TextField 
                                                onKeyDown={(event) => {
                                                    if (!Constantes.ALPHA_NUMERIC_REGEX.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }}                                            
                                                label='Placa' 
                                                variant='standard' 
                                                inputProps={{style: { fontSize: 20, textTransform: "uppercase" }}}
                                                InputLabelProps={{ shrink: true,  }} 
                                                fullWidth
                                                { ...register('placa')}
                                                error={ !!errors.placa }
                                                helperText={ errors.placa?.message }                                            
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextField 
                                                label='Comentarios' 
                                                variant='standard' 
                                                InputLabelProps={{ shrink: true }} 
                                                fullWidth
                                                { ...register('comentario')}
                                                error={ !!errors.comentario }
                                                helperText={ errors.comentario?.message }                                            
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={6}>
                                            <TextField
                                                label="Tarjeta"
                                                variant="standard"
                                                type='number'
                                                fullWidth
                                                { ...register('tarjeta')}
                                                error={ !!errors.tarjeta }
                                                helperText={ errors.tarjeta?.message }
                                                onChange={handleTarjetaValueChange}
                                                inputProps={{
                                                    maxLength: 5,
                                                    step: 0.01
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <IconButton aria-label="toggle password visibility" onClick={handleClickMedioPago}>
                                                                <CreditCardIcon color="secondary"/>
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />                                         
                                        </Grid>
                                        <Grid item xs={6} sm={6}>
                                            <TextField
                                                label="Efectivo"
                                                variant='standard' 
                                                type='number'
                                                fullWidth
                                                { ...register('efectivo')}
                                                error={ !!errors.efectivo }
                                                helperText={ errors.efectivo?.message }  
                                                onChange={handleEfectivoValueChange}
                                                inputProps={{
                                                    maxLength: 5,
                                                    step: 0.01
                                                }}                                                                                           
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickMedioPago}
                                                            >
                                                                <PaymentsIcon color="success"/>
                                                            </IconButton>                                                            
                                                            
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />  
                                        </Grid>
                                    </Grid>
                            </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Card className='sumary-card'>
                                <CardContent>
                                    <Typography variant='h2'>Resumen</Typography>
                                    <Divider sx={{mt: 2, mb: 2}}/>
                                    <FuelSummary fuel={fuel}/>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3}}>
                        <Button
                            color='secondary'
                            className='circular-btn'
                            fullWidth
                            disabled={isLoaded}
                            type='submit'
                        >                           
                            Confirmar orden
                        </Button>
                    </Box>
                </form>
            </>
         </FuelLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query})=>{

    const session = await getSession({ req });  
    const { p = '/auth/login'} = query

    if(!session){
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }
    return{
        props: {}
    }
}

export default InvoicePage