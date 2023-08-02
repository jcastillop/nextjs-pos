export interface IUser {
    id: number;
    nombre: string;
    usuario: string;
    correo: string;
    password?: string;
    img: string;
    rol: 'USER_ROLE'|'ADMIN_ROLE'|'SUPERV_ROLE'
    estado: number;
    EmisorId: number;
}
