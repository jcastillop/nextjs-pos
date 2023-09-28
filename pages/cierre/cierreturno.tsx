import { FuelLayout } from '@/components/layouts'
import { getDatetimeFormat, getDatetimeFormatFromString, getTodayDatetime } from '@/helpers'
import { useObtieneCierre } from '@/hooks/useCierres'
import { CreditCard, PhoneAndroid } from '@mui/icons-material'
import { Typography, Grid, Divider, Card, CardContent, List, ListItem, ListItemText, Chip } from '@mui/material'

import { getSession, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import PaymentsIcon from '@mui/icons-material/Payments';
import { CierreTurnoDialog } from '@/components/cierre'
import { FullScreenLoading } from '@/components/ui'
import { GetServerSideProps } from 'next'

export const CierreTurnoPage = () => {

    const { data: session, status } = useSession()

    const { cierres, galonaje, totalproducto, totalsoles, isLoading, error } = useObtieneCierre(session?.user.id || "",{ refreshInterval: 0});

    const [fechaActual, setFechaActual] = useState("")

    useEffect(() => {
        setFechaActual(getTodayDatetime())
      }, [])
    
    return(
        <>
            <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
            <Typography variant='h1' component = 'h1'>Cierre de turno</Typography>
            
                <Grid container  spacing={2} sx={{ marginTop: 2 }}>

                    <Grid item xs={12} sm={6}>
                    <Typography variant="h5" component="div">Histórico</Typography>
                    <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">(últimos 5 cierres)</Typography> 
                        {
                            cierres? cierres.map( cierre => (
                                <Card className='summary-card' sx={{ maxWidth: 600 , margin:1 }} key={ cierre.id }>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs={4} >
                                                <Typography>{ getDatetimeFormat(cierre.fecha) }</Typography>
                                            </Grid>
                                            <Grid item xs={4} >
                                                <Typography>{ cierre.isla }/{ cierre.turno }</Typography>
                                            </Grid>
                                            <Grid item xs={4} >
                                                <Typography sx={{ fontWeight: 'bold' }}>TOTAL: { cierre.total }</Typography>
                                            </Grid>          
                                            <Grid item xs={4} sx={{ display: 'flex',alignItems: 'center',flexWrap: 'wrap' }}>
                                                <PaymentsIcon color='success'/><span> S/ { (cierre.efectivo?cierre.efectivo:0).toFixed(2) }</span>
                                            </Grid>                        
                                            <Grid item xs={4} sx={{ display: 'flex',alignItems: 'center',flexWrap: 'wrap' }}>
                                                <CreditCard color='secondary'/><span> S/ { (cierre.tarjeta?cierre.tarjeta:0).toFixed(2) }</span>
                                            </Grid>
                                            <Grid item xs={4} sx={{ display: 'flex',alignItems: 'center',flexWrap: 'wrap' }}>
                                                <PhoneAndroid color='warning'/><span> S/ { (cierre.yape?cierre.yape:0).toFixed(2) }</span>
                                            </Grid>
                                            </Grid>                             
                                    </CardContent>
                                </Card>                                                                                                                                        
                                )):<></>
                        }
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h5" component="div">Venta del día</Typography>
                        <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">Galones / Soles / Tipo pago - { getDatetimeFormatFromString(session?.user.fecha_registro || "")  } - { fechaActual } </Typography>                                                
                        <Card className='summary-card' sx={{ maxWidth: 600 , margin:1 }}>
                            <CardContent>

                                <Typography component="div" sx={{ fontWeight: 'bold' }}>VENTA GALONES</Typography>
                                <Grid container>
                                    <Grid item xs={6} sx={{ marginTop: 1, marginBottom: 0.5}}><Typography sx={{ fontWeight: 'bold' }}>PRODUCTO</Typography></Grid>
                                    <Grid item xs={2} display='flex' justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>TOTAL</Typography></Grid> 
                                    <Grid item xs={2} display='flex' justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>DESPACHO</Typography></Grid> 
                                    <Grid item xs={2} display='flex' justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>CERAFIN</Typography></Grid> 
                                    {
                                        galonaje? galonaje.map( galones => (
                                                <Grid container key={ galones.producto }>
                                                    <Grid item xs={6} >
                                                        <Typography>{ galones.producto }</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} display='flex' justifyContent='end'>
                                                        <Typography>{ galones.total.toFixed(3) }</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} display='flex' justifyContent='end'>
                                                        <Typography>{ (galones.despacho?galones.despacho:0).toFixed(3) }</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} display='flex' justifyContent='end'>
                                                        <Typography>{ (galones.calibracion?galones.calibracion:0).toFixed(3) }</Typography>
                                                    </Grid>                                                                                                
                                                </Grid>                             
                                        )):<></>
                                    }
                                </Grid>     
                                <Divider sx={{ my:1 }} />                                           
                                <Typography component="div" sx={{ fontWeight: 'bold' }}>VENTA SOLES</Typography>
                                <Grid container>
                                    <Grid item xs={6} sx={{ marginTop: 1, marginBottom: 0.5}}><Typography sx={{ fontWeight: 'bold' }}>PRODUCTO</Typography></Grid>
                                    <Grid item xs={2} display='flex' justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>TOTAL</Typography></Grid> 
                                    <Grid item xs={2} display='flex' justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>DESPACHO</Typography></Grid> 
                                    <Grid item xs={2} display='flex' justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>CERAFIN</Typography></Grid>                                         
                                    {
                                        totalproducto? totalproducto.map( producto => (
                                                <Grid container key={ producto.producto }>
                                                    <Grid item xs={6} >
                                                        <Typography>{ producto.producto }</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} display='flex' justifyContent='end'>
                                                        <Typography>S/ { producto.total.toFixed(2) }</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} display='flex' justifyContent='end'>
                                                        <Typography>S/ { (producto.despacho?producto.despacho:0).toFixed(2) }</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} display='flex' justifyContent='end'>
                                                        <Typography>S/ { (producto.calibracion?producto.calibracion:0).toFixed(2) }</Typography>
                                                    </Grid>                                                   
                                                </Grid>                             
                                        )):<></>
                                    }
                                </Grid>                  
                                <Divider sx={{ my:1 }} />                                           
                                <Typography component="div" sx={{ fontWeight: 'bold' }}>VENTA POR TIPO DE PAGO</Typography>
                                <Grid container>
                                    {
                                        totalsoles?<>
                                            <Grid item xs={6} sx={{ marginTop: 1, marginBottom: 0.5}}><Typography sx={{ fontWeight: 'bold' }}>TIPO</Typography></Grid>
                                            <Grid item xs={6} display='flex' justifyContent='end'><Typography sx={{ fontWeight: 'bold' }}>TOTAL</Typography></Grid>                                     
                                            <Grid item xs={6} ><Typography>EFECTIVO</Typography></Grid>
                                            <Grid item xs={6}  display='flex' justifyContent='end'><Typography>S/ { (totalsoles.efectivo?totalsoles.efectivo:0).toFixed(2) }</Typography></Grid>
                                            <Grid item xs={6} ><Typography>TARJETA</Typography></Grid>
                                            <Grid item xs={6}  display='flex' justifyContent='end'><Typography>S/ { (totalsoles.tarjeta?totalsoles.tarjeta:0).toFixed(2) }</Typography></Grid>
                                            <Grid item xs={6} ><Typography>YAPE</Typography></Grid>
                                            <Grid item xs={6}  display='flex' justifyContent='end'><Typography>S/ { (totalsoles.yape?totalsoles.yape:0).toFixed(2) }</Typography></Grid>                                         
                                        </>:<></>
                                    }
                                </Grid>
                                <Divider sx={{ my:1 }} />  
                                {
                                    galonaje && totalproducto && totalsoles
                                    ? <CierreTurnoDialog totalGalones={ galonaje! } totalProducto={totalproducto!} totales={totalsoles!}/>:<></>
                                }
                                
                                

                            </CardContent>
                        </Card>
                    </Grid>                
                </Grid>
    
            </FuelLayout>
        </>
    
        )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query})=>{

    const session = await getSession({ req });
    const { p = '/auth/login'} = query
  
    if(!session){
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }
    return{
        props: {}
    }
  }
  

export default CierreTurnoPage