import { FuelLayout } from '@/components/layouts'
import { Typography } from '@mui/material'
import React from 'react'

const HistoricoPage = () => {
  return (
    <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
      <Typography variant='h1' component = 'h1'>Histórico de ventas</Typography>
      <Typography variant='h6' sx={{ mb:1 }}>GRIFO:TERMINAL:JORNADA:HORA INICIO</Typography>
      
    </FuelLayout>
  )
}

export default HistoricoPage