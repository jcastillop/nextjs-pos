import { FuelLayout } from "@/components/layouts";
import { ChangePasswordDialog } from "@/components/users/ChangePasswordDialog";
import { IUser } from "@/interfaces";
import { Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";

const PerfilPage: NextPage = () => {

    const { data: session, status } = useSession()
    
    return(
        <>
            <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
                <Typography variant='h1' component = 'h1' sx={{mb:2}}>Mi Perfil</Typography>

                <Grid item xs={ 12 } sm={ 12 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Detalle</Typography>
                            <Divider sx={{ my:1 }} />
                            <Typography>{ session?.user.usuario } </Typography>
                            <Typography>{ session?.user.nombre } </Typography>
                            <Typography>{ session?.user.correo } </Typography>
                            <Typography>{ session?.user.rol } </Typography>
                            <Typography>{ session?.user.grifo } </Typography>
                            <Typography>{ session?.user.isla } </Typography>
                            <Typography>{ session?.user.jornada } </Typography>
                            <Typography> Cambiar contraseña </Typography>
                        </CardContent>
                    </Card>
                    <ChangePasswordDialog />
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
  
  
  export default PerfilPage