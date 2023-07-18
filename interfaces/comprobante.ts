export interface IComprobante {
    id: number;
    tipo_comprobante: string;
    fecha_emision: string;
    tipo_moneda: string;
    tipo_operacion: string;
    tipo_nota: string;
    tipo_documento_afectado: string;
    numeracion_documento_afectado: string;
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
}
