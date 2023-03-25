import NextLink from 'next/link'
import { CartList, OrderSumary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import React from 'react'
import { CreditCardOffOutlined } from '@mui/icons-material'

const OrderPage = () => {
  return (
    <ShopLayout title='Resumen de la orden 123' pageDescription={'Resumen de la orden'}>
        <Typography variant='h1' component='h1'>Orden: 123</Typography>

        {/* <Chip 
            sx={{ my: 2}}
            label="Pendiente de pago"
            variant='outlined'
            color='error'
            icon={<CreditCardOffOutlined/>}
        /> */}
        <Chip 
            sx={{ my: 2}}
            label="Orden pagada"
            variant='outlined'
            color='success'
            icon={<CreditCardOffOutlined/>}
        />
        <Grid container>
            <Grid item xs={12} sm={7}>
                <CartList editable={false}/>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='sumary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen (3 productos)</Typography>
                        <Divider sx={{my:1}}/>
                        
                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'> Direccion de entrega</Typography> 
                            <NextLink href='/checkout/address' legacyBehavior>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <Typography> Jorge Castillo</Typography>
                        <Typography> 123 algun lugar</Typography>
                        <Typography> los olivos</Typography>
                        <Typography> Canada</Typography>
                        <Typography> +1 2323232</Typography>

                        <Divider sx={{mt: 3}}/>

                        <Box display='flex' justifyContent='end'>
                            <NextLink href='/cart' legacyBehavior>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <OrderSumary/>
                        <Box sx={{ mt: 3}}>
                          {/*  */}
                          <h1>Pagar</h1>

                          <Chip 
                                sx={{ my: 2}}
                                label="Orden pagada"
                                variant='outlined'
                                color='success'
                                icon={<CreditCardOffOutlined/>}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default OrderPage