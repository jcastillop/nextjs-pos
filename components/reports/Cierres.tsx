import React, { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { formatDateUS } from '@/helpers/util';
import { ReporteCierresDiarios, ReporteProductoTurnos } from '@/hooks/useReportes';
import { useExcelDownloder } from 'react-xls';
import { UiContext } from '@/context';
import { BorderAll, Padding } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getDateFormat, getTodayDate } from '@/helpers';


type FormData = {
    fechaInicio: Date | null;
}

export const Cierres = () => {

    
    const [fecha, setFecha] = useState<Date>(new Date());

    const { data, hasError, isLoading } = ReporteCierresDiarios(getDateFormat(fecha));

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'id', width: 100, disableColumnMenu: true },
        { field: 'Turno', headerName: 'Turno', width: 100, disableColumnMenu: true },
        { field: 'Isla', headerName: 'Isla', width: 100, sortable: false },
        { field: 'Usuario', headerName: 'Usuario', width: 200, sortable: false },
        { field: 'Hora', headerName: 'Hora', width: 100, sortable: false },
        { field: 'Efectivo', headerName: 'Efectivo', width: 100, sortable: false },
        { field: 'Tarjeta', headerName: 'Tarjeta', width: 100, sortable: false },
        { field: 'Yape', headerName: 'Yape', width: 100, sortable: false },
        { field: 'Total', headerName: 'Total', width: 100, sortable: false }
    ]

    if ( !data ) return (<></>);

    const rows = data.map( (cierre: { Id: any; Turno: any; Isla: any; Usuario: any; Hora: any; Efectivo: any; Tarjeta: any; Yape: any; Total: any; }) => ({
        id          : cierre.Id,
        Turno          : cierre.Turno,
        Isla          : cierre.Isla,
        Usuario          : cierre.Usuario,
        Hora          : cierre.Hora,
        Efectivo          : cierre.Efectivo,
        Tarjeta          : cierre.Tarjeta,
        Yape          : cierre.Yape,
        Total          : cierre.Total,
    }))

    return(
        <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
            label="Editar fecha de cierre"
            value={fecha}
            format="dd-MM-yyyy"
            onChange={(newValue) => setFecha(newValue?newValue:new Date())}
        />
        </LocalizationProvider>        
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:700, width: '100%' }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    initialState={{
                    pagination: { paginationModel: { pageSize: 10 }},
                    sorting:{
                        sortModel: [{ field: 'id', sort: 'desc' }],
                    }
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
            </Grid>
        </Grid>                
        </>
  
    )

    // const [showPrint, setShowPrint] = useState(false);
    // const [dataDownloader, setDataDownloader] = useState<any>();

    // const onSubmitReporte = async ( { fechaInicio } : FormData) => {

    //     if(fechaInicio){
    //         const paramFechaInicio: string = formatDateUS(fechaInicio || new Date());
    //         const { hasError, message, data} = await ReporteCierresDiarios(paramFechaInicio);
    //         if(!hasError && data.length > 0 ){
    //             const reporte = { paramFechaInicio: data }
    //             // @ts-ignore 
    //             setData(reporte)
    //             // @ts-ignore 
    //             setFilename(`REPORTE_CIERRE_DIA_${paramFechaInicio}`)
    //             setDataDownloader(reporte)
    //             setShowPrint(true)
    //         }else{
    //             setShowPrint(false)
    //         }
    //     }else{
    //         showAlert({mensaje: "Seleccione la fecha", severity: 'error', time: 7000})
    //     }
    // }

    // return (
    //     <>
    //         <form onSubmit={ handleSubmit( onSubmitReporte ) }>
    //             <Grid container  spacing={2}>
    //                 <Grid item xs={12} sm={12}>
    //                     <Card className='card-diario'>
    //                         <CardHeader
    //                             title="Reporte cierres diarios"
    //                             subheader="Seleccione la fecha para obtener el reporte"
    //                         />                            
    //                         <CardContent> 
    //                             <Grid container spacing={2}>
    //                                 <Grid item xs={12} sm={6}>
    //                                     <Controller
    //                                         name="fechaInicio"
    //                                         control={ control }
    //                                         render={
    //                                             ({ field }) =>(
    //                                             <LocalizationProvider dateAdapter={AdapterDateFns}>
    //                                             <DatePicker
    //                                                 label="Fecha"
    //                                                 format="yyyy-MM-dd"
    //                                                 onChange={(date) => field.onChange(date)}
    //                                             />
    //                                             </LocalizationProvider>
    //                                             )}
    //                                     /> 
    //                                 </Grid>
    //                             </Grid>                                                              
    //                         </CardContent>
    //                     </Card>                                                           
    //                 </Grid>
    //             </Grid>
    //             <Box sx={{ mt: 3}}>
    //                 <Grid container spacing={2} sx={{ mt: 1}}>
    //                     <Grid item xs={6} sm={6}>
    //                         <Button
    //                         color='secondary'
    //                         className='circular-btn'
    //                         fullWidth
    //                         type='submit'
    //                         >                           
    //                             Generar Reporte
    //                         </Button>                            
    //                     </Grid> 
    //                     <Grid item xs={6} sm={6}>
    //                         {
    //                             showPrint ? <ExcelDownloder
    //                             filename={`REPORTE_CIERRE_DIA_${formatDateUS(getValues("fechaInicio") || new Date())}`}
    //                             data={ dataDownloader }
    //                             type={ Type.Button }
    //                             >                           
    //                                 Descargar
    //                             </ExcelDownloder> : <></>
    //                         }
    //                     </Grid>                         
    //                 </Grid>                  
    //             </Box>                
    //         </form>
    //     </>
    // )
}
