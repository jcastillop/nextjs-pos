import React, { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { formatDateUS } from '@/helpers/util';
import { ReporteProductoTurnos, ReporteProductoTurnosExcel } from '@/hooks/useReportes';
import { useExcelDownloder } from 'react-xls';
import { UiContext } from '@/context';
import { BorderAll, Padding } from '@mui/icons-material';


type FormData = {
    fechaInicio: Date | null;
    turno: string[];
}

const turnosList = [
    "TURNO1",
    "TURNO2",
    "TURNO3"
]

export const TurnosExcel = () => {

    const { ExcelDownloder, Type, setData, setFilename } = useExcelDownloder();
    const { showAlert } = useContext( UiContext );

    const { control, register, reset, handleSubmit, trigger, setValue, getValues, formState: { errors } }  = useForm<FormData>({
        defaultValues: {
            fechaInicio: new Date(), turno: []
        }
    });

    const [showPrint, setShowPrint] = useState(false);
    const [dataDownloader, setDataDownloader] = useState<any>();

    const onSubmitReporte = async ( { fechaInicio, turno } : FormData) => {

        if(fechaInicio && turno.length > 0){
            const paramFechaInicio: string = formatDateUS(fechaInicio || new Date());
            const { hasError, message, data} = await ReporteProductoTurnosExcel(paramFechaInicio, turno.toString());
            if(!hasError && data.length > 0 ){
                const reporte = { paramFechaInicio: data }
                // @ts-ignore 
                setData(reporte)
                // @ts-ignore 
                setFilename(`REPORTE_VENTAS_TURNOS_${paramFechaInicio}`)
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
                                title="Reporte totalizado de turnos"
                                subheader="Seleccione los turnos y la fecha para obtener el reporte"
                            />                            
                            <CardContent> 
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                    <FormGroup>
                                        {
                                            turnosList.map( turno =>(
                                                <Grid item xs={4} key={ turno }>
                                                <FormControlLabel
                                                  value={turno}
                                                  control={<Checkbox />}
                                                  label={turno}
                                                  { ...register('turno')}
                                                />
                                              </Grid>                                                
                                            ))
                                        }
                                    </FormGroup>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="fechaInicio"
                                            control={ control }
                                            render={
                                                ({ field }) =>(
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Fecha"
                                                    format="yyyy-MM-dd"
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
                                filename={`REPORTE_VENTAS_TURNOS_${formatDateUS(getValues("fechaInicio") || new Date())}`}
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