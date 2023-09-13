import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

type FormData = {
    fechaInicio: Date;
    fechaFin: Date;
}

export const Diario = () => {

    const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());
    const [fechaFin, setFechaFin] = useState<Date | null>(new Date());
    
    const { control, register, reset, handleSubmit, trigger, setValue, getValues, formState: { errors } }  = useForm<FormData>({
        defaultValues: {
            fechaInicio: new Date(), fechaFin: new Date()
        }
    });

    const onSubmitReporte = async (data: FormData) => {
        console.log(fechaInicio);
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
                                                ({ field: { onChange, ...restField } }) =>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Fecha de inicio"
                                                    value={ fechaInicio }
                                                    onChange={(newValue) => setFechaInicio(newValue)}
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
                                                ({ field: { onChange, ...restField } }) =>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Fecha fin"
                                                    value={ fechaFin }
                                                    onChange={(newValue) => setFechaFin(newValue)}
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
                            <Button
                            color='success'
                            className='circular-btn'
                            fullWidth
                            type='submit'
                            disabled
                            >                           
                                Descargar
                            </Button>                            
                        </Grid>                         
                    </Grid>                  
                </Box>                
            </form>
        </>
    )
}
