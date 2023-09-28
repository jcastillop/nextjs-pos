import { posApi } from "@/api";
import { IProduct } from "@/interfaces";
import useSWR, { SWRConfiguration } from "swr"


interface Props {
    productos: IProduct[];
    total: number;
}

export const useProductos = ( config: SWRConfiguration = {} ) => {    

    const { data, error, isLoading } = useSWR<Props>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/productos/`, config);

    return {
        hasError: error,
        isLoading,
        productos: data?.productos
    }
}

export const guardarProducto = async ( producto: IProduct) => {

    try {

        const { data } = await posApi.put(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/productos/`, producto);

        return {
            hasError: data.hasError,
            producto: data.producto,
            message: data.message
        }        

    } catch (error: any) {
        
        return {
            hasError: true,
            producto: null,
            message: error.toString()
        }        
    }

}


export const actualizarProducto = async ( producto: IProduct):Promise<{ hasError: boolean; message: string; producto?: IProduct; }> => {

    try {

        const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/productos/`, producto);

        return {
            hasError: data.hasError,
            producto: data.producto,
            message: data.message
        }        

    } catch (error: any) {
        
        return {
            hasError: true,
            message: error.toString()
        }        
    }

}