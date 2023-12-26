import { FuelLayout } from '@/components/layouts'
import { getDatetimeFormat, getDatetimeFormatFromString, getDatetimeFormatFromStringLocal, getTodayDatetime } from '@/helpers'
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
    //cambios
    const { data: session, status } = useSession()

    const { cierres, galonaje, totalsoles, gastos, depositos, isLoading, error } = useObtieneCierre(session?.user.id || "",{ refreshInterval: 0});

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
                                                        <Typography>{ galones.total_galones.toFixed(3) }</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} display='flex' justifyContent='end'>
                                                        <Typography>{ (galones.despacho_galones?galones.despacho_galones:0).toFixed(3) }</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} display='flex' justifyContent='end'>
                                                        <Typography>{ (galones.calibracion_galones?galones.calibracion_galones:0).toFixed(3) }</Typography>
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
                                        galonaje? galonaje.map( producto => (
                                                <Grid container key={ producto.producto }>
                                                    <Grid item xs={6} >
                                                        <Typography>{ producto.producto }</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} display='flex' justifyContent='end'>
                                                        <Typography>S/ { (producto.total_soles?producto.total_soles:0).toFixed(2) }</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} display='flex' justifyContent='end'>
                                                        <Typography>S/ { (producto.despacho_soles?producto.despacho_soles:0).toFixed(2) }</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} display='flex' justifyContent='end'>
                                                        <Typography>S/ { (producto.calibracion_soles?producto.calibracion_soles:0).toFixed(2) }</Typography>
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
                                {
                                    gastos && gastos.gastos.length > 0 && (
                                        <>
                                        <Divider sx={{ my:1 }} />                                           
                                        <Typography component="div" sx={{ fontWeight: 'bold' }}>GASTOS</Typography>  
                                        <Grid container>
                                        {
                                                gastos.gastos.map( gasto => (
                                                        <Grid container key={ gasto.id }>
                                                            <Grid item xs={6} >
                                                                <Typography>{ gasto.concepto }</Typography>
                                                            </Grid>
                                                            <Grid item xs={6} display='flex' justifyContent='end'>
                                                                <Typography>S/ { gasto.monto.toFixed(2) }</Typography>
                                                            </Grid>                                          
                                                        </Grid>                             
                                                ))
                                            }                                    
                                        </Grid>                              
                                        </>
                                    )
                                }
                                {
                                    depositos && depositos.depositos.length > 0 && (
                                        <>
                                        <Divider sx={{ my:1 }} />                                           
                                        <Typography component="div" sx={{ fontWeight: 'bold' }}>DEPOSITOS PARCIALES</Typography>  
                                        <Grid container>
                                        {
                                                depositos.depositos.map( deposito => (
                                                        <Grid container key={ deposito.id }>
                                                            <Grid item xs={6} >
                                                                <Typography>{ getDatetimeFormatFromStringLocal(deposito.fecha) }</Typography>
                                                            </Grid>
                                                            <Grid item xs={6} display='flex' justifyContent='end'>
                                                                <Typography>S/ { deposito.monto.toFixed(2) }</Typography>
                                                            </Grid>                                          
                                                        </Grid>                             
                                                ))
                                            }                                    
                                        </Grid>                              
                                        </>
                                    )
                                }                                
                                <Divider sx={{ my:1 }} />  
                                {
                                    galonaje && totalsoles
                                    ? <CierreTurnoDialog totalGalones={ galonaje! } totales={totalsoles!} gastos={gastos?.gastos!} depositos={depositos?.depositos!}/>:<></>
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