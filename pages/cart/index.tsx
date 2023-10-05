import React, { useContext, useEffect, useRef, useState } from 'react'

import {  OrderSumaryAdministrator } from '@/components/cart'
import { FuelLayout, ShopLayout } from '@/components/layouts'

import { Constantes } from '@/helpers'
import { PhoneAndroid, CreditCard, Payments, AddCircle } from '@mui/icons-material'

import { Box, Button, Card, CardContent, Divider, Grid, IconButton, InputAdornment, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { FuelContext, UiContext } from '@/context'
import { useRouter } from 'next/router'
import { IComprobanteAdmin, IComprobanteAdminItem, IReceptor } from '@/interfaces'
import { useForm } from 'react-hook-form'
import { useReactToPrint } from 'react-to-print'
import { PrintComprobanteAdmin } from '@/components/print/PrintComprobanteAdmin'

type FormData = {
    numeroDocumento: string;
    razonSocial: string;
    direccion: string;
    correo: string;
    placa: string;
    comentario: string;
        
    numeracion?: string;
    ruc_emisor: string;
    tipoComprobante: string;
    fecha_emision: string;    
    moneda: string;
    gravadas: number;
    igv: number;
    total: number;
    efectivo: number;
    tarjeta: number;
    yape: number;
    billete: number;
    usuarioId: number;
    ruc: string;    
}


const initialComprobante: IComprobanteAdmin = {
    Receptor: {
        id_receptor: 0,
        tipo_documento: 0,
        numero_documento: '',
        razon_social: '',
        direccion: '',
        correo: '',
        placa: ''
    },
    numeracion: '',
    tipo_comprobante: '',
    numeracion_comprobante: '',
    fecha_emision: '',
    moneda: '',
    tipo_operacion: '',
    tipo_nota: '',
    tipo_documento_afectado: '',
    numeracion_documento_afectado: '',
    fecha_documento_afectado: '',
    motivo_documento_afectado: '',
    gravadas: 0,
    igv: 0,
    total: 0,
    monto_letras: '',
    cadena_para_codigo_qr: '',
    codigo_hash: '',
    pdf: '',
    url: '',
    errors: '',
    id_abastecimiento: 0,
    pistola: 0,
    codigo_combustible: '',
    dec_combustible: '',
    volumen: 0,
    fecha_abastecimiento: '',
    tiempo_abastecimiento: 0,
    volumen_tanque: 0,
    comentario: '',
    tarjeta: 0,
    efectivo: 0,
    placa: '',
    billete: 0,
    producto_precio: 0,
    usuarioId: 0,
    ruc: '',
    yape: 0,
    items: []
}


const CartPage: NextPage = () => {

    const router = useRouter();
    const componentRef = useRef();
    
    const { showAlert } = useContext( UiContext );
    const { findRuc, cart, createOrderAdministrador, emptyOrder, isLoaded } = useContext(FuelContext)

    const [comprobante, setComprobante] = useState(initialComprobante)
    
    const [tipoComprobante, setTipoComprobante] = useState<string>('03');

    useEffect(() => {
        const totalize = cart?.map(item => ({ igv: item.igv, total: item.precio_venta, gravadas: item.valor_venta })).reduce((a, b) => {
            return ({
                igv: (a.igv || 0) + (b.igv || 0),
                total: (a.total || 0) + (b.total || 0),
                gravadas: (a.gravadas || 0) + (b.gravadas || 0)
            })
        }, { igv: 0, total: 0, gravadas: 0 })
        setComprobante( current => ({
            ...current,
            items: cart,
            gravadas: +(totalize.gravadas.toFixed(2)),
            total: +(totalize.total),
            igv:+(totalize.igv)
        }))
    }, [cart])
    

    const { register, reset, watch, handleSubmit, trigger, setValue, getValues, formState: { errors } }  = useForm<FormData>({
        defaultValues: { 
            numeroDocumento: '', razonSocial: '', direccion: '', correo: '', placa: '',
            numeracion: '',
            ruc_emisor: '',
            tipoComprobante: tipoComprobante,
            fecha_emision: '',
            moneda: '',
            gravadas: 0,
            igv: 0,
            total: 0,
            efectivo: 0,
            tarjeta: 0,
            yape: 0,
            billete: 0,
            usuarioId: 0,
            ruc: ''
        }
    });

    const onSubmitForm = async (data: FormData) => {

        const session = await getSession();

        const receptorForm: IReceptor = {
            id_receptor: 0,
            numero_documento: data.numeroDocumento,
            tipo_documento: data.numeroDocumento.length===11?6:0,
            razon_social: data.razonSocial,
            direccion: data.direccion,
            correo: data.correo,
            placa: data.placa,
        }
        setComprobante( current => ({
            ...current,
            Receptor: receptorForm,
            numeracion: data.numeracion||"",
            tipo_comprobante: tipoComprobante,
            fecha_emision: data.fecha_emision,
            moneda: data.moneda,
            gravadas: data.gravadas,
            igv: data.igv,
            total: data.total,
            efectivo: data.efectivo,
            tarjeta: data.tarjeta,
            yape: data.yape,
            billete: data.billete,
            usuarioId: +(session?.user.id || 0),
            ruc: ''
        }))

        const { hasError, respuesta, storage } = await createOrderAdministrador(comprobante, receptorForm, tipoComprobante, +(session?.user.id || 0)); 

        if(!hasError){
            setComprobante( current => ({
                ...current,
                numeracion: storage.numeracion_comprobante,
                cadena_para_codigo_qr: storage.cadena_para_codigo_qr,
                codigo_hash: storage.codigo_hash,
                fecha_abastecimiento: storage.fecha_abastecimiento
            }))

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

    const handlePrint = useReactToPrint({
        pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",        
        content: () => componentRef.current || null,
        onAfterPrint: () => {
            // Reset the Promise resolve so we can print again
            emptyOrder();
            router.push('/');
          }        
    });

    const handleTipoDocumento = (
        event: React.MouseEvent<HTMLElement>,
        nuevoTipoDocumento: string,
      ) => {
          
        setTipoComprobante(nuevoTipoDocumento);
        //reset({ numeroDocumento: '', razonSocial: '', direccion: '', correo: '', placa: '', comentario: ''});
    };

    const handleClickMedioPago = (formValue : 'tarjeta'|'efectivo'|'yape') => {
        setValue('tarjeta', 0, { shouldValidate: true });
        setValue('efectivo', 0, { shouldValidate: true });
        setValue('yape', 0, { shouldValidate: true });
        //setValue(formValue, fuel?.valorTotal||0, { shouldValidate: true });
    }
    
    return (
        <FuelLayout title='Venta de productos' pageDescription={'Venta de productos'}>
            <Typography variant='h1' component='h1'>Venta de productos</Typography>
            <>
            <PrintComprobanteAdmin ref={componentRef} comprobante={comprobante}/>
                <form onSubmit={ handleSubmit( onSubmitForm ) } onKeyDown={(e) => checkKeyDown(e)}>
                    <Grid container spacing={2}>
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
                                            <ToggleButton value="03" sx={{fontSize: 20}}>BOLETA</ToggleButton>
                                            <ToggleButton value="01" sx={{fontSize: 20}}>FACTURA</ToggleButton>
                                            <ToggleButton value="50" sx={{fontSize: 20}}>NOTA DESPACHO</ToggleButton>
                                            <ToggleButton value="51" sx={{fontSize: 20}}>CALIBRACION</ToggleButton>
                                        </ToggleButtonGroup>    
                                    </Grid>
                                    <Grid container spacing={2} sx={{ mt: 1}}>
                                        {/* <Grid item xs={12} sm={6} display={{ xs: (tipoComprobante=='51')?"none":"block" }}> */}
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label={(tipoComprobante=='03'||tipoComprobante=='51')?'DNI':'RUC'}
                                                variant='standard' 
                                                inputProps={{style: { fontSize: 25, textTransform: "uppercase" }}}
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
                                                inputProps={{style: { fontSize: 25, textTransform: "uppercase" }}}
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
                                                inputProps={{style: { fontSize: 25, textTransform: "uppercase" }}}
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
                                                inputProps={{style: { fontSize: 25, textTransform: "uppercase" }}}
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
                                        <Grid item xs={4} sm={4}>
                                            <TextField
                                                label="Tarjeta"
                                                variant="standard"
                                                type='number'
                                                fullWidth
                                                { ...register('tarjeta')}
                                                error={ !!errors.tarjeta }
                                                helperText={ errors.tarjeta?.message }
                                                // onChange={handleTarjetaValueChange}
                                                inputProps={{
                                                    maxLength: 5,
                                                    step: 0.01
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <IconButton aria-label="toggle password visibility" onClick={() => handleClickMedioPago('tarjeta')}>
                                                                <CreditCard color="secondary"/>
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />                                         
                                        </Grid>
                                        <Grid item xs={4} sm={4}>
                                            <TextField
                                                label="Efectivo"
                                                variant='standard' 
                                                type='number'
                                                fullWidth
                                                { ...register('efectivo',)}
                                                error={ !!errors.efectivo }
                                                helperText={ errors.efectivo?.message }  
                                                // onChange={handleEfectivoValueChange}
                                                inputProps={{
                                                    maxLength: 5,
                                                    step: 0.01
                                                }}                                                                                           
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() => handleClickMedioPago('efectivo')}
                                                            >
                                                                <Payments color="success"/>
                                                            </IconButton>                                                            
                                                            
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />  
                                        </Grid>
                                        <Grid item xs={4} sm={4}>
                                            <TextField
                                                label="Yape/Plin"
                                                variant='standard' 
                                                type='number'
                                                fullWidth
                                                { ...register('yape')}
                                                error={ !!errors.yape }
                                                helperText={ errors.yape?.message }  
                                                // onChange={handleEfectivoValueChange}
                                                inputProps={{
                                                    maxLength: 5,
                                                    step: 0.01
                                                }}                                                                                           
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() => handleClickMedioPago('yape')}
                                                            >
                                                                <PhoneAndroid color="warning"/>
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
                                    <OrderSumaryAdministrator comprobante={comprobante}/>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3}}>
                        <Button
                            color='secondary'
                            className='circular-btn'
                            fullWidth
                            // disabled={isLoaded}
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

export default CartPage