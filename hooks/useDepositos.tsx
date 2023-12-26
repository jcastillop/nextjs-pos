import { posApi } from "@/api";
import { IDeposito, IGasto } from "@/interfaces";
import useSWR, { SWRConfiguration } from "swr"

interface Props {
    depositos: IDeposito[];
    total: number;
}

export const useDepositos = ( id: string, config: SWRConfiguration = {} ) => {    

    const { data, error, isLoading } = useSWR<Props>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/depositos/${ id }`, config);

    const depositos = data?.depositos || [];

    return {
        hasErrorGastos: error,
        isLoadingGastos: isLoading,
        depositos: depositos
    }
}

export const guardarDeposito = async ( deposito: IDeposito):Promise<{ hasError: boolean; message: string; deposito?: IDeposito; }> => {

    try {

        const { data } = await posApi.put(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/depositos/`, deposito);

        return {
            hasError: data.hasError,
            deposito: data.deposito,
            message: data.message
        }        

    } catch (error: any) {
        
        return {
            hasError: true,
            message: error.toString()
        }        
    }

}

export const actualizarDeposito = async ( deposito: IDeposito):Promise<{ hasError: boolean; message: string; deposito?: IDeposito; }> => {

    try {

        const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/depositos/`, deposito);

        return {
            hasError: data.hasError,
            deposito: data.deposito,
            message: data.message
        }        

    } catch (error: any) {
        
        return {
            hasError: true,
            message: error.toString()
        }        
    }

}