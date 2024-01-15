import { OrderSumaryAdministrator } from "@/components";
import { FuelLayout } from "@/components/layouts";
import { PrintComprobanteAdmin } from "@/components/print/PrintComprobanteAdmin";
import { PrintPos } from "@/components/print/PrintPos";
import { FullScreenLoading } from "@/components/ui";

import { FuelContext, UiContext } from "@/context";
import { Constantes } from "@/helpers";
import constantes from "@/helpers/constantes";
import { useComprobante } from "@/hooks";
import { useFuel } from "@/hooks/useFuel";
import { IComprobanteAdmin, IComprobanteAdminItem, IReceptor } from "@/interfaces";
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
    tipo_comprobante: Constantes.TipoComprobante.NotaCredito,
    numeracion_comprobante: '',
    fecha_emision: '',
    moneda: '',
    tipo_operacion: '',
    tipo_nota: '',
    tipo_documento_afectado: '',
    numeracion_documento_afectado: '',
    fecha_documento_afectado: '',
    motivo_documento_afectado: 'Anulación de comprobante',
    gravadas: 0,
    total_igv: 0,
    total_venta: 0,
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

const NotaCreditoPage: NextPage = () => {

    const { data: session, status } = useSession()
    const router = useRouter();
    const componentRef = useRef();
    const { showAlert } = useContext( UiContext );

    const { comprobante, isLoading, hasErrorComprobante } = useComprobante(`${ router.query.id }`,{ refreshInterval: 0});

    const [comprobanteAdministrador, setComprobanteAdministrador] = useState(initialComprobante)

    const { createOrderAdministrador, emptyCart, receptor, emptyOrder, cart, isLoaded } = useContext(FuelContext)

    const handlePrint = useReactToPrint({
        pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",        
        content: () => componentRef.current || null,
        onAfterPrint: () => {
            // Reset the Promise resolve so we can print again
            emptyOrder();
            router.push('/');
          }        
    });

    useEffect(() => {
        const receptorForm: IReceptor = {
            id_receptor: 0,
            numero_documento: router.query.numero_documento?.toString() || "",
            tipo_documento: router.query.tipo_documento? +router.query.tipo_documento:0,
            razon_social: router.query.razon_social?.toString() || "",
            direccion: "",
            correo: "",
            placa: ""
        }

        if(!isLoading){
            var itAdm: IComprobanteAdminItem[] = []

            comprobante.comprobante.Items.map((item: { cantidad: string | number; precio_unitario: string | number; valor_unitario: string | number; igv: string | number; descripcion: any; codigo_producto: any; }) => (
                itAdm.push({
                    cantidad: +item.cantidad,
                    precio: +item.precio_unitario,
                    valor: +item.valor_unitario,
                    igv: +item.igv,
                    valor_venta: (+item.valor_unitario * +item.cantidad),
                    precio_venta: (+item.precio_unitario * +item.cantidad),
                    descripcion: item.descripcion,
                    codigo_producto: item.codigo_producto,
                    medida: ""                    
                })
            ))
            setComprobanteAdministrador( current => ({
                ...current,
                Receptor: receptorForm,
                tipo_documento_afectado: comprobante.comprobante.tipo_comprobante,
                numeracion_documento_afectado: comprobante.comprobante.numeracion_comprobante,
                fecha_documento_afectado: comprobante.comprobante.fecha_emision,
                gravadas: +comprobante.comprobante.total_gravadas,
                igv: +comprobante.comprobante.total_igv,
                total: +comprobante.comprobante.total_venta,            
                prefijo: (comprobante.comprobante.tipo_comprobante || "") == Constantes.TipoComprobante.Boleta?"B":"F",
                items: itAdm
            }))  
        }


    }, [isLoading, comprobante, router])
    

    const onSubmitFuel = async () => {

        console.log(comprobanteAdministrador);

  

        // const idAbastecimiento: number = router.query.id? +router.query.id : 0;
        // const tipo_afectado: string = router.query.tipo_afectado?.toString() || "";
        // const numeracion_afectado: string = router.query.numeracion_afectado?.toString() || "";
        // const fecha_afectado: string = router.query.fecha_afectado?.toString() || "";
        // const producto: string = fuel?.descripcionCombustible || "";
        // const prefijo: string = tipo_afectado == Constantes.TipoComprobante.Boleta?"B":"F";

        //const { hasError, respuesta } = await createOrder(constantes.TipoComprobante.NotaCredito, receptorForm, "", producto, 0, 0, 0, tipo_afectado, numeracion_afectado, fecha_afectado, prefijo, idAbastecimiento); 

        const { hasError, respuesta, storage } = await createOrderAdministrador(comprobanteAdministrador, comprobanteAdministrador.Receptor, Constantes.TipoComprobante.NotaCredito, +(session?.user.id || 0));

        if(!hasError){
            setComprobanteAdministrador( current => ({
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
            emptyCart();
            showAlert({mensaje: respuesta, severity: 'error', time: 7000})
            router.push('/');
        }

    }     
    
    return(
        (
            isLoading
            ? <FullScreenLoading/>
            : 
            <>
                <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
                    <Typography variant='h1' component = 'h1' sx={{mb:2}}>Nota de credito</Typography>
                    <>
                    <PrintComprobanteAdmin ref={componentRef} comprobante={comprobanteAdministrador}/>
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
                                <OrderSumaryAdministrator comprobante={comprobanteAdministrador}/>
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