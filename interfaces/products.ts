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
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: ISize[];
    slug: string;
    tags: string[];
    title: string;
    type: IType;
    gender: 'men'|'women'|'kid'|'unisex'
}

export interface IKeyValue {
    [key: string]: string;
 }

export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type IType = 'shirts'|'pants'|'hoodies'|'hats';