const constantes = Object.freeze({
    ALERT_DEFAULT_TIMER: 3000, //Valor por defecto para el tiempo de las alertas
    TipoComprobante: {
        Factura:        "01",
        Boleta:         "03",
        NotaCredito:    "07",
        NotaDespacho:   "50",
        Calibracion:    "51"
    },
    CodigoCombustible : {
        DB5S50:         "5",
        GPREMIUM1:      "3",
        GPREMIUM2:      "4",
        GREGULAR:       "2",
        GLP:            "7"
    }
});

export default constantes;
