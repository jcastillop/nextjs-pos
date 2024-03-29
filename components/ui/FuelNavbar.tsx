import NextLink from "next/link";
import { AppBar, Badge, Box, Button, IconButton, Link, Toolbar, Typography } from "@mui/material";
import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useContext } from "react";
import { FuelContext, UiContext } from "@/context";
import { useSession  } from 'next-auth/react';

export const FuelNavbar = () => {

  const { asPath } = useRouter();
  const { toggleSideMenu } = useContext( UiContext );
  const { numberOfItems } = useContext( FuelContext );
  const { data: session, status } = useSession()

  return (
    <AppBar>
        <Toolbar>

            <NextLink href='/' passHref legacyBehavior>
                <Link display={"flex"} alignItems='center'>
                    <Typography variant="h6">FuelHub |</Typography>
                    <Typography sx={{ ml:0.5 }}>Estación de servicio</Typography>
                </Link>
            </NextLink>

            <Box flex={1}/>

            <Box sx={{ display: { xs:'none', sm:'block' } }}>
              {
                session?.user.rol == 'USER_ROLE' && <NextLink href={'/'} passHref legacyBehavior>
                <Link >
                  <Button color={ asPath === '/'?'primary':'info' }>Despacho</Button>
                </Link>
              </NextLink>
              }
              <NextLink href={'/historico'} passHref legacyBehavior>
                <Link>
                  <Button color={ asPath === '/historico'?'primary':'info' }>Histórico</Button>
                </Link>
              </NextLink>
              <NextLink href={'/market'} passHref legacyBehavior>
                <Link>
                  <Button color={ asPath === '/market'?'primary':'info' }>Market</Button>
                </Link>
              </NextLink>              
            </Box>
            
            <Box flex={1}/>
            
            <Box>
              <NextLink href='/' passHref legacyBehavior>
                <Link display={"flex"} alignItems='center'>
                  {/* <UseDate /> */}
                </Link>
              </NextLink>
            </Box>

            <Box>
              <NextLink href="/cart" passHref legacyBehavior>
                <Link>
                    <IconButton>
                        <Badge badgeContent={ numberOfItems > 9 ? '+9': numberOfItems  } color="secondary">
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Link>
              </NextLink>
            </Box>

{/* 
            <IconButton>
              <SearchOutlined/>
            </IconButton>

            <NextLink href={'/cart'} passHref legacyBehavior>
              <Link>
                <IconButton>
                  <Badge badgeContent={2} color={"secondary"}>
                    <ShoppingCartOutlined/>
                  </Badge>
                </IconButton>
              </Link>
            </NextLink>    */}

            <Button onClick={ toggleSideMenu }>
              Menu
            </Button>

        </Toolbar>
    </AppBar>
  )
}
