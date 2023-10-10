"use client"
import { FC, useContext } from 'react';
import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, TextField, Typography } from '@mui/material';
import { FuelContext } from '@/context';
import { ItemCounter } from '@/components/ui';
import { IComprobanteAdminItem } from '@/interfaces';
import { Constantes } from '@/helpers';



interface Props {
    editable?: boolean;
}

export const CartList: FC<Props> = ({ editable = false }) => {

    const { cart, removeCartProduct, updateCartQuantity } = useContext( FuelContext )

    const onNewCartQuantityValue = (product: IComprobanteAdminItem, newQuantityValue: number) => {
        const vufix:number = product.medida == "GAL"?10:2
        product.cantidad = newQuantityValue;
        product.igv = +(newQuantityValue * product.valor * Constantes.IGV).toFixed(2);
        product.precio_venta = +(newQuantityValue * product.precio).toFixed(2);
        product.valor_venta = +(newQuantityValue * product.valor).toFixed(vufix);  
        updateCartQuantity( product );
    }

    const onUpdateTotal = ( product: IComprobanteAdminItem, total: number ) => {
        const vufix:number = product.medida == "GAL"?10:2
        product.precio_venta = total
        product.cantidad = +( total/product.precio ).toFixed(3)
        product.valor_venta = +( total/(1 + Constantes.IGV) ).toFixed(vufix)
        product.igv = +( product.valor_venta * Constantes.IGV ).toFixed(2)
        product.valor = +( product.valor_venta / product.cantidad ).toFixed(vufix)
        updateCartQuantity( product );
    }       

    return (
        <>
            {
                cart && cart.map( product => (
                    <Grid container spacing={2} key={ product.codigo_producto } sx={{ mb:1 }}>

                        <Grid item xs={8}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant='body1'>{ product.descripcion } {product.medida == "NIU"? `(Unidades)`: `(Total soles)`}</Typography>
                                {
                                    editable 
                                    ? (
                                        product.medida == "NIU"
                                        ? (
                                        <ItemCounter 
                                            currentValue={ product.cantidad }
                                            maxValue={ 99 } 
                                            updatedQuantity={ ( value ) => onNewCartQuantityValue(product, value )}
                                        />
                                        ): (

                                            <TextField 
                                                variant='standard' 
                                                type='number'
                                                value={ product.precio_venta }
                                                inputProps={{
                                                    maxLength: 5,
                                                    step: 0.01
                                                }}
                                                fullWidth 
                                                onChange={(e)=>{
                                                    onUpdateTotal(product, +e.target.value);
                                                }}
                                                sx={{mb:2}}
                                            />                                              
                                        )
                                    )
                                    : (
                                        <Typography variant='h5'>{ product.cantidad } { product.cantidad > 1 ? 'productos':'producto' }</Typography>
                                    )
                                }
                                
                            </Box>
                        </Grid>
                        <Grid item xs={4} display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1'>{ `S/ ${ product.precio }` }</Typography>
                            
                            {
                                editable && (
                                    <Button 
                                        variant='text' 
                                        color='secondary' 
                                        onClick={ () => removeCartProduct( product ) }
                                    >
                                        Remover
                                    </Button>
                                )
                            }
                        </Grid>
                    </Grid>
                ))
            }
        </>
    )
}
