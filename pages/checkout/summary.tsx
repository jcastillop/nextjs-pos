import NextLink from 'next/link'
import { CartList } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material'
import React from 'react'

const SumaryPage = () => {
  return (
    <ShopLayout title='Resumen de compra' pageDescription={'Resumen de la compra'}>
        <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

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

                        <Box sx={{ mt: 3}}>
                            <Button color='secondary' className='circular-btn' fullWidth>
                                Confirmar orden
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SumaryPage