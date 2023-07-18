import React, { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';
import { useReactToPrint } from 'react-to-print';
import { Box, Button, Card, CardContent, Divider, Grid, TextField, Typography, MenuItem, Snackbar, Alert, AlertColor } from '@mui/material'

import { FuelContext } from '@/context'
import { FuelLayout } from '@/components/layouts'
import { PrintPos } from '@/components/print/PrintPos'
import { OrderSumary } from '@/components/cart';
import { useFuel } from '@/hooks/useFuel';
import { IReceptor } from '@/interfaces';
import { getSession } from 'next-auth/react';



type FormData = {
    numeroDocumento: string;
    razonSocial: string;
    direccion: string;
    correo: string;
    placa: string;
    tipoDocumento: string;
}
interface AlertState {
    state: boolean;
    mensaje: string;
    severity: AlertColor;
    time: number;
}
const InvoicePage : NextPage = () => {

    const { register, reset, handleSubmit, setValue, formState: { errors } }  = useForm<FormData>({
        defaultValues: {
            numeroDocumento: '',
            razonSocial: '',
            direccion: '',
            correo: '',
            placa: '',
            tipoDocumento: '03'
        }
    });

    const router = useRouter();
    const { fuel, isLoading, isError } = useFuel(`/${ router.query.slug }`,{ refreshInterval: 0});
    const { createOrder, comprobante, receptor, emptyOrder, findRuc } = useContext(FuelContext)
    const [alerta, setAlerta] = useState<AlertState>({state: false, mensaje: '', severity: 'success', time: 3000});
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setAlerta({state: false, mensaje: '', severity: 'success', time: 3000})
    };
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",        
        content: () => componentRef.current || null,
        onAfterPrint: () => {
            // Reset the Promise resolve so we can print again
            emptyOrder();
            router.push('/');
          }        
    });    

    const onSubmitFuel = async (data: FormData) => {
        const receptorForm: IReceptor = {
            numero_documento: data.numeroDocumento,
            tipo_documento: data.numeroDocumento.length===11?6:0,
            razon_social: data.razonSocial,
            direccion: data.direccion,
            correo: data.correo
        }     
        const { hasError, respuesta } = await createOrder(data.tipoDocumento, receptorForm, data.placa, fuel?.idAbastecimiento); 
        console.log(hasError, respuesta);

        if(!hasError && !respuesta?.factura?.response?.errors){
            setAlerta({state: true, mensaje: 'Comprobante guardado y enviado a SUNAT', severity: 'success', time: 3000});
            await setTimeout(function(){      
                handlePrint();
            }, 2000);
        }else{
            setAlerta({state: true, mensaje: respuesta?.factura?.response?.errors, severity: 'error', time: 7000});
        }
    }    
    const checkKeyDown = async (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter'){
            e.preventDefault();
            const data = await findRuc((e.target as HTMLInputElement).value);
            if(data.receptores && !data.hasError && data.receptores.length > 0){
                reset({ razonSocial: '', direccion: '', correo: '', placa: ''});
                setAlerta({state: true, mensaje: 'Cliente encontrado', severity: 'success', time: 3000});
                setValue("numeroDocumento", data.receptores[0].numero_documento, { shouldValidate: true });
                setValue("razonSocial", data.receptores[0].razon_social, { shouldValidate: true });
                setValue("direccion", data.receptores[0].direccion, { shouldValidate: true });
            }else{
                setAlerta({state: true, mensaje: 'Cliente NO encontrado, se registrará un nuevo cliente', severity: 'warning', time: 3000});
            }
        }
    };    

     return (
         <FuelLayout title='Resumen de compra' pageDescription={'Resumen de la compra'}>
            <Snackbar open={alerta.state} autoHideDuration={alerta.time} onClose={handleClose}>
                <Alert onClose={handleClose} variant="filled" severity={alerta.severity} sx={{ width: '100%' }}>
                    {alerta.mensaje}
                </Alert>
            </Snackbar>                                
             <Typography variant='h1' component='h1'>Detalle de la orden</Typography>
             <>
                <div style={{ display: "none" }}>
                    <PrintPos ref={componentRef} receptor={receptor?receptor:''} comprobante={comprobante?comprobante:''}/>
                </div>      
                <form onSubmit={ handleSubmit( onSubmitFuel ) } onKeyDown={(e) => checkKeyDown(e)}>
                    <Grid container  spacing={2}>
                        <Grid item xs={12} sm={7}>
                            <Card className='sumary-card'>
                                <CardContent>
                                    <Typography variant='h2'>Datos del cliente</Typography>

                                    <Divider sx={{mt: 2}}/>
                                <Grid container spacing={2} sx={{ mt: 1}}>
                                    
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                //value={valueTipo}
                                                //onChange={handleChange}
                                                variant='filled' 
                                                label='Tipo documento'
                                                defaultValue={ '03' }
                                                select
                                                style={{ width: '100%' }}
                                                fullWidth
                                                { ...register('tipoDocumento', {
                                                    required: 'Este campo es requerido'
                                                    
                                                })}                                                
                                                error={ !!errors.tipoDocumento }
                                            >
                                                <MenuItem value={'03'}>Boleta</MenuItem>
                                                <MenuItem value={'01'}>Factura</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label='RUC' 
                                                variant='filled' 
                                                //value={valueRazonSocial} 
                                                //onChange={handleChangeRazonSocial} 
                                                fullWidth
                                                { ...register('numeroDocumento', {
                                                    required: 'Este campo es requerido'
                                                    
                                                })}

                                                error={ !!errors.razonSocial }
                                                helperText={ errors.razonSocial?.message }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label='Razón social' 
                                                variant='filled' 
                                                //value={valueRazonSocial} 
                                                //onChange={handleChangeRazonSocial} 
                                                fullWidth
                                                { ...register('razonSocial', {
                                                    required: 'Este campo es requerido'
                                                    
                                                })}
                                                error={ !!errors.razonSocial }
                                                helperText={ errors.razonSocial?.message }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label='Direccion' 
                                                variant='filled' 
                                                //value={valueDireccion} 
                                                //onChange={handleChangeDireccion} 
                                                fullWidth
                                                { ...register('direccion')}
                                                error={ !!errors.direccion }
                                                helperText={ errors.direccion?.message }
                                            />
                                        </Grid>                                 
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label='Placa del vehículo' 
                                                variant='filled' 
                                                //value={valuePlaca} 
                                                //onChange={handleChangePlaca} 
                                                fullWidth
                                                { ...register('placa')}
                                                error={ !!errors.placa }
                                                helperText={ errors.placa?.message }                                            
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

                                    <OrderSumary fuel={fuel}/>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3}}>
                        <Button
                            color='secondary'
                            className='circular-btn'
                            fullWidth
                            //onClick={ onCreateInvoice }
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