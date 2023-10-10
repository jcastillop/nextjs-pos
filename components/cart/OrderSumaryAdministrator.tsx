import { FuelContext } from "@/context"
import { IComprobanteAdmin, IComprobanteAdminItem } from "@/interfaces"
import cart from "@/pages/invoice"
import { CloseOutlined, ClosedCaptionOutlined } from "@mui/icons-material"
import { Button, Divider, Grid, IconButton, Typography } from "@mui/material"
import { FC, useContext, useEffect } from "react"

interface Props{
    comprobante:  IComprobanteAdmin
}

export const OrderSumaryAdministrator: FC<Props> = ({ comprobante }) => {

    const { removeCartProduct } = useContext(FuelContext)

    console.log(comprobante);

    // const totalize = comprobante?.items.map(item => ({ igv: item.igv, total: item.precio_venta, gravadas: item.valor_venta })).reduce((a, b) => {
    //     return ({
    //         igv: (a.igv || 0) + (b.igv || 0),
    //         total: (a.total || 0) + (b.total || 0),
    //         gravadas: (a.gravadas || 0) + (b.gravadas || 0)
    //     })
    // }, { igv: 0, total: 0, gravadas: 0 })

    return (
        <Grid container>
            {/* <Grid item xs={1}>
                <Typography></Typography>
            </Grid>               */}
            <Grid item xs={5}>
                <Typography variant='subtitle1'>Descripción</Typography>
            </Grid>            
            <Grid item xs={2} display='flex' justifyContent='end'>
                <Typography variant='subtitle1'>Cant</Typography>
            </Grid>        
            <Grid item xs={2} display='flex' justifyContent='end'>
                <Typography variant='subtitle1'>Valor</Typography>
            </Grid>
            <Grid item xs={3} display='flex' justifyContent='end' sx={{mb:2}}>
                <Typography variant='subtitle1'>Importe</Typography>
            </Grid>       
            {/* <IconButton aria-label="toggle password visibility" onClick={() => handleClickMedioPago('tarjeta')}>
                                                                <CreditCard color="secondary"/>
                                                            </IconButton> */}
            {
                comprobante?.items.map( item => (
                    <Grid container key={ item.codigo_producto } alignItems="center" justifyItems="flex-end">
                        {/* <Grid item xs={1} display='flex' alignItems='center' flexDirection='column' sx={{ mt:-2}}>
                            <IconButton aria-label="toggle password visibility" onClick={() => removeCartProduct(item)}>
                                <CloseOutlined color="error"/>
                            </IconButton>
                        </Grid>                            */}
                        <Grid item xs={5} sx={{ mb: 2}}>
                            <Typography variant='subtitle2'>{ item.descripcion }</Typography>
                        </Grid> 
                        <Grid item xs={2} display='flex' justifyContent='end' sx={{ mb: 2}}>
                            <Typography variant='subtitle2'>{ item.cantidad }</Typography>
                        </Grid>
                        <Grid item xs={2} display='flex' justifyContent='end' sx={{ mb: 2}}>
                            <Typography variant='subtitle2'>{ item.valor.toFixed(item.medida=="GAL"?5:2) }</Typography>
                        </Grid>
                        <Grid item xs={3} display='flex' justifyContent='end' sx={{ mb: 2}}>
                            <Typography variant='subtitle2'>{ item.valor_venta.toFixed(item.medida=="GAL"?5:2) }</Typography>
                        </Grid>   
                    </Grid>
                ))
            }
            <Grid item xs={12}>
                <Divider sx={{mt: 2, mb: 2}}/>
            </Grid>
            <Grid item xs={6}>
                <Typography>Op. Gravada</Typography>
            </Grid>  
            <Grid item xs={6} display='flex' justifyContent='end' sx={{ mb: 2}}>
                <Typography>S/ { (comprobante.gravadas || 0).toFixed(2)}</Typography>
            </Grid>        
            <Grid item xs={6}>
                <Typography>IGV (18%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>S/ { (comprobante.igv || 0).toFixed(2) }</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider sx={{mt: 2, mb: 2}}/>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="subtitle1">Total:</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography variant="subtitle1">S/ { (comprobante.total || 0).toFixed(2) }</Typography>
            </Grid>
        </Grid>
    )
}
