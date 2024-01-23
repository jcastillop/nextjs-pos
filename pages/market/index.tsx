import { GetServerSideProps, NextPage } from 'next'
import { Typography } from '@mui/material';

import { FullScreenLoading } from '@/components/ui';
import { FuelLayout } from '@/components/layouts';

import { getSession, useSession  } from 'next-auth/react';
import { useProductos, useProductosTipo } from '@/hooks';
import { ProductList } from '@/components/products';

const MarketPage: NextPage = () => {

  const { data: session, status } = useSession()

  const tipo = session?.user.rol?session?.user.rol:"USER_ROLE"

  const { productos, isLoadingProduct, hasErrorProduct } = useProductosTipo(tipo, { refreshInterval: 0});

  return (
    <>
        <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
             <Typography variant='h6' sx={{ mb:1 }}>{session?.user.grifo} - {session?.user.isla} - {session?.user.usuario} - {session?.user.jornada}</Typography>
            {
                isLoadingProduct
                ? <FullScreenLoading/>
                : <ProductList products={productos}/>
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

export default MarketPage;
