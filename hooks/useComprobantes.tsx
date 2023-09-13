import useSWR, { SWRConfiguration } from "swr"
import { IComprobante, IFuel, IKeyValue } from '@/interfaces';

interface Props {
    comprobantes: IComprobante[];
    total: number;
}

export const useHistorico = ( idUsuario: string, config: SWRConfiguration = {} ) => {    

    const { data, error, isLoading } = useSWR<Props>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/historico?idUsuario=${idUsuario}`, config);

    return {
        hasError: error,
        isLoading,
        comprobantes: data?.comprobantes
    }
}