import { IReceptor } from "./receptor";

export interface IComprobante {
    Receptore: IReceptor;
    id: number;
    tipo_comprobante: string;
    fecha_emision: string;
    tipo_moneda: string;
    tipo_operacion: string;
    tipo_nota: string;
    tipo_documento_afectado: string;
    numeracion_comprobante: string;
    numeracion_documento_afectado: string;
    pago_efectivo: number;
    pago_tarjeta: number;
    motivo_documento_afectado: string;
    total_gravadas: string;
    total_igv: string;
    total_venta: string;
    monto_letras: string;
    cadena_para_codigo_qr: string;
    codigo_hash: string;
    pdf_bytes: string;
    url: string;
    errors: string;
    volumen: string;
    dec_combustible: string;
    codigo_combustible: string;
    placa: string;
    billete: number;
    producto_precio: string;
    id_abastecimiento: number;
}
