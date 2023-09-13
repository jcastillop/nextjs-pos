import { IFuel } from '@/interfaces';
import NextLink from 'next/link';
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from '@mui/material'
import React, { FC, useMemo, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useSession } from 'next-auth/react';

interface Props{
    fuel? : IFuel;
}

export const FuelCard: FC<Props> = ({ fuel }) => {

  const [isHovered, setIsHovered] = useState(false);
  const { data: session, status } = useSession();

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
        session?.user.rol == 'USER_ROLE'?
          <>
            <NextLink href={`/fuel/${fuel?.idAbastecimiento}`} passHref prefetch={false} legacyBehavior>
            <Link>
              <div style={{
                position:'relative',
              }}>
                <div style={{
                  //height: '156px',
                  height: '165px',
                  width: '230px',
                  backgroundColor:`${fuel?.styleCombustible}`,
                  zIndex:1,
                  position:'absolute',
                  top: '-130px',
                  right: '-130px',
                  borderRadius: '50%',
                  WebkitTransition:'all .5s ease',
                  transition:'all .5s ease'
                }}>
                  <Typography fontWeight={700} style={{color:"#ffff", position:'relative',bottom: '-100px',left: '13px'}}>{ fuel?.descripcionCombustible }</Typography>
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
                }}>S/ { (Math.round((fuel?.valorTotal||0) * 100) / 100).toFixed(2) }</Typography>
                <Typography fontWeight={500}>PU : { fuel?.precioUnitario }</Typography>
                <Typography fontWeight={500}>Galones : { fuel?.volTotal }</Typography>
              </Box>
              </div>
            </Link>
            </NextLink>          
          </>
          :
          <>
            <div style={{
                position:'relative',
              }}>
                <div style={{
                  //height: '156px',
                  height: '165px',
                  width: '230px',
                  backgroundColor:`${fuel?.styleCombustible}`,
                  zIndex:1,
                  position:'absolute',
                  top: '-130px',
                  right: '-130px',
                  borderRadius: '50%',
                  WebkitTransition:'all .5s ease',
                  transition:'all .5s ease'
                }}>
                  <Typography fontWeight={700} style={{color:"#ffff", position:'relative',bottom: '-100px',left: '13px'}}>{ fuel?.descripcionCombustible }</Typography>
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
                }}>S/.{ fuel?.valorTotal }</Typography>
                <Typography fontWeight={500}>PU : { fuel?.precioUnitario }</Typography>
                <Typography fontWeight={500}>Galones : { fuel?.volTotal }</Typography>
              </Box>
            </div>
          </>
      }
    </Card>

  </Grid>
  )
}
