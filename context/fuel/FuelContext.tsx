import { createContext } from 'react';
import { IComprobante, IReceptor, IUser } from '@/interfaces';
interface ContextProps {
    isLoaded: boolean;
    receptor: IReceptor;
    comprobante: IComprobante;
    createOrder: (tipo: string, receptor: IReceptor, comentario: string, producto: string, tarjeta: number, efectivo: number, tipo_afectado: string, numeracion_afectado: string, fecha_afectado: string, id?:number) => Promise<{ hasError: boolean; respuesta: any; }>;
    emptyOrder: any;
    cleanOrder: any;
    findRuc: (valor: string) => Promise<{ hasError: boolean; receptores?: IReceptor[]; error: any; }>;
    createCierre: (id: number, fecha : Date, turno : string, isla : string, efectivo: number, tarjeta: number) => Promise<{ hasError: boolean; message: string; }>;
    createCierreDia: (id: number) => Promise<{ hasError: boolean; message: string; }>;
    listarHistorico: (idUsuario: number) => Promise<{ hasError: boolean; comprobantes?: IComprobante[] }>;
    listarUsuarios: () => Promise<{ hasError: boolean; usuarios?: IUser[] }>;
    guardarUsuario: (usuario: IUser) => Promise<{ hasError: boolean; message: string; usuario?: IUser[]; }>;
    reiniciarPassword: (usuario: IUser) => Promise<{ hasError: boolean; message: string; }>;
    cambiarPassword: (id: number, password: string) => Promise<{ hasError: boolean; message: string; }>;
    validarAdministrador: (password: string) => Promise<{ hasSuccess: boolean; message: string; }>;
    obtenerCierres: (fecha : Date) => Promise<{ total: number; cierres: any;}>;
}


export const FuelContext = createContext({} as ContextProps );