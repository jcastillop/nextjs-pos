import NextLink from "next/link";
import { ShopLayout } from '@/components/layouts'
import { RemoveShoppingCartOutlined } from '@mui/icons-material'
import { Box, Link, Typography } from '@mui/material'
import React from 'react'

const emptyPage = () => {
  return (
    <ShopLayout title={'carrito vacio'} pageDescription={'No hay articulos en el carrito de compras'} imageFullUrl={''}>
        <Box 
            display={'flex'} 
            justifyContent='center' 
            alignItems={'center'} 
            height='calc(100vh - 200px)'
            sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        >
            <RemoveShoppingCartOutlined sx={{ fontSize: 100}}/>
            <Box display='flex' flexDirection='column' alignItems='center'>
                <Typography>Su carrito se encuentra vacío</Typography>
                <NextLink href='/' passHref legacyBehavior>
                    <Link typography="h4" color='secondary'>
                        Regresar
                    </Link>
                </NextLink>
            </Box>
        </Box>        
    </ShopLayout>
  )
}

export default emptyPage