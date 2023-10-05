import { useContext, useEffect, useState } from "react"
import { FuelLayout } from "@/components/layouts"
import { FullScreenLoading, ItemCounter } from "@/components/ui"
import { Constantes } from "@/helpers"
import { useProducto } from "@/hooks"
import { useFuel } from "@/hooks/useFuel"
import { IComprobanteAdminItem, IProduct } from "@/interfaces"
import { Box, Button, Grid, TextField, Typography } from "@mui/material"
import { GetServerSideProps, GetStaticProps, NextPage } from "next"
import { useRouter } from "next/router"
import { FuelContext } from "@/context"

interface Props {
    producto: IProduct
}
  
  
const ProductPage : NextPage = () => {

    const router = useRouter();
    const { addProductToCart } = useContext( FuelContext )
    const { producto, isLoading, hasError } = useProducto(`/${ router.query.slug }`,{ refreshInterval: 0});
    const initialComprobanteItem: IComprobanteAdminItem = {
        cantidad: 0,
        precio: producto?.precio || 0,
        valor: producto?.valor || 0,
        descripcion: producto?.nombre || "",
        codigo_producto: producto?.codigo || "",
        igv: 0,
        valor_venta: 0,
        precio_venta: 0,
        medida : producto?.medida || "",
    }
    const [ product, setProduct ] = useState<IComprobanteAdminItem>(initialComprobanteItem)

    const includeProductToCart = () => {
        addProductToCart(product);
        router.push('/');
      }
    const onUpdateQuantity = ( quantity: number ) => {
        setProduct( currentItem => ({
            ...currentItem,
            cantidad: quantity,
            igv: +(quantity * Constantes.IGV * currentItem.valor).toFixed(2),
            precio_venta: +(quantity * currentItem.precio).toFixed(2),
            valor_venta: +(quantity * currentItem.valor).toFixed(10)
        }))
    }
    const onUpdateTotal = ( total: number ) => {
        const qu:number = +( total/product.precio ).toFixed(3)
        const vv:number = +( total/(1 + Constantes.IGV) ).toFixed(10)
        const ig:number = +( vv * Constantes.IGV ).toFixed(2)
        const vu:number = +( vv / qu ).toFixed(10)
        
        setProduct( currentItem => ({
            ...currentItem,
            precio_venta: total,
            valor_venta: vv,
            cantidad: qu,
            valor:vu,
            igv: ig
        }))
    }    

    return (
        <FuelLayout title={ "12321321" } pageDescription={ "12321321" }>
            {
                isLoading?<FullScreenLoading/>
                :
                <Grid container>
                    <Grid item xs={ 6 } sm={ 6 }>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant='subtitle1' component='h2'>Producto: { product.descripcion }</Typography>
                            <Typography variant='subtitle1' component='h2'>Precio: {`S/ ${product.precio}` }</Typography>
                            {
                                producto.medida == "NIU"?
                                <>
                                    <Typography variant='subtitle1' component='h2'>Cantidad</Typography>
                                    <ItemCounter
                                        currentValue={ product.cantidad }
                                        updatedQuantity={ onUpdateQuantity }
                                        maxValue={ 99 }
                                    />
                                    <Typography variant='subtitle1' component='h2'>{ `Total: S/ ${product.precio}` }</Typography>
                                </>
                                :
                                <>
                                    <Typography variant='subtitle1' component='h2'>Cantidad: { product.cantidad }</Typography>
                                    <TextField 
                                        label='Total' 
                                        variant='standard' 
                                        type='number'
                                        value={ product.precio_venta }
                                        inputProps={{
                                            maxLength: 5,
                                            step: 0.01
                                        }}
                                        fullWidth 
                                        onChange={(e)=>{
                                            onUpdateTotal(+e.target.value);
                                        }}
                                        sx={{mb:2}}
                                    />                                    
                                </>
                            }

                            <Button 
                                color="secondary" 
                                className='circular-btn'
                                onClick={ includeProductToCart }
                            >
                                Agregar al carrito
                            </Button>                        
                            <Box sx={{ mt:3 }}>
                                <Typography variant='subtitle2'>Descripción</Typography>
                                <Typography variant='body2'>{ producto.descripcion }</Typography>
                            </Box>                        
                        </Box>
                    </Grid>    
                </Grid>
            }
            

        </FuelLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    return {
        props: {
        }
      }

}

export default ProductPage