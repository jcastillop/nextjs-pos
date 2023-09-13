import { posApi } from '@/api';
import { UiContext } from '@/context';
import { IComprobante, IFuel, IKeyValue } from '@/interfaces';
import { useContext } from 'react';
import useSWR, { SWRConfiguration } from "swr"

interface IData {
    hasError: boolean;
    message: string;
    data: any;
}

export const ReporteProductoTurnos = async (  fecha: string, turnos: string, config: SWRConfiguration = {}  ) => {
  
    const body = {
        "fecha": fecha,
        "turnos": turnos
    }

    const { data } = await posApi.post<IData>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/reporteproductoturnos`, body);

    return {
        hasError : data.hasError,
        message: data.message,
        data: data.data
    }

}

export const ReporteProductoDias = async (  fecha_inicio: string, fecha_fin: string, config: SWRConfiguration = {}  ) => {
  
    const body = {
        "fecha_inicio": fecha_inicio,
        "fecha_fin": fecha_fin
    }

    const { data } = await posApi.post<IData>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/reporteproducto`, body);

    console.log(data)

    return {
        hasError : data.hasError,
        message: data.message,
        data: data.data
    }

}