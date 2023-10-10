import { IFuel } from "@/interfaces"
import { Divider, Grid, Typography } from "@mui/material"
import { FC } from "react"

interface Props{
    fuel?: IFuel
}

export const FuelSummary: FC<Props> = ({ fuel }) => {
  return (
    <Grid container>
        <Grid item xs={6}>
            <Typography>Producto</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end' sx={{ mb: 2}}>
            <Typography variant='h5'>{ fuel?.descripcionCombustible }</Typography>
        </Grid>        
        <Grid item xs={6}>
            <Typography>Cantidad</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end' sx={{ mb: 2}}>
            <Typography>{ fuel?.volTotal }</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>Precio</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end' sx={{ mb: 2}}>
            <Typography>{ fuel?.precioUnitario }</Typography>
        </Grid>        
        <Grid item xs={6}>
            <Typography>IGV (18%)</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{ (((fuel?fuel.valorTotal:0)/1.18)*0.18).toFixed(2) }</Typography>
        </Grid>
        <Grid item xs={12}>
            <Divider sx={{mt: 2, mb: 2}}/>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="subtitle1">Total:</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography variant="subtitle1">{ fuel?.valorTotal }</Typography>
        </Grid>
    </Grid>
  )
}
