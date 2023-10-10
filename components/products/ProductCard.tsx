import { IComprobanteAdminItem, IFuel, IProduct } from '@/interfaces';
import NextLink from 'next/link';
import { useRouter } from "next/router";
import { Box, Button, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from '@mui/material'
import React, { FC, useContext, useMemo, useState } from 'react'
import { FuelContext } from '@/context';

interface Props{
    product? : IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { addProductToCart } = useContext( FuelContext )
  const itemcomprobante: IComprobanteAdminItem = {
    cantidad: 0,
    precio: product?.precio || 0,
    valor: product?.valor || 0,
    igv: 0,
    valor_venta: 0,
    precio_venta: 0,
    descripcion: product?.nombre || "",
    codigo_producto: product?.codigo || "",
    medida: product?.medida || ""
  }  
  const onAddProduct = () => {
    addProductToCart(itemcomprobante);
    router.push('/cart');
}  

  return (
    <Grid item 
      xs={6} 
      sm={3}
      onMouseEnter={ () => setIsHovered(true) }
      onMouseLeave={ () => setIsHovered(false) }
    >     
    <Card style={{
      padding: '30px 20px',

      //boxShadow: 20,
      //backgroundColor: '#121212',
      borderTop:'3px solid #F6F6F6',
      
      //boxShadow: "2px 4px #F6F6F6",
      //borderTop: `2px solid ${fuel?.styleCombustible}`
      //border-top: 3px solid var(--red);
    }}>
      {
            // <NextLink href={`/products/${product?.id}`} passHref prefetch={false} legacyBehavior>
            <Link 
              style={{ cursor: 'pointer' }}
              onClick={ onAddProduct }>
              <div style={{
                position:'relative',
              }}>
                <div style={{
                  //height: '156px',
                  height: '165px',
                  width: '230px',
                  backgroundColor:"#3ecd5e",
                  zIndex:1,
                  position:'absolute',
                  top: '-130px',
                  right: '-130px',
                  borderRadius: '50%',
                  WebkitTransition:'all .5s ease',
                  transition:'all .5s ease'
                }}>                
                <Typography fontWeight={700} style={{color:"#ffff", position:'relative',bottom: '-100px',left: '13px'}}>{ product?.nombre }</Typography>
                </div>
                <Box sx={{mt: 1}} className='fadeIn'>  
                  
                <Typography fontWeight={700} style={{
                  //minHeight:'50px',
                  margin:'0 0 15px',
                  overflow: 'hidden',
                  fontWeight: 'bold',
                  fontSize:'25px',
                  //color:'#fff',
                  zIndex:2,
                  position:'relative'
                }}>{ product?.descripcion }</Typography>
                <Typography fontWeight={500}>Precio : S/ { product?.precio}</Typography>
                <Typography fontWeight={500}>UM : { product?.medida }</Typography>              
              </Box>
              </div>
            </Link>
      }
    </Card>

  </Grid>
  )
}
