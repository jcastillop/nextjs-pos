import { FC, useEffect, useReducer } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { FuelContext, fuelReducer } from './';
import { posApi } from '../../api';
import { ICierreTurnoHistorico, IComprobante, IComprobanteAdmin, IComprobanteAdminItem, IFuel, IReceptor, IUser } from '@/interfaces';
import { getSession } from 'next-auth/react';
import { initialReceptor } from '@/database/receptor';
import { initialComprobante } from '@/database/comprobante';


export interface FuelState {
    children?: React.ReactNode;
    isLoaded: boolean;
    cart: IComprobanteAdminItem[];
    receptor: IReceptor;
    comprobante: IComprobante;
}

const CART_INITIAL_STATE: FuelState = {
    isLoaded: false,
    cart: [],
    receptor: initialReceptor,
    comprobante: initialComprobante
}

type Props = { 
    children?: React.ReactNode;
};

interface PropsCierreTurno {
    cierre: ICierreTurnoHistorico;
    cantidad: number;
}

export const FuelProvider:FC<FuelState> = ({ children }: Props) => {

    const [state, dispatch] = useReducer( fuelReducer , CART_INITIAL_STATE );

    // useEffect(() => {
        
    //     const numeroComprobante = state.numeroComprobante;
    //     const orderSummary = {
    //         numeroComprobante
    //     }
    //     dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
    // }, [state.numeroComprobante]);

    useEffect(() => {
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ): []
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts });
        } catch (error) {
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] });
        }
    }, []);    

    const emptyOrder = async() => {
        dispatch({ type: '[Cart] - Fuel complete' });
    }
    const cleanOrder = async() => {
        dispatch({ type: '[Cart] - Fuel complete' });
        dispatch({ type: '[Cart] - Fuel clean' });
    }
    const emptyCart = async() => {
        dispatch({ type: '[Cart] - Cart complete' });
    }

    const createOrder = async(tipo: string, receptor : IReceptor, comentario: string, producto: string, tarjeta: number, efectivo: number, yape: number, tipo_afectado: string, numeracion_afectado: string, fecha_afectado: string, prefijo: string, id?: number): Promise<{ hasError: boolean; respuesta: any; }> => {

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
            "comentario":comentario,
            "tipo_afectado":tipo_afectado,
            "numeracion_afectado":numeracion_afectado,
            "fecha_afectado":fecha_afectado,
            "prefijo": prefijo,
            "yape": yape
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
            
            const comprobante: IComprobante = data.comprobante;

            if(comprobante && comprobante.errors){
                return {
                    hasError: true,
                    respuesta: comprobante.errors
                }                
            }else{
                return {
                    hasError: data.hasError,
                    respuesta: data.respuesta
                }
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

    const createOrderAdministrador = async(comprobanteAdmin: IComprobanteAdmin, receptor: IReceptor, tipo: string, sesionid: number): Promise<{ hasError: boolean; respuesta: any; storage?: any; }> => {
        dispatch({ type: '[Cart] - Fuel processing' });
            comprobanteAdmin.usuarioId = sesionid
            comprobanteAdmin.tipo_comprobante = tipo
            comprobanteAdmin.Receptor = receptor
        try {


            //OBTENIENDO INFO DEL COMPROBANTE
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/comprobanteadmin`, comprobanteAdmin);

            const orderSummary = {
                receptor: data.receptor,
                comprobante: data.comprobante
            }

            await dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
            
            const comprobante: IComprobante = data.comprobante;

            if(comprobante && comprobante.errors){
                return {
                    hasError: true,
                    respuesta: comprobante.errors,
                    storage: data.comprobante
                }                
            }else{
                return {
                    hasError: data.hasError,
                    respuesta: data.respuesta,
                    storage: data.comprobante
                }
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

    const modifyOrder = async(correlativo: string, id_comprobante: string, tipo: string, receptor : IReceptor, comentario: string, producto: string, tarjeta: number, efectivo: number, tipo_afectado: string, numeracion_afectado: string, fecha_afectado: string, prefijo: string, id?: number): Promise<{ hasError: boolean; respuesta: any; }> => {

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
            "comentario":comentario,
            "tipo_afectado":tipo_afectado,
            "numeracion_afectado":numeracion_afectado,
            "fecha_afectado":fecha_afectado,
            "prefijo": prefijo,
            "correlativo": correlativo,
            "id_comprobante": id_comprobante
        }        

        try {
            //OBTENIENDO INFO DEL COMPROBANTE
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/modifica`, body);
            //hasError, receptor, comprobante, respuesta
            const orderSummary = {
                receptor: data.receptor,
                comprobante: data.comprobante
            }

            await dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
            
            const comprobante: IComprobante = data.comprobante;

            if(comprobante.errors){
                return {
                    hasError: true,
                    respuesta: comprobante.errors
                }                
            }else{
                return {
                    hasError: data.hasError,
                    respuesta: data.respuesta
                }
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

    const createCierre = async(id: number, fecha : Date, turno : string, isla : string, efectivo: number, tarjeta: number, yape: number):Promise<{ hasError: boolean, cierre?: ICierreTurnoHistorico, cantidad: number, message: string }> => {

        const body = {
            "session": id,
            "fecha": fecha,
            "turno": turno,
            "isla": isla,
            "efectivo": efectivo,
            "tarjeta": tarjeta,
            "yape": yape
        }    
        try {
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/cerrarturno`, body);

            return {
                hasError: false,
                cierre: data.cierre.cierre,
                cantidad: data.cierre.cantidad,
                message: "Turno cerrado satisfactoriamente"
            }

        } catch (error: any) {
            
            return {
                hasError: true,
                cantidad: 0,
                message: error.toString()
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

    const obtenerCierres = async():Promise<{ total: number; cierres: any; }> => {

        try {
            const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/listarturnos`);

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
    
    // useEffect(() => {
    //     Cookie.set('cart', JSON.stringify( state.cart ));
    //     console.log("guardando en el carro")
    //     const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ): []
    //     console.log(cookieProducts)
    // }, [state.cart]);

    const addProductToCart = ( product: IComprobanteAdminItem ) => {
        console.log("addProductToCart")
        //! Nivel Final
        const productInCart = state.cart.some( p => p.codigo_producto === product.codigo_producto );
        if ( !productInCart ){
            const prod = [...state.cart, product ]
            
            Cookie.set('cart', JSON.stringify( [...state.cart, product ] ));
            return dispatch({ type: '[Cart] - Update products in cart', payload: prod })
        } 

        // Acumular
        const updatedProducts = state.cart.map( p => {
            // Actualizar la cantidad
            p.cantidad += product.cantidad;
            return p;
        });

        Cookie.set('cart', JSON.stringify( updatedProducts ));
        dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts });
    }

    const removeCartProduct = ( product: IComprobanteAdminItem ) => {
        console.log("removeCartProduct")
        const updatedProducts = state.cart.filter( producto => producto.codigo_producto != product.codigo_producto)
        Cookie.set('cart', JSON.stringify( updatedProducts ));
        return dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts })
    }
    const updateCartQuantity = (product: IComprobanteAdminItem) => {
        console.log("updateCartQuantity")
        dispatch({ type: '[Cart] - Change cart quantity', payload: product });
    }

    return (
        <FuelContext.Provider value={{
            ...state,
            // Orders
            createCierre,
            createCierreDia,
            createOrder,
            createOrderAdministrador,
            modifyOrder,
            emptyOrder,
            cleanOrder,
            emptyCart,
            listarHistorico,
            listarUsuarios,
            guardarUsuario,
            reiniciarPassword,
            cambiarPassword,
            validarAdministrador,
            obtenerCierres,
            findRuc,
            addProductToCart,
            removeCartProduct,
            updateCartQuantity
        }}>
            { children }
        </FuelContext.Provider>
    )
};