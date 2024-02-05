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

export const ReporteProductoTurnos = (  fecha: string, config: SWRConfiguration = {}  ) => {
  
    const { data, isLoading, error } = useSWR(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/reporteproductoturnos?fecha=${fecha}`);

    return {
        hasError : false,
        data: data?.data,
        isLoading
    }

}

export const ReporteProductoDias = async (  fecha_inicio: string, fecha_fin: string, config: SWRConfiguration = {}  ) => {
  
    const body = {
        "fecha_inicio": fecha_inicio,
        "fecha_fin": fecha_fin
    }

    const { data } = await posApi.post<IData>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/reportediario`, body);

    return {
        hasError : data.hasError,
        message: data.message,
        data: data.data
    }

}

export const ReporteDeclaracionMensual = async (  month: string, year: string, config: SWRConfiguration = {}  ) => {
  
    const body = {
        "month": month,
        "year": year
    }

    const { data } = await posApi.post<IData>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/reportedeclaracionmensual`, body);

    return {
        hasError : data.hasError,
        message: data.message,
        data: data.data
    }

}

export const ReporteCierresDiarios = (  fecha: string, config: SWRConfiguration = {}  ) => {
  
    const { data, isLoading, error } = useSWR(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/reportecierres?fecha=${fecha}`);

    return {
        hasError : false,
        data: data?.data,
        isLoading
    }

}
