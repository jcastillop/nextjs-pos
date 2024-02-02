import useSWR, { SWRConfiguration } from "swr"
import { IComprobante, IFuel, IKeyValue } from '@/interfaces';
import { posApi } from "@/api";
import { IComprobanteAdmin } from '../interfaces/comprobante';

interface Props {
    comprobantes: IComprobante[];
    total: number;
}

export const useHistorico = ( idUsuario: string, config: SWRConfiguration = {}, offset: string = "0", limit: string = "10"  ) => {    

    const { data, error, isLoading } = useSWR<Props>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/historico?idUsuario=${idUsuario}&offset=${ offset }&limit=${ limit }`, config);

    return {
        hasError: error,
        isLoading,
        comprobantes: data?.comprobantes
    }
}

export const useComprobante = ( id: string, config: SWRConfiguration = {} ) => {

    const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/comprobante?id=${id}`, config);
    return {
        hasErrorComprobante: false,
        comprobante: data?.comprobante,
        isLoading
    }  

}