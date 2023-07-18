import { FC, useReducer } from 'react';
import axios from 'axios';
import { FuelContext, fuelReducer } from './';
import { posApi } from '../../api';
import { IFuel, IReceptor } from '@/interfaces';
import { getSession } from 'next-auth/react';


export interface FuelState {
    children?: React.ReactNode;
    isLoaded: boolean;
}

const CART_INITIAL_STATE: FuelState = {
    isLoaded: false,
}

type Props = { 
    children?: React.ReactNode;
};

export const FuelProvider:FC<FuelState> = ({ children }: Props) => {

    const [state, dispatch] = useReducer( fuelReducer , CART_INITIAL_STATE );

    // useEffect(() => {
        
    //     const numeroComprobante = state.numeroComprobante;
    //     const orderSummary = {
    //         numeroComprobante
    //     }
    //     dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
    // }, [state.numeroComprobante]);

    const emptyOrder = async() => {
        dispatch({ type: '[Cart] - Order complete' });
    }
        
    const createOrder = async(tipo: string, receptor : IReceptor, placa: string, id?: number): Promise<{ hasError: boolean; respuesta: any; }> => {
        
        const session = await getSession();
        
        const body = {
            "id": id,
            "tipo": tipo,
            "tipo_documento": receptor.tipo_documento,
            "numero_documento": receptor.numero_documento,
            "razon_social": receptor.razon_social,
            "direccion": receptor.direccion,
            "correo": receptor.correo,
            "placa": placa,
            "usuario": session?.user.id,
        }        

        try {
            //OBTENIENDO INFO DEL COMPROBANTE
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes`, body);

            const orderSummary = {
                receptor: data.receptor,
                comprobante: data.comprobante
            }

            await dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })

            return {
                hasError: false,
                respuesta: data
            }


        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    respuesta: error.response?.data.message
                }
            }
            return {
                hasError: true,
                respuesta : 'Error no controlado, hable con el administrador ' + error
            }
        }

    }

    const findRuc = async (valor: string): Promise<{ hasError: boolean; receptores?: IReceptor[]; error: any}> => {

        try {
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/receptores`, { "valor": valor });
            return {
                hasError: false,
                receptores : data.receptores,
                error: ''
            }
        } catch (error) {
            return {
                hasError: true,
                error: ''
            }
        }

        


    }

    return (
        <FuelContext.Provider value={{
            ...state,
            // Orders
            createOrder,
            emptyOrder,
            findRuc
        }}>
            { children }
        </FuelContext.Provider>
    )
};