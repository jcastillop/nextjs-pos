import { IUser } from "./user";

export interface ICierreTurno {
    id: number;
    total: number;
    turno: string;
    isla: string;
    efectivo: number;
    tarjeta: number;
    estado: number;
    Usuario: IUser;
}
export interface ICierreTurnoHistorico {
    id: number;    
    fecha: Date;
    turno: string;
    isla: string;
    efectivo: number;
    tarjeta: number;
    yape: number;
    total: number;
}
export interface ICierreTurnoPrint {
    producto: string;
    total: number;
    despacho?: number;
    calibracion?: number;
}

export interface ICierreTurnoTotalesPrint {
    efectivo: number;
    tarjeta: number;
    yape: number;
}
