import { createContext } from 'react';
import { IFuel, IReceptor } from '@/interfaces';
import { IComprobante } from '@/interfaces/comprobante';

interface ContextProps {
    isLoaded: boolean;
    receptor?: IReceptor;
    comprobante?: IComprobante;
    createOrder: (tipo: string, receptor: IReceptor, placa: string, id?:number) => Promise<{ hasError: boolean; respuesta: any; }>;
    emptyOrder: any;
    findRuc: (valor: string) => Promise<{ hasError: boolean; receptores?: IReceptor[]; error: any; }>;
}


export const FuelContext = createContext({} as ContextProps );