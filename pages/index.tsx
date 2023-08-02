import { GetServerSideProps, NextPage } from 'next'
import { Typography } from '@mui/material';

import { FullScreenLoading } from '@/components/ui';
import { FuelLayout } from '@/components/layouts';
import { FuelList } from '@/components/fuel/FuelList';

import { getSession, useSession  } from 'next-auth/react';
import { useFuels } from '@/hooks';

const HomePage: NextPage = () => {

  //const { fuels, isLoading, isError } = useFuels('/abastecimientos?pistola=1&offset=0&limit=10&desde=2022-05-21&hasta=2022-05-22',{ refreshInterval: 5})
  const { fuels, isLoading, isError } = useFuels('/abastecimientos',null,null,{ refreshInterval: 3}, '0', '100')
  const { data: session, status } = useSession()

  return (
    <>
        <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
             <Typography variant='h6' sx={{ mb:1 }}>{session?.user.grifo} - {session?.user.isla} - {session?.user.usuario} - {session?.user.jornada}</Typography>
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
