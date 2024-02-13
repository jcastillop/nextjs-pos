import React, { useContext, useEffect, useRef, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { useReactToPrint } from 'react-to-print';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid';

import { FuelLayout } from '../../components/layouts';
import { getSession, useSession } from 'next-auth/react';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentsIcon from '@mui/icons-material/Payments';

import { useNotasDespacho } from '../../hooks/useNotasDespacho';
import { Typography, Grid, Button, TextField, MenuItem, IconButton, InputAdornment, Card, CardContent, Box } from '@mui/material';
import { CustomerDialog } from '@/components/customers/CustomerDialog';
import { IComprobanteAdmin, IComprobanteAdminItem, IReceptor } from '@/interfaces';
import { useReceptores } from '@/hooks';
import { useForm } from 'react-hook-form';
import { Constantes } from '@/helpers';
import { PersonSearchOutlined, PhoneAndroid } from '@mui/icons-material';
import { FuelContext, UiContext } from '@/context';
import { useRouter } from 'next/router';
import { PrintComprobanteAdmin } from '@/components/print/PrintComprobanteAdmin';

const initialReceptor: IReceptor = {
    id_receptor: 0,
    tipo_documento: 0,
    numero_documento: '',
    razon_social: '',
    direccion: '',
    correo: '',
    placa: ''
}
const initialComprobante: IComprobanteAdmin = {
    Receptor: initialReceptor,
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

const NotasDespachoPage: NextPage = () => {

    const router = useRouter();
    const componentRef = useRef();    
    const apiRef = useGridApiRef()

    const [filtervalue, setFiltervalue] = useState("0")

    const { showAlert } = useContext( UiContext );

    const [comprobante, setComprobante] = useState(initialComprobante)
    const [receptor, setReceptor] = useState(initialComprobante)

    const [items, setItems] = useState<IComprobanteAdminItem[]>([])

    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);

    const { hasError, isLoading, comprobantes } = useNotasDespacho(filtervalue, { refreshInterval: 0});

    const { findRuc, createOrderAdministrador, emptyOrder, isLoaded } = useContext(FuelContext)

    const { register, reset, watch, handleSubmit, trigger, setValue, getValues, formState: { errors } }  = useForm<FormData>({
        defaultValues: { 
            numeroDocumento: '', razonSocial: '', direccion: '', correo: '', placa: '',
            numeracion: '',
            ruc_emisor: '',
            tipoComprobante: '01',
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

    useEffect(() => {
        const rows = apiRef.current.getSelectedRows()
        var itemComprobanteAdmin: IComprobanteAdminItem[] = []
        rows.forEach( row => {
            const vv:number = +row.total - (+row.igv) 
            const item: IComprobanteAdminItem = {
                cantidad: 1,
                precio: row.total,
                valor: vv,
                igv: +row.igv,
                valor_venta: vv,
                precio_venta: +row.total,
                descripcion: row.numeracion,
                codigo_producto: row.id,
                medida: ''
            }
            itemComprobanteAdmin.push(item)
        })
        setItems(itemComprobanteAdmin)
    }, [apiRef, rowSelectionModel])

    useEffect(() => {
    }, [])

    useEffect(() => {
        const totalize = items?.map(item => ({ igv: item.igv, total: item.precio_venta, gravadas: item.valor_venta })).reduce((a, b) => {
            return ({
                igv: (a.igv || 0) + (b.igv || 0),
                total: (a.total || 0) + (b.total || 0),
                gravadas: (a.gravadas || 0) + (b.gravadas || 0)
            })
        }, { igv: 0, total: 0, gravadas: 0 })

        setComprobante( current => ({
            ...current,
            items: items,
            gravadas: +(totalize.gravadas.toFixed(2)),
            total_venta: +(totalize.total),
            total_igv:+(totalize.igv)
        }))
        setValue("efectivo", +(totalize.total), { shouldValidate: true });
    }, [items, setValue])    
    
    const checkKeyDown = async (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter'){
            e.preventDefault();
            const bTrigger: boolean = await trigger("numeroDocumento")
            if(bTrigger){
                setFiltervalue((e.target as HTMLInputElement).value)
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

    const HandleConsultaRuc = async () => {
        
        const data = await findRuc(getValues("numeroDocumento"));
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

    const handleClickMedioPago = (formValue : 'tarjeta'|'efectivo'|'yape') => {
        setValue('tarjeta', 0, { shouldValidate: true });
        setValue('efectivo', 0, { shouldValidate: true });
        setValue('yape', 0, { shouldValidate: true });
        // setValue(formValue, totales||0, { shouldValidate: true });
    }    

    const handlePrint = useReactToPrint({
        pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",        
        content: () => componentRef.current || null,
        onAfterPrint: () => {
            // Reset the Promise resolve so we can print again
            emptyOrder();
            router.push('/');
          }        
    });    

    const isTotalValid = () => {
        return true
        // const validateTarjeta = +getValues("tarjeta")
        // const validateEfectivo = +getValues("efectivo")
        // const validateYape = +getValues("yape")
        // const total = totales||0

        // if (total != ( validateTarjeta + validateEfectivo + validateYape )){
        //     return `El monto no coincide con el total: ${total}`
        // }else{
        //     return true
        // }
    };

    const onSubmitFuel = async (data: FormData) => {

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
            numeracion: "",
            tipo_comprobante: "01",
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
            placa: data.placa,
            ruc: ''
        }))     
     
        const { hasError, respuesta, storage } = await createOrderAdministrador(comprobante, receptorForm, '01', data.efectivo, data.tarjeta, data.yape, +(session?.user.id || 0)); 

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

    if ( !comprobantes ) return (<></>);

    const rows = comprobantes.map( (comprobante: any) => ({
        id              : comprobante.id,
        numeracion      : comprobante.numeracion_comprobante,
        fecha_emision   : comprobante.fecha_emision,
        ruc             : comprobante["Receptore.numero_documento"],
        razon_social    : comprobante["Receptore.razon_social"],
        igv             : comprobante.total_igv,
        total           : comprobante.total_venta
    }))

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 2 },
        { field: 'numeracion', headerName: 'Comprobante', width: 150 },
        { field: 'fecha_emision', headerName: 'Fecha', width: 100 },
        { field: 'ruc', headerName: 'RUC', width: 100 },
        { field: 'razon_social', headerName: 'Razon social', width: 250 },
        { field: 'igv', headerName: 'IGV', width: 100 },
        { field: 'total', headerName: 'Total', width: 100 },
    ]

    return (
        <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
            <Typography variant='h1' component = 'h1'>Facturación de notas de despacho</Typography>
            <PrintComprobanteAdmin ref={componentRef} comprobante={comprobante}/>
            <Grid container  spacing={2}>
                <Grid item xs={12} sm={5}>
                    <Card className='sumary-card'>
                        <CardContent>
                            <form onSubmit={ handleSubmit( onSubmitFuel ) } onKeyDown={(e) => checkKeyDown(e)}>
                            <Grid container spacing={2} sx={{ mt: 1}}>
                            {/* <Grid item xs={12} sm={6} display={{ xs: (tipoComprobante=='51')?"none":"block" }}> */}
                                <Grid item xs={12} sm={6}>
                                    
                                    <TextField 
                                        label={'RUC'}
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
                                                value: /^([0-9]{11})$/,
                                                message: `El RUC ingresado es incorrecto`
                                                }
                                        })}
                                        InputLabelProps={{ shrink: true }} 
                                        error={ !!errors.numeroDocumento }
                                        helperText={ errors.numeroDocumento?.message }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => HandleConsultaRuc()}
                                                    >
                                                        <PersonSearchOutlined/>
                                                    </IconButton>                                                            
                                                    
                                                </InputAdornment>
                                            ),
                                        }}                                                
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        label={'Razón social'}
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
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        label='Direccion' 
                                        variant='standard'
                                        inputProps={{style: { fontSize: 20, textTransform: "uppercase" }}}
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        { ...register('direccion')}
                                        error={ !!errors.direccion }
                                        helperText={ errors.direccion?.message }
                                    />
                                </Grid>                                 
                                <Grid item xs={12} sm={6}>
                                <TextField 
                                        onKeyDown={(event) => {
                                            if (!Constantes.ALPHA_NUMERIC_REGEX.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}                                            
                                        label='Placa' 
                                        variant='standard' 
                                        InputLabelProps={{ shrink: true }} 
                                        inputProps={{style: { fontSize: 20, textTransform: "uppercase" }}}
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
                                        inputProps={{style: { fontSize: 20, textTransform: "uppercase" }}}
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
                                        { ...register('tarjeta', {
                                            validate: isTotalValid
                                        })}
                                        error={ !!errors.tarjeta }
                                        helperText={ errors.tarjeta?.message }
                                        // onChange={handleTarjetaValueChange}
                                        inputProps={{
                                            maxLength: 5,
                                            step: 0.01,
                                            style: { fontSize: 15, textTransform: "uppercase" }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <IconButton aria-label="toggle password visibility" onClick={() => handleClickMedioPago('tarjeta')}>
                                                        <CreditCardIcon color="secondary"/>
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
                                        { ...register('efectivo', {
                                            validate: isTotalValid
                                        })}
                                        error={ !!errors.efectivo }
                                        helperText={ errors.efectivo?.message }  
                                        // onChange={handleEfectivoValueChange}
                                        inputProps={{
                                            maxLength: 5,
                                            step: 0.01,
                                            style: { fontSize: 15, textTransform: "uppercase" }
                                        }}                                                                                           
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => handleClickMedioPago('efectivo')}
                                                    >
                                                        <PaymentsIcon color="success"/>
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
                                        { ...register('yape', {
                                            validate: isTotalValid
                                        })}
                                        error={ !!errors.yape }
                                        helperText={ errors.yape?.message }  
                                        // onChange={handleEfectivoValueChange}
                                        inputProps={{
                                            maxLength: 5,
                                            step: 0.01,
                                            style: { fontSize: 15, textTransform: "uppercase" }
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
                        </CardContent>
                    </Card>                  
                </Grid>
                <Grid item xs={12} sm={7}>
                    <Grid container className='fadeIn'>
                        <Grid item xs={12} sx={{ height:700, width: '100%', mt:2}}>
                            {/* <Button
                            variant="contained"
                            color="secondary"
                            onClick={async (event) => {  
                                    // setFiltervalue("0")  
                                    // const rows = apiRef.current.getSelectedRows()
                                }}>
                                Generar comprobante
                            </Button>
                            <Typography  variant="subtitle1" style={{ color: 'blue' }}>Total a facturar S/ {totales.toFixed(2)}</Typography>                     */}
                            <DataGrid 
                                apiRef={apiRef}
                                checkboxSelection
                                onRowSelectionModelChange={(newRowSelectionModel) => {
                                    setRowSelectionModel(newRowSelectionModel);
                                }}
                                rowSelectionModel={rowSelectionModel}
                                rows={ rows }
                                columns={ columns }
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10 }},
                                    columns: {
                                    columnVisibilityModel: {
                                        // hash: false,
                                        // documento: false,
                                    }
                                    },
                                }}
                                pageSizeOptions={[5, 10, 25]}
                            />
                        </Grid>
                    </Grid>                    
                </Grid>
            </Grid>            
        </FuelLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query})=>{

    const session = await getSession({ req });
    const { p = '/auth/login'} = query
    const { q = '/'} = query
  
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
  
  export default NotasDespachoPage