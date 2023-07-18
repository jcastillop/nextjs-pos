import { GetServerSideProps, NextPage } from 'next'
import { Card, Grid, Typography, CardActionArea, CardMedia } from '@mui/material';

import { FuelLayout } from '@/components/layouts';
import { FuelList } from '@/components/fuel/FuelList';
import { useFuels } from '@/hooks';
import { FullScreenLoading } from '@/components/ui';
import LoginPage from './auth/login';
import { AuthContext } from '@/context';
import { useContext } from 'react';
import { getSession, useSession  } from 'next-auth/react';

const HomePage: NextPage = () => {

  //const { fuels, isLoading, isError } = useFuels('/abastecimientos?pistola=1&offset=0&limit=10&desde=2022-05-21&hasta=2022-05-22',{ refreshInterval: 5})
  const { fuels, isLoading, isError } = useFuels('/abastecimientos',null,null,{ refreshInterval: 3}, '0', '100')
  const { data: session, status } = useSession()

  return (
    <>
      {/* {
        status === "unauthenticated"?
          <LoginPage/>
        : */}
        <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
             {/* <Typography variant='h1' component = 'h1'>Tienda</Typography> */}
             <Typography variant='h6' sx={{ mb:1 }}>TERMINAL: {session?.user.grifo} - USUARIO: {session?.user.usuario} - ISLA: {session?.user.isla} - JORNADA: {session?.user.jornada}</Typography>
            {
               isLoading
               ? <FullScreenLoading/>
               : <FuelList fuels={fuels}/>
             }
        </FuelLayout>        
       {/* }     */}
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

export default HomePage;
