import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { formatDateUS } from '@/helpers/util';
import { ReporteProductoDias } from '@/hooks/useReportes';
import { useExcelDownloder } from 'react-xls';

type FormData = {
    fechaInicio: Date;
    fechaFin: Date;
}

export const Diario = () => {

    const { ExcelDownloder, Type } = useExcelDownloder();

    const { control, register, reset, handleSubmit, trigger, setValue, getValues, formState: { errors } }  = useForm<FormData>({
        defaultValues: {
            fechaInicio: new Date(), fechaFin: new Date()
        }
    });

    const [showPrint, setShowPrint] = useState(false);
    const [dataDownloader, setDataDownloader] = useState<any>();

    const onSubmitReporte = async ({ fechaInicio, fechaFin}: FormData) => {
        
        const paramFechaInicio: string = formatDateUS(fechaInicio || new Date());
        const paramFechaFin: string = formatDateUS(fechaFin || new Date());
        const { hasError, message, data} = await ReporteProductoDias(paramFechaInicio, paramFechaFin);
        if(!hasError && data.length > 0 ){
            const reporte = { paramFechaInicio: data }
            setDataDownloader(reporte)
            setShowPrint(true)
        }else{
            setShowPrint(false)
        }
    }

    return (
        <>
            <form onSubmit={ handleSubmit( onSubmitReporte ) }>
                <Grid container  spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <Card className='card-diario'>
                            <CardHeader
                                title="Reporte diario"
                                subheader="Seleccione el rango de fechas para obtener el reporte"
                            />                            
                            <CardContent> 
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={6}>
                                        <Controller
                                            name="fechaInicio"
                                            control={ control }
                                            render={
                                                ({ field }) =>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Fecha de inicio"
                                                    onChange={(date) => field.onChange(date)}
                                                />
                                                </LocalizationProvider>
                                                }
                                        /> 
                                    </Grid>    
                                    <Grid item xs={6} sm={6}>
                                        <Controller
                                            name="fechaFin"
                                            control={ control }
                                            render={
                                                ({ field }) =>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Fecha fin"
                                                    onChange={(date) => field.onChange(date)}
                                                />
                                                </LocalizationProvider>
                                                }
                                        /> 
                                    </Grid>  
                                </Grid>                                                              
                            </CardContent>
                        </Card>                                                           
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3}}>
                    <Grid container spacing={2} sx={{ mt: 1}}>
                        <Grid item xs={6} sm={6}>
                            <Button
                            color='secondary'
                            className='circular-btn'
                            fullWidth
                            type='submit'
                            >                           
                                Generar Reporte
                            </Button>                            
                        </Grid> 
                        <Grid item xs={6} sm={6}>
                            {
                                showPrint ? <ExcelDownloder
                                filename={`REPORTE_DIARIO_${formatDateUS(getValues("fechaInicio") || new Date())}_${formatDateUS(getValues("fechaFin") || new Date())}`}
                                data={ dataDownloader }
                                type={ Type.Button }
                                >                           
                                    Descargar
                                </ExcelDownloder> : <></>
                            }
                        </Grid>                           
                    </Grid>                  
                </Box>                
            </form>
        </>
    )
}
