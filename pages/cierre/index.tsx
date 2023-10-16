import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { CreditCard, PhoneAndroid } from '@mui/icons-material'
import { FuelLayout } from '@/components/layouts';
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FuelContext } from '@/context';
import PaymentsIcon from '@mui/icons-material/Payments';
import { IUser } from '@/interfaces';
import { CierreDiaDialog } from '@/components/cierre/CierreDiaDialog';
import { ICierreTurno } from '@/interfaces/cierreturno';
import { getDatetimeFormat } from '@/helpers'




const initialUser: IUser = {
    id: 0,
    rol: 'USER_ROLE',
    estado: 0,
    nombre: '',
    usuario: '',
    correo: '',
    img: '',
    EmisorId: 0
}
const initialCierre: ICierreTurno = {
    id: 0,
    total: 0,
    turno: '',
    isla: '',
    efectivo: 0,
    tarjeta: 0,
    estado: 1,
    Usuario: initialUser,
    fecha: new Date('2023-01-01'),
    yape: 0
}

const CierrePage: NextPage = () => {

    // const [value, setValue] = useState<Dayjs | null>(dayjs(new Date()));

    const { obtenerCierres } = useContext( FuelContext );

    const [cierres, setCierres] = useState([initialCierre])

    const { data: session, status } = useSession()
    
    useEffect(() => {
        const callAPI = async () => {    
            const data = await obtenerCierres();
            setCierres(data.cierres);
        }
        callAPI()        
    }, [obtenerCierres])

    return(
    <>
        <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
        <Typography variant='h1' component = 'h1'>Cierre de día</Typography>

            <Grid container  spacing={2} sx={{ marginTop: 2 }}>

                {/* <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />
                    </LocalizationProvider>  
                </Grid> */}
                <Grid item xs={12} sm={12}>
                    {
                        cierres.length > 0?<>
                            <CierreDiaDialog idUser={session?+session.user.id:0} cierreTurnos={ cierres }/>        
                            <Divider sx={{mt: 2, mb: 2}}/>
                            <Typography variant='h2' sx={{mb: 2}}>Información de cierre</Typography>
                            <Grid container spacing={1}>
                                {
                                    cierres.map( cierre => (
                                        <Card className='summary-card' sx={{ maxWidth: 600 , margin:1 }} key={cierre.id}>
                                            <CardContent>
                                            {/* <Typography fontWeight={400}>Isla: { cierre.isla } - Turno: { cierre.turno } - Galones: { cierre.total.toFixed(2) } - Efectivo: { cierre.efectivo.toFixed(2) } - Tarjeta: { cierre.tarjeta.toFixed(2) } </Typography> */}
                                            <Typography component="div" sx={{ fontWeight: 'bold' }}> { cierre.Usuario.nombre } </Typography>
                                                <Grid container>
                                                    <Grid item xs={4} >
                                                        <Typography>{ getDatetimeFormat(cierre.fecha) }</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} >
                                                        <Typography>{ cierre.isla }/{ cierre.turno }</Typography>
                                                    </Grid>
                                                    <Grid item xs={4} >
                                                        <Typography sx={{ fontWeight: 'bold' }}>TOTAL: S/ { cierre.total.toFixed(1) }</Typography>
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
                                    ) )
                                }
                            </Grid>                         
                        </>
                        :<></>
                    }
                           

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
  
  
  export default CierrePage
  
