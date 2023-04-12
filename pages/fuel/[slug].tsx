import NextLink from 'next/link'
import { FuelLayout } from '@/components/layouts'
import { Box, Button, Card, CardContent, Divider, Grid, Link, TextField, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { OrderSumary } from '@/components/cart'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useFuel } from '@/hooks/useFuel'
import { IFuel } from "@/interfaces";
import { FullScreenLoading } from '@/components/ui'
import { FuelContext } from '@/context'
import { Br, Cut, Line, Printer, Text, Row, render } from 'react-thermal-printer';


const InvoicePage:NextPage = async () => {

    //const router = useRouter();
    //const { fuel, isLoading, isError } = useFuel(`/${ router.query.slug }`,{ refreshInterval: 0});
    /*
    const { createOrder } = useContext(FuelContext)


    const onCreateInvoice = () => {
        createOrder();
    }
    */
    await render(
        <Printer type="epson">
          <Text>Hello World</Text>
        </Printer>
      );

    return(
        <h1>Cargando</h1>
    )



    // return (
    //     <FuelLayout title='Resumen de compra' pageDescription={'Resumen de la compra'}>
    //         <Typography variant='h1' component='h1'>Detalle de la orden</Typography>
    //         {
    //             isLoading
    //             ? <FullScreenLoading/>
    //             :
    //             <>
    //                 <Grid container  spacing={2}>
    //                     <Grid item xs={12} sm={7}>
    //                         <Card className='sumary-card'>
    //                             <CardContent>
    //                                 <Typography variant='h2'>Datos del cliente</Typography>
                                    
    //                                 <Divider sx={{mt: 2}}/>

    //                                 <Grid container spacing={2} sx={{ mt: 1}}>
    //                                     <Grid item xs={12} sm={6}>
    //                                         <TextField label='Numero documento' variant='filled' fullWidth></TextField>
    //                                     </Grid>
    //                                     <Grid item xs={12} sm={6}>
    //                                         <TextField label='Razón social' variant='filled' fullWidth></TextField>
    //                                     </Grid>
    //                                     <Grid item xs={12} sm={6}>
    //                                         <TextField label='Direccion' variant='filled' fullWidth></TextField>
    //                                     </Grid>
    //                                     <Grid item xs={12} sm={6}>
    //                                         <TextField label='Placa del vehículo' variant='filled' fullWidth></TextField>
    //                                     </Grid>                                
    //                                 </Grid>   

    //                             </CardContent>
    //                         </Card>                   
    //                     </Grid>
    //                     <Grid item xs={12} sm={5}>
    //                         <Card className='sumary-card'>
    //                             <CardContent>
    //                                 <Typography variant='h2'>Resumen</Typography>
            
    //                                 <Divider sx={{mt: 2, mb: 2}}/>
            
    //                                 <OrderSumary fuel={fuel}/>
    //                             </CardContent>
    //                         </Card>
    //                     </Grid>
    //                 </Grid>
    //                 <Box sx={{ mt: 3}}>
    //                     <Button 
    //                         color='secondary' 
    //                         className='circular-btn' 
    //                         fullWidth 
    //                         onClick={ onCreateInvoice }
    //                     >
    //                         Confirmar orden
    //                     </Button>
    //                 </Box>                  
    //             </>
    //         }
          
    //     </FuelLayout>
    //   )
}

export default InvoicePage