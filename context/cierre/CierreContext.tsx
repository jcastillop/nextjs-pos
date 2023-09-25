
import { createContext } from 'react';
import { IComprobante } from '@/interfaces/comprobante';
import { ICierreTurnoHistorico } from '@/interfaces';

interface ContextProps {
    isLoaded: boolean;
    despachos: IComprobante[];
    numberOfItems: number;
    total: number;
    idUsuario: number;

    createCierre: (id: number, fecha : Date) => Promise<{ hasError: boolean, cierre?: ICierreTurnoHistorico, cantidad: number, message: string }>;
}


export const CierreContext = createContext({} as ContextProps );