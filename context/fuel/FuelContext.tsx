import { createContext } from 'react';
import { IFuel, IReceptor } from '@/interfaces';

interface ContextProps {
    isLoaded: boolean;
    // Orders
    //fuel: IFuel;
    codigoHash?: string;
    codigoQr?: string;
    numeroComprobante?: string;
    createOrder: (tipo: string, receptor: IReceptor, placa: string, id?:number) => Promise<{ hasError: boolean; respuesta: any; }>;
    emptyOrder: any;
    findRuc: (valor: string) => Promise<{ hasError: boolean; receptores: IReceptor[]; }>;
}


export const FuelContext = createContext({} as ContextProps );