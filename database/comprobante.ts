import { IComprobante } from "@/interfaces/comprobante";

export const initialComprobante: IComprobante = {
    id: 0,
    tipo_comprobante: "",
    fecha_emision: "",
    tipo_moneda: "",
    tipo_operacion: "",
    tipo_nota: "",
    tipo_documento_afectado: "",
    numeracion_documento_afectado: "",
    motivo_documento_afectado: "",
    total_gravadas: "",
    total_igv: "",
    total_venta: "",
    monto_letras: "",
    cadena_para_codigo_qr: "",
    codigo_hash: "",
    pdf_bytes: "",
    url: "",
    errors: "",
    Receptore: {
        id_receptor: 0,
        tipo_documento: 0,
        numero_documento: "",
        razon_social: "",
        direccion: "",
        correo: "",
        placa: ""
    },
    pago_efectivo: 0,
    pago_tarjeta: 0,
    volumen: "",
    dec_combustible: "",
    placa: "",
    billete: 0,
    producto_precio: "",
    codigo_combustible: ""
}