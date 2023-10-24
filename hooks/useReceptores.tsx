import { posApi } from "@/api";
import { ICustomer } from "@/interfaces";
import useSWR, { SWRConfiguration } from "swr"


interface Props {
    receptores: ICustomer[];
    total: number;
}

export const useReceptores = ( config: SWRConfiguration = {} ) => {    

    const { data, error, isLoading } = useSWR<Props>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/receptores/`, config);

    const receptores = data?.receptores || [];

    return {
        hasError: error,
        isLoading: isLoading,
        receptores: receptores
    }
}

export const guardarReceptor = async ( receptor: ICustomer):Promise<{ hasError: boolean; message: string; receptor?: ICustomer; }> => {

    try {

        const { data } = await posApi.put(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/receptores/`, receptor);

        return {
            hasError: data.hasError,
            receptor: data.receptor,
            message: data.message
        }        

    } catch (error: any) {
        
        return {
            hasError: true,
            message: error.toString()
        }        
    }

}

export const actualizarReceptor = async ( receptor: ICustomer):Promise<{ hasError: boolean; message: string; receptor?: ICustomer; }> => {

    try {

        const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/receptores/update`, receptor);

        return {
            hasError: data.hasError,
            receptor: data.receptor,
            message: data.message
        }        

    } catch (error: any) {
        
        return {
            hasError: true,
            message: error.toString()
        }        
    }

}