import React, { useContext, useEffect, useState } from 'react'
import { Typography, Grid, Box, Button } from '@mui/material'

import { FuelLayout } from '@/components/layouts'
import { CartList, OrderSumaryAdministrator } from '@/components'
import { IComprobanteAdmin } from '@/interfaces'
import { FuelContext } from '@/context'
import { useRouter } from 'next/router'

const initialComprobante: IComprobanteAdmin = {
  Receptor: {
      id_receptor: 0,
      tipo_documento: 0,
      numero_documento: '',
      razon_social: '',
      direccion: '',
      correo: '',
      placa: ''
  },
  numeracion: '',
  tipo_comprobante: '',
  numeracion_comprobante: '',
  fecha_emision: '',
  moneda: '',
  tipo_operacion: '',
  tipo_nota: '',
  tipo_documento_afectado: '',
  numeracion_documento_afectado: '',
  fecha_documento_afectado: '',
  motivo_documento_afectado: '',
  gravadas: 0,
  total_igv: 0,
  total_venta: 0,
  monto_letras: '',
  cadena_para_codigo_qr: '',
  codigo_hash: '',
  pdf: '',
  url: '',
  errors: '',
  id_abastecimiento: 0,
  pistola: 0,
  codigo_combustible: '',
  dec_combustible: '',
  volumen: 0,
  fecha_abastecimiento: '',
  tiempo_abastecimiento: 0,
  volumen_tanque: 0,
  comentario: '',
  tarjeta: 0,
  efectivo: 0,
  placa: '',
  billete: 0,
  producto_precio: 0,
  usuarioId: 0,
  ruc: '',
  yape: 0,
  items: []
}

export const CartPage = () => {

  const [comprobante, setComprobante] = useState<IComprobanteAdmin>(initialComprobante)
  const { cart } = useContext( FuelContext )
  const router = useRouter();

  useEffect(() => {
      const totalize = cart?.map(item => ({ igv: item.igv, total: item.precio_venta, gravadas: item.valor_venta })).reduce((a, b) => {
          return ({
              igv: (a.igv || 0) + (b.igv || 0),
              total: (a.total || 0) + (b.total || 0),
              gravadas: (a.gravadas || 0) + (b.gravadas || 0)
          })
      }, { igv: 0, total: 0, gravadas: 0 })
      setComprobante( current => ({
          ...current,
          items: cart,
          gravadas: +(totalize.gravadas.toFixed(2)),
          total_venta: +(totalize.total),
          total_igv:+(totalize.igv)
      }))
  }, [cart])

  const invoiceProduct = () => {
    router.push('/invoice');
}  

  return (
    <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
    <Typography variant='h1' component = 'h1'>Carrito</Typography>
      <Grid container sx={{ mt: 5}}>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList editable />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <OrderSumaryAdministrator comprobante={comprobante} />
            </Grid>
        </Grid> 
        <Box sx={{ mt: 3}}>
                <Button
                    color='secondary'
                    className='circular-btn'
                    fullWidth
                    onClick={ invoiceProduct }
                    type='button'
                >                           
                    Confirmar orden
                </Button>
            </Box>         
  </FuelLayout>
  )
}

export default CartPage
