import { FC, useReducer } from 'react';
import axios from 'axios';
import { FuelContext, fuelReducer } from './';
import { posApi } from '../../api';
import { IComprobante, IFuel, IReceptor, IUser } from '@/interfaces';
import { getSession } from 'next-auth/react';
import { initialReceptor } from '@/database/receptor';
import { initialComprobante } from '@/database/comprobante';


export interface FuelState {
    children?: React.ReactNode;
    isLoaded: boolean;
    receptor: IReceptor;
    comprobante: IComprobante;
}

const CART_INITIAL_STATE: FuelState = {
    isLoaded: false,
    receptor: initialReceptor,
    comprobante: initialComprobante
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
        dispatch({ type: '[Cart] - Fuel complete' });
    }
    const cleanOrder = async() => {
        dispatch({ type: '[Cart] - Fuel complete' });
        dispatch({ type: '[Cart] - Fuel clean' });
    }
        
    const createOrder = async(tipo: string, receptor : IReceptor, comentario: string, producto: string, tarjeta: number, efectivo: number, id?: number): Promise<{ hasError: boolean; respuesta: any; }> => {

        dispatch({ type: '[Cart] - Fuel processing' });
        
        const session = await getSession();
        
        const body = {
            "id": id,
            "tipo": tipo,
            "tipo_documento": receptor.tipo_documento,
            "numero_documento": receptor.numero_documento,
            "razon_social": receptor.razon_social,
            "direccion": receptor.direccion,
            "correo": receptor.correo,
            "placa": receptor.placa,
            "usuario": session?.user.id,
            "producto": producto,
            "tarjeta": tarjeta,
            "efectivo": efectivo,
            "comentario":comentario
        }        

        try {
            //OBTENIENDO INFO DEL COMPROBANTE
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes`, body);
            //hasError, receptor, comprobante, respuesta
            const orderSummary = {
                receptor: data.receptor,
                comprobante: data.comprobante
            }

            await dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
            
            return {
                hasError: data.hasError,
                respuesta: data.respuesta
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

    const createCierre = async(id: number, fecha : Date, turno : string, isla : string, efectivo: number, tarjeta: number):Promise<{ hasError: boolean; message: string; }> => {

        const body = {
            "session": id,
            "fecha": fecha,
            "turno": turno,
            "isla": isla,
            "efectivo": efectivo,
            "tarjeta": tarjeta
        }    
        try {
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/cerrarturno`, body);

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

    const createCierreDia = async(id: number):Promise<{ hasError: boolean; message: string; }> => {

        const body = {
            "session": id
        }    
        try {
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/cerrardia`, body);

            return {
                hasError: false,
                message: data? 'Cierre dia procesado correctamente':'Error durante el proceso de cierre'
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

    const obtenerCierres = async(fecha : Date):Promise<{ total: number; cierres: any; }> => {

        const body = {
            "fecha": fecha
        }    
        try {
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/listarturnos`, body);

            return {
                total: 0,
                cierres: data
            }


        } catch (error) {
            
            return {
                total: 0,
                cierres: error
            }
        }

    }     

    const listarHistorico = async(idUsuario: number):Promise<{ hasError: boolean; comprobantes?: IComprobante[]; }> => {
        try {
            const body = {
                "idUsuario": idUsuario
            }
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/historico`, body);

            return {
                hasError: false,
                comprobantes: data.comprobantes
            }

        } catch (error) {
            return {
                hasError: true
            }
        }

    }

    const listarUsuarios = async():Promise<{ hasError: boolean; usuarios?: IUser[]; }> => {
        try {
            const { data } = await posApi.get(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/usuarios`);

            return {
                hasError: false,
                usuarios: data.usuarios
            }

        } catch (error: any) {
            return {
                hasError: true
            }
        }
    }

    const guardarUsuario = async(usuario: IUser):Promise<{ hasError: boolean; message: string; usuario?: IUser[]; }> => {

        const body = {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "usuario": usuario.usuario,
            "correo": usuario.correo,
            "password": usuario.password,
            "img": usuario.img,
            "rol": usuario.rol,
            "estado": usuario.estado,
            "EmisorId": usuario.EmisorId,
        }

        try {
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/usuarios`, body);

            return {
                hasError: data.hasError,
                message: data.message,
                usuario: data.usuario,
            }

        } catch (error: any) {
            return {
                hasError: true,
                message: error.toString()
            }
        }
    } 
    
    const reiniciarPassword = async(usuario: IUser):Promise<{ hasError: boolean; message: string; }> => {
        const body = {
            "id": usuario.id
        }
        try {
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/usuarios/passreset`, body);

            return {
                hasError: data.hasError,
                message: data.message
            }

        } catch (error: any) {
            return {
                hasError: true,
                message: error.toString()
            }
        }        
    }

    const cambiarPassword = async(id: number, password: string):Promise<{ hasError: boolean; message: string; }> => {

        const body = {
            "id": id,
            "password": password
        }
        try {
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/usuarios/passchange`, body);

            return {
                hasError: false,
                message: data.message
            }

        } catch (error: any) {
            return {
                hasError: true,
                message: error.toString()
            }
        }        
    }    

    const validarAdministrador = async(password: string):Promise<{ hasSuccess: boolean; message: string; }> => {

        const body = {
            "password": password
        }

        try {
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/usuarios/authorize`, body);

            return {
                hasSuccess: data.hasSuccess,
                message: data.message
            }

        } catch (error: any) {
            return {
                hasSuccess: false,
                message: error.toString()
            }
        }        
    }    

    return (
        <FuelContext.Provider value={{
            ...state,
            // Orders
            createCierre,
            createCierreDia,
            createOrder,
            emptyOrder,
            cleanOrder,
            listarHistorico,
            listarUsuarios,
            guardarUsuario,
            reiniciarPassword,
            cambiarPassword,
            validarAdministrador,
            obtenerCierres,
            findRuc
        }}>
            { children }
        </FuelContext.Provider>
    )
};