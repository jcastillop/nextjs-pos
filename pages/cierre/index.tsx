import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { FuelLayout } from '@/components/layouts';
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FuelContext } from '@/context';
import { formatDateSQL } from '@/helpers/util';
import { IUser } from '@/interfaces';
import { CierreDiaDialog } from '@/components/cierre/CierreDiaDialog';
import { ICierreTurno } from '@/interfaces/cierreturno';




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
    Usuario: initialUser
}

const CierrePage: NextPage = () => {

    const [value, setValue] = useState<Dayjs | null>(dayjs(new Date()));

    const { obtenerCierres } = useContext( FuelContext );

    const [cierres, setCierres] = useState([initialCierre])

    const { data: session, status } = useSession()
    
    useEffect(() => {
        const callAPI = async () => {    
            if(value){
                const data = await obtenerCierres(new Date(formatDateSQL(value.toDate())));
                setCierres(data.cierres);
            }
        }
        callAPI()        
    }, [obtenerCierres, value])

    return(
    <>
        <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
        <Typography variant='h1' component = 'h1'>Histórico de ventas</Typography>
            <Grid container  spacing={2}>
                <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />
                    </LocalizationProvider>  
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant='h2'>Información de cierre</Typography>
                    {
                        cierres.length > 0?<>
                            <CierreDiaDialog idUser={session?+session.user.id:0} cierreTurnos={ cierres }/>
                            <Divider sx={{mt: 2, mb: 2}}/>
                            <Grid container spacing={1}>
                                {
                                    cierres.map( cierre => (
                                        <Card key={cierre.id}>
                                            <CardContent>
                                                <Typography fontWeight={400}>Isla: { cierre.isla } - Turno: { cierre.turno } - Galones: { cierre.total } - Efectivo: { cierre.efectivo } - Tarjeta: { cierre.tarjeta } </Typography>
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
  
