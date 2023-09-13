import { OrderSumary } from "@/components/cart";
import { FuelLayout } from "@/components/layouts";
import { PrintPos } from "@/components/print/PrintPos";
import { ChangePasswordDialog } from "@/components/users/ChangePasswordDialog";
import { FuelContext, UiContext } from "@/context";
import { Constantes } from "@/helpers";
import constantes from "@/helpers/constantes";
import { useFuel } from "@/hooks/useFuel";
import { IReceptor, IUser } from "@/interfaces";
import { Box, Button, Card, CardContent, Divider, Grid, IconButton, InputAdornment, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";

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

const NotaCreditoPage: NextPage = () => {

    const { data: session, status } = useSession()
    const router = useRouter();
    const componentRef = useRef();
    const { showAlert } = useContext( UiContext );

    const { fuel, isLoading, isError } = useFuel(`/${ router.query.id }`,{ refreshInterval: 0});

    const { createOrder, findRuc, comprobante, receptor, emptyOrder, cleanOrder, isLoaded } = useContext(FuelContext)

    const handlePrint = useReactToPrint({
        pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",        
        content: () => componentRef.current || null,
        onAfterPrint: () => {
            // Reset the Promise resolve so we can print again
            emptyOrder();
            router.push('/');
          }        
    });

    const onSubmitFuel = async () => {

        const receptorForm: IReceptor = {
            id_receptor: 0,
            numero_documento: router.query.numero_documento?.toString() || "",
            tipo_documento: 0,
            razon_social: router.query.razon_social?.toString() || "",
            direccion: "",
            correo: "",
            placa: ""
        }     

        const idAbastecimiento: number = router.query.id? +router.query.id : 0;
        const tipo_afectado: string = router.query.tipo_afectado?.toString() || "";
        const numeracion_afectado: string = router.query.numeracion_afectado?.toString() || "";
        const fecha_afectado: string = router.query.fecha_afectado?.toString() || "";
        const producto: string = fuel?.descripcionCombustible || "";
        const prefijo: string = tipo_afectado == Constantes.TipoComprobante.Boleta?"B":"F";

        const { hasError, respuesta } = await createOrder(constantes.TipoComprobante.NotaCredito, receptorForm, "", producto, 0, 0, tipo_afectado, numeracion_afectado, fecha_afectado, prefijo, idAbastecimiento); 
        
        if(hasError){
            console.log("tiene errrores");
            emptyOrder();
            showAlert({mensaje: respuesta, severity: 'error', time: 7000})
        }else{
            console.log("NO tiene errrores");
            showAlert({mensaje: respuesta, time: 1500})         
            await setTimeout(function(){      
                handlePrint();
            }, 2000);
        }
    }     
    
    return(
        <>
            <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
                <Typography variant='h1' component = 'h1' sx={{mb:2}}>Nota de credito</Typography>
                <>
                <PrintPos ref={componentRef} receptor={receptor} comprobante={comprobante}/>
                    <Grid container  spacing={2}>
                        <Grid item xs={12} sm={7}>
                        <Card className='invoice-card'>
                                <CardContent>
                                    <Typography variant='h2'>Datos del comprobante</Typography>
                                    <Divider sx={{mt: 2, mb: 2}}/>
                                    <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Numero documento</Typography>
                                    </Grid>
                                    <Grid item xs={6} display='flex' sx={{ mb: 2}}>
                                        <Typography>{ router.query.numero_documento  }</Typography>
                                    </Grid>        
                                    <Grid item xs={6}>
                                        <Typography>Razon social</Typography>
                                    </Grid>
                                    <Grid item xs={6} display='flex' sx={{ mb: 2}}>
                                        <Typography>{ router.query.razon_social  }</Typography>
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
                                    <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Producto</Typography>
                                    </Grid>
                                    <Grid item xs={6} display='flex' justifyContent='end' sx={{ mb: 2}}>
                                        <Typography variant='h5'>{ fuel?.descripcionCombustible }</Typography>
                                    </Grid>        
                                    <Grid item xs={6}>
                                        <Typography>Cantidad</Typography>
                                    </Grid>
                                    <Grid item xs={6} display='flex' justifyContent='end' sx={{ mb: 2}}>
                                        <Typography>{ fuel?.volTotal }</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>Precio</Typography>
                                    </Grid>
                                    <Grid item xs={6} display='flex' justifyContent='end' sx={{ mb: 2}}>
                                        <Typography>{ fuel?.precioUnitario }</Typography>
                                    </Grid>        
                                    <Grid item xs={6}>
                                        <Typography>IGV (18%)</Typography>
                                    </Grid>
                                    <Grid item xs={6} display='flex' justifyContent='end'>
                                        <Typography>{ (((fuel?fuel.valorTotal:0)/1.18)*0.18).toFixed(2) }</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider sx={{mt: 2, mb: 2}}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">Total:</Typography>
                                    </Grid>
                                    <Grid item xs={6} display='flex' justifyContent='end'>
                                        <Typography variant="subtitle1">{ fuel?.valorTotal }</Typography>
                                    </Grid>
                                </Grid>
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
                            onClick={ onSubmitFuel }
                        >                           
                            Confirmar orden
                        </Button>
                    </Box>

            </>

            </FuelLayout>             
        </>
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
  
  
  export default NotaCreditoPage