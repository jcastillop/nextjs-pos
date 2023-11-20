import React, { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormGroup, Grid, TextField, InputLabel } from '@mui/material';
import { LocalizationProvider, DatePicker, MonthCalendar, YearCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { formatDateUS } from '@/helpers/util';
import { useExcelDownloder } from 'react-xls';
import { UiContext } from '@/context';
import { BorderAll, Padding } from '@mui/icons-material';
import { ReporteDeclaracionMensual } from '@/hooks';


type FormData = {
    mes: Date;
    anhio: Date;
}

export const DeclaracionMensual = () => {

    const { ExcelDownloder, Type, setData, setFilename } = useExcelDownloder();
    const { showAlert } = useContext( UiContext );

    const { control, register, reset, handleSubmit, trigger, setValue, getValues, formState: { errors } }  = useForm<FormData>({
        defaultValues: {
            mes: new Date(), anhio: new Date()
        }
    });

    const [showPrint, setShowPrint] = useState(false);
    const [dataDownloader, setDataDownloader] = useState<any>();
    const [periodo, setPeriodo] = useState("")

    const onSubmitReporte = async ( { mes,  anhio } : FormData) => {

        if(mes && anhio){

            const monthParse = (mes.getMonth() + 1).toString()
            const yearParse = anhio.getFullYear().toString()
            setPeriodo(monthParse + "-" + yearParse)
            
            const { hasError, message, data} = await ReporteDeclaracionMensual(monthParse, yearParse);
            if(!hasError && data.length > 0 ){
                const reporte = { paramFechaInicio: data }
                // @ts-ignore 
                setData(reporte)
                // @ts-ignore 
                setFilename(`REPORTE_VENTAS_TURNOS_${periodo}`)
                setDataDownloader(reporte)
                setShowPrint(true)
            }else{
                setShowPrint(false)
            }
        }else{
            showAlert({mensaje: "Seleccione la fecha y/o elija algún turno", severity: 'error', time: 7000})
        }
    }

    return (
        <>
        <form onSubmit={ handleSubmit( onSubmitReporte ) }>
            <Grid container  spacing={2}>
                <Grid item xs={12} sm={12}>
                <Card className='card-diario'>
                            <CardHeader
                                title="Reporte declaracion mensual"
                                subheader="Seleccione el año y mes para obtener el reporte"
                            />                            
                            <CardContent> 
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="anhio"
                                            control={ control }
                                            render={
                                                ({ field }) =>(
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <YearCalendar 
                                                    onChange={(date) => field.onChange(date)}
                                                />
                                                </LocalizationProvider>
                                                )}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="mes"
                                            control={ control }
                                            render={
                                                ({ field }) =>(
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <MonthCalendar
                                                    onChange={(date) => field.onChange(date)}
                                                />
                                                </LocalizationProvider>
                                                )}
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
                                filename={`REPORTE_DECLARACION_${periodo}`}
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
