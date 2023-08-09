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
