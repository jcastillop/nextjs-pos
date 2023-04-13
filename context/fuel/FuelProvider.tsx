import { FC, useEffect, useReducer } from 'react';
import axios from 'axios';
import { FuelContext, fuelReducer } from './';
import { posApi } from '../../api';
import { render, Printer, Text } from 'react-thermal-printer';

declare global {
    interface Navigator {
        serial: any;
    }
}
export interface FuelState {
    children?: React.ReactNode;
    isLoaded: boolean;

}

const CART_INITIAL_STATE: FuelState = {
    isLoaded: false,
}

type Props = { children?: React.ReactNode };

export const FuelProvider:FC<FuelState> = ({ children }: Props) => {

    const [state, dispatch] = useReducer( fuelReducer , CART_INITIAL_STATE );

    const createOrder = async():Promise<{ hasError: boolean; message: string; }> => {

        const body = {
            "id": "13000",
            "tipo": "01",
            "receptor":0,
            "numero_documento": "1042187637",
            "razon_social": "Empresa de Jorge Castillo",
            "direccion": "calle 5 mz m lote 26 los olivos",
            "correo": "jorge.castillo.pe@gmail.com"
        }        

        try {
            console.log("entro a create order de provider")            
            const { data } = await posApi.post('http://192.168.1.16:8000/api/comprobantes', body);

            console.log(data);


            const masdata = await render(
            <Printer type="epson">
                <Text>Hello World</Text>
            </Printer>
            );
            
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });

            const writer = port.writable?.getWriter();
            if (writer != null) {
                await writer.write(masdata);
                writer.releaseLock();
            }

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
                message : 'Error no controlado, hable con el administrador ' + error
            }
        }

    }


    return (
        <FuelContext.Provider value={{
            ...state,
            // Orders
            createOrder,
        }}>
            { children }
        </FuelContext.Provider>
    )
};