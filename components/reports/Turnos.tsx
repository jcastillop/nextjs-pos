import React, { useContext, useState } from 'react'

import { Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ReporteProductoTurnos } from '@/hooks/useReportes';
import { getDateFormat } from '@/helpers';
import { GridColDef, DataGrid } from '@mui/x-data-grid';

export const Turnos = () => {

    const [fecha, setFecha] = useState<Date>(new Date());

    const { data, hasError, isLoading } = ReporteProductoTurnos(getDateFormat(fecha));

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'id', width: 100, disableColumnMenu: true },
        { field: 'Turno', headerName: 'Turno', width: 100, disableColumnMenu: true },
        { field: 'Producto', headerName: 'Producto', width: 100, sortable: false },
        { field: 'VolumenVenta', headerName: 'VolumenVenta', width: 100, sortable: false },
        { field: 'VolumenDespacho', headerName: 'VolumenDespacho', width: 100, sortable: false },
        { field: 'VolumenCalibracion', headerName: 'VolumenCalibracion', width: 100, sortable: false },
        { field: 'TotalVenta', headerName: 'TotalVenta', width: 100, sortable: false },
        { field: 'TotalDespacho', headerName: 'TotalDespacho', width: 100, sortable: false },
        { field: 'TotalCalibracion', headerName: 'TotalCalibracion', width: 100, sortable: false }
    ]

    if ( !data ) return (<></>);

    const rows = data.map( (cierre: { Id: any; Turno: any; Producto: any; VolumenVenta: any; VolumenDespacho: any; VolumenCalibracion: any; TotalVenta: any; TotalDespacho: any; TotalCalibracion: any; }) => ({
        id          : cierre.Id,
        Turno          : cierre.Turno,
        Producto          : cierre.Producto,
        VolumenVenta          : cierre.VolumenVenta,
        VolumenDespacho          : cierre.VolumenDespacho,
        VolumenCalibracion          : cierre.VolumenCalibracion,
        TotalVenta          : cierre.TotalVenta,
        TotalDespacho          : cierre.TotalDespacho,
        TotalCalibracion          : cierre.TotalCalibracion,
    }))

    return (
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
}
