import { posApi } from "@/api";
import { IComprobanteAdmin } from "@/interfaces";
import useSWR, { SWRConfiguration } from "swr"

interface Props {
    comprobantes: IComprobanteAdmin[];
    total: number;
}

export const useNotasDespacho = ( id: string, config: SWRConfiguration = {} ) => {    

    const { data, error, isLoading } = useSWR<Props>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/notas/${ id }`, config);

    const comprobantes = data?.comprobantes || [];

    return {
        hasError: error,
        isLoading: isLoading,
        comprobantes: comprobantes
    }
}
