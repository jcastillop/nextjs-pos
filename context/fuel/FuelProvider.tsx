import { FC, useEffect, useReducer } from 'react';
import axios from 'axios';
import { FuelContext, fuelReducer } from './';
import { posApi } from '../../api';
import { IFuel, IReceptor } from '@/interfaces';
import { initialReceptor } from '@/database/receptor';

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
        const body = {
            "id": id,
            "tipo": tipo,
            "tipo_documento": receptor.tipo_documento,
            "numero_documento": receptor.numero_documento,
            "razon_social": receptor.razon_social,
            "direccion": receptor.direccion,
            "correo": receptor.correo,
            "placa": placa,
            "usuario": 1,
        }        

        try {
            //OBTENIENDO INFO DEL COMPROBANTE
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes`, body);

            const orderSummary = {
                numeroComprobante: data.correlativo,
                codigoHash: data.factura.response.codigo_hash,
                codigoQr: data.factura.response.cadena_para_codigo_qr
            }

            dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })

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

    const findRuc = async (valor: string): Promise<{ hasError: boolean; receptores: IReceptor[]; }> => {

        const body = {
            "valor": valor
        }               

        const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/receptores`, body);

        return {
            hasError: true,
            receptores : data.receptores
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