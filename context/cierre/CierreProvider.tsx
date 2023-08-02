import { FC, useReducer } from "react";
import axios from "axios";
import { CierreContext, cierreReducer } from ".";
import { IComprobante } from "@/interfaces";
import { posApi } from "@/api";

export interface CierreState {
    children?: React.ReactNode;
    isLoaded: boolean;
    despachos: IComprobante[];
    numberOfItems: number;
    total: number;
    idUsuario: number;    
}


const CART_INITIAL_STATE: CierreState = {
    isLoaded: false,
    despachos: [],
    numberOfItems: 0,
    total: 0,
    idUsuario: 0,    
}


type Props = { 
    children?: React.ReactNode;
};

export const CierreProvider:FC<CierreState> = ({ children }: Props) => {

    const [state, dispatch] = useReducer( cierreReducer , CART_INITIAL_STATE );

    const createCierre = async(id: number, fecha : Date):Promise<{ hasError: boolean; message: string; }> => {

        const body = {
            "session": id,
            "fecha": fecha
        }    
        try {
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/cerrarturno`, body);

            dispatch({ type: '[Cierre] - Cierre complete' });

            return {
                hasError: false,
                message: data
            }


        } catch (error) {
            
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }
            return {
                hasError: true,
                message : 'Error no controlado, hable con el administrador'
            }
        }

    }    

    return (
        <CierreContext.Provider value={{
            ...state,
            createCierre
        }}>
            { children }
        </CierreContext.Provider>
    )
};