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

                <Grid item xs={ 3 } sm={ 3 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Detalle</Typography>
                            <Divider sx={{ my:1 }} />                            
                            <Grid container spacing={2} sx={{ mt: 1}}>
                                <Grid item xs={6} sm={3}>Usuario:</Grid>
                                <Grid item xs={6} sm={3}>{ session?.user.usuario }</Grid>
                                <Grid item xs={6} sm={3}>Nombres:</Grid>
                                <Grid item xs={6} sm={3}>{ session?.user.nombre }</Grid>            

                                <Grid item xs={6} sm={3}>Correo:</Grid>
                                <Grid item xs={6} sm={3}>{ session?.user.correo }</Grid>
                                <Grid item xs={6} sm={3}>Rol:</Grid>
                                <Grid item xs={6} sm={3}>{ session?.user.rol }</Grid>         

                                <Grid item xs={6} sm={3}>Grifo:</Grid>
                                <Grid item xs={6} sm={3}>{ session?.user.grifo }</Grid>
                                <Grid item xs={6} sm={3}>Isla:</Grid>
                                <Grid item xs={6} sm={3}>{ session?.user.isla }</Grid> 

                                <Grid item xs={6} sm={3}>Jornada:</Grid>
                                <Grid item xs={6} sm={3}>{ session?.user.jornada }</Grid>
                                <Grid item xs={6} sm={3}>Cambiar contraseña:</Grid>
                                <Grid item xs={6} sm={3}><ChangePasswordDialog /></Grid>                                                                                                                                                 
                            </Grid>
                        </CardContent>
                    </Card>
                    
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