import React, { useCallback, useContext, useRef, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react';
import { Box, Button, Card, CardContent, Divider, Grid, Link, TextField, Typography, Autocomplete, createFilterOptions, Select, MenuItem } from '@mui/material'
import { useReactToPrint } from 'react-to-print';
import { FuelLayout } from '@/components/layouts'
import { FuelContext } from '@/context'
import { PrintPos } from '@/components/print/PrintPos'
import { initialReceptor } from '@/database/receptor';
import { OrderSumary } from '@/components/cart';
import { useFuel } from '@/hooks/useFuel';
import { useRouter } from 'next/router';
import { IReceptor } from '@/interfaces';
import { NextResponse } from 'next/server';



const InvoicePage : NextPage = () => {

    const router = useRouter();
    const { fuel, isLoading, isError } = useFuel(`/${ router.query.slug }`,{ refreshInterval: 0});

    const RECEPTOR_INITIAL_STATE: IReceptor = {
        tipo_documento: 0,
        numero_documento: "",
        razon_social: "",
        direccion: "",
        correo: ""
    }
      
    const [selected, setSelected] = useState<IReceptor[]>([RECEPTOR_INITIAL_STATE])
    const [valueNumeroDocumentoTemp, setValueNumeroDocumentoTemp] = useState('')
    const [valueNumeroDocumento, setValueNumeroDocumento] = useState('')
    const [valueRazonSocial, setValueRazonSocial] = useState('')
    const [valueDireccion, setValueDireccion] = useState('')
    const [valueCorreo, setValueCorreo] = useState('')
    const [valuePlaca, setValuePlaca] = useState('')
    const [valueTipo, setValueTipo] = useState('03')

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        pageStyle: "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",        
        content: () => componentRef.current || null,
        onAfterPrint: () => {
            // Reset the Promise resolve so we can print again
            emptyOrder();
          }        
    });    

    const { createOrder, numeroComprobante, codigoHash, codigoQr, emptyOrder, findRuc } = useContext(FuelContext)

    const onCreateInvoice = async() => {
        
        const receptor_numero_documento = valueNumeroDocumento?valueNumeroDocumento:valueNumeroDocumentoTemp;
        var receptor: IReceptor = {
            numero_documento: receptor_numero_documento,
            tipo_documento: receptor_numero_documento.length===11?6:0,
            razon_social: valueRazonSocial,
            direccion: valueDireccion,
            correo: valueCorreo
        }
        //TODO: validar que al crear orden no tengo el numero de comprobante vacío
        const { hasError, respuesta } = await createOrder(valueTipo, receptor, valuePlaca, fuel?.idAbastecimiento); 
        console.log(respuesta?.factura?.response?.errors.length);
        if(!hasError && !respuesta?.factura?.response?.errors){
            await setTimeout(function(){            
                handlePrint();
                router.push('/');
            }, 2000);
        }

    }  

    const onChangeOne= async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>{
        if(e.target.value){
            setValueNumeroDocumentoTemp(e.target.value)
            setValueNumeroDocumento('');
            setValueRazonSocial('');
            setValueDireccion('');
            setValuePlaca('');
            let data = await findRuc(e.target.value);
            let object = data.receptores;
            setSelected(object) 
        }
    }

    const setClientValues= (receptor : any) =>{
        setValueNumeroDocumento(receptor?receptor.numero_documento:"")
        setValueRazonSocial(receptor?receptor.razon_social:"")
        setValueDireccion(receptor?receptor.direccion:"")
    }

    const handleChangeRazonSocial = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setValueRazonSocial(event.target.value);
    };
    const handleChangeDireccion = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setValueDireccion(event.target.value);
    };
    const handleChangePlaca = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setValuePlaca(event.target.value);
    };

    function handleChange(event : any) {
        setValueTipo(event.target.value)
     }

     return (
         <FuelLayout title='Resumen de compra' pageDescription={'Resumen de la compra'}>
             <Typography variant='h1' component='h1'>Detalle de la orden</Typography>
             <>
                <div style={{ display: "none" }}>
                    <PrintPos ref={componentRef} receptor={initialReceptor} ticket={numeroComprobante?numeroComprobante:""} fuel={fuel} hash={codigoHash} qr={codigoQr}/>
                </div>      
       
                <Grid container  spacing={2}>
                    <Grid item xs={12} sm={7}>
                        <Card className='sumary-card'>
                            <CardContent>
                                <Typography variant='h2'>Datos del cliente</Typography>

                                <Divider sx={{mt: 2}}/>
                            <Grid container spacing={2} sx={{ mt: 1}}>
                                    <Grid item xs={12} sm={6}>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select-autowidth"
                                            value={valueTipo}
                                            onChange={handleChange}
                                            autoWidth
                                            style={{ width: '100%' }} 
                                        >
                                            <MenuItem value={'03'}>Boleta</MenuItem>
                                            <MenuItem value={'01'}>Factura</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                    <Autocomplete 
                                        freeSolo
                                        filterOptions={(x) => x}
                                        //disableClearable
                                        onChange={(event, optionSelected, reasson) => {
                                            setClientValues(optionSelected)
                                        }}
                                        options={selected}
                                        getOptionLabel={(selected) => (typeof selected === 'string')? "":selected.numero_documento }
                                        renderInput={(params)=>{
                                            return <TextField
                                                {...params}
                                                label="Numero documento" 
                                                onChange={(e)=>{
                                                    onChangeOne(e);
                                                }}
                                                // inputProps={{
                                                //     ...params.inputProps,
                                                //     onKeyDown: (e) => {
                                                //           if (e.key === 'Enter') {
                                                //             e.stopPropagation();
                                                //           }
                                                //     },
                                                //   }}                                                
                                                />;
                                        }}
                                        
                                     />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label='Razón social' variant='filled' value={valueRazonSocial} onChange={handleChangeRazonSocial} fullWidth></TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label='Direccion' variant='filled' value={valueDireccion} onChange={handleChangeDireccion} fullWidth></TextField>
                                    </Grid>                                 
                                    <Grid item xs={12} sm={6}>
                                        <TextField label='Placa del vehículo' variant='filled' value={valuePlaca} onChange={handleChangePlaca} fullWidth></TextField>
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
                        onClick={ onCreateInvoice }
                    >
                        Confirmar orden
                    </Button>
                </Box>
            </>

         </FuelLayout>
       )
}

export default InvoicePage