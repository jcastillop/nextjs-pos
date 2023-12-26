import { IDeposito } from "./deposito";
import { IGasto } from "./gasto";
import { IUser } from "./user";

export interface ICierreTurno {
    id: number;
    fecha: Date;
    total: number;
    turno: string;
    isla: string;
    efectivo: number;
    tarjeta: number;
    yape: number;
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
    total_galones: number;
    despacho_galones: number;
    calibracion_galones: number;
    total_soles: number;
    despacho_soles: number;
    calibracion_soles: number;    
}

export interface ICierreTurnoTotalesPrint {
    efectivo: number;
    tarjeta: number;
    yape: number;
}
export interface ICierreTurnoGastos {
    gastos: IGasto[];
    total: number;
}
export interface ICierreTurnoDepositos {
    depositos: IDeposito[];
    total: number;
}