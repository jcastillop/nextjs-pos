import { posApi } from "@/api";
import { IGasto } from "@/interfaces";
import useSWR, { SWRConfiguration } from "swr"

interface Props {
    gastos: IGasto[];
    total: number;
}

export const useGastos = ( id: string, config: SWRConfiguration = {} ) => {    

    const { data, error, isLoading } = useSWR<Props>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/gastos/${ id }`, config);

    const gastos = data?.gastos || [];

    return {
        hasErrorGastos: error,
        isLoadingGastos: isLoading,
        gastos: gastos
    }
}

export const guardarGasto = async ( gasto: IGasto):Promise<{ hasError: boolean; message: string; gasto?: IGasto; }> => {

    try {

        const { data } = await posApi.put(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/gastos/`, gasto);

        return {
            hasError: data.hasError,
            gasto: data.gasto,
            message: data.message
        }        

    } catch (error: any) {
        
        return {
            hasError: true,
            message: error.toString()
        }        
    }

}

export const actualizarGasto = async ( gasto: IGasto):Promise<{ hasError: boolean; message: string; gasto?: IGasto; }> => {

    try {

        const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/gastos/`, gasto);

        return {
            hasError: data.hasError,
            gasto: data.gasto,
            message: data.message
        }        

    } catch (error: any) {
        
        return {
            hasError: true,
            message: error.toString()
        }        
    }

}