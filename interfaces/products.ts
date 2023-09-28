export interface IFuel {
    idAbastecimiento: number;
    registro: number;
    pistola: number;
    codigoCombustible: number;
    descripcionCombustible?: string;
    styleCombustible?: string;
    valorTotal: number;
    volTotal: number;
    precioUnitario: number;
    tiempo: number;
    fechaHora: number;
    totInicio: number;
    totFinal: number;
}

export interface IProduct {
    id: number;
    nombre: string;
    descripcion: string;
    imagenes?: string[];
    stock: number;
    codigo: string;
    medida: string;
    precio: number;
    valor: number;
    estado: number;
}

export interface IKeyValue {
    [key: string]: string;
 }

export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type IType = 'shirts'|'pants'|'hoodies'|'hats';