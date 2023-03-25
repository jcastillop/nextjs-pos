import { NextPage } from 'next'
import { Card, Grid, Typography, CardActionArea, CardMedia } from '@mui/material';

import { FuelLayout } from '@/components/layouts';
import { FuelList } from '@/components/fuel/FuelList';
import { useFuels } from '@/hooks';
import { FullScreenLoading } from '@/components/ui';

const HomePage: NextPage = () => {

  const { fuels, isLoading, isError } = useFuels('/abastecimientos?offset=0&limit=10&desde=2022-05-21&hasta=2022-05-22',{ refreshInterval: 3})

  return (
    <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
      {/* <Typography variant='h1' component = 'h1'>Tienda</Typography> */}
      <Typography variant='h6' sx={{ mb:1 }}>GRIFO:TERMINAL:JORNADA:HORA INICIO</Typography>

      {
        isLoading
        ? <FullScreenLoading/>
        : <FuelList fuels={fuels}/>
      }
      
    </FuelLayout>
  )
}

export default HomePage;
