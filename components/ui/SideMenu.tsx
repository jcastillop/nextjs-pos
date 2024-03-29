import React from "react";
import { useContext } from "react";
import { Box, Divider, Drawer, Link, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { CloseOutlined, InsertInvitationOutlined, LoginOutlined, PersonOutlineOutlined, ManageAccountsOutlined, SavingsOutlined, ArticleOutlined, ShoppingCartOutlined, InventoryOutlined, Face2Outlined, CurrencyExchangeOutlined, LocalAtm, Receipt } from "@mui/icons-material"

import { signOut, useSession } from 'next-auth/react';
import { UiContext } from "@/context";


export const SideMenu = () => {

    const { data: session, status } = useSession()
    const { isMenuOpen, toggleSideMenu, showAlert } = useContext( UiContext );

    const logout = () => {
        signOut();
    }
  
  return (
    
    <Drawer
        open={ isMenuOpen }
        anchor='right'
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>
            <List>
                <ListItemButton onClick={ toggleSideMenu }>
                    <ListItemIcon>
                        <CloseOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={''} />
                </ListItemButton>                  
                <Divider />
                <ListItemButton LinkComponent={Link} href="/perfil">
                    <ListItemIcon>
                        <PersonOutlineOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mi perfil'} />
                </ListItemButton>
                <ListItemButton LinkComponent={Link} href="/cierre/cierreturno">
                    <ListItemIcon>
                        <SavingsOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Cerrar turno'} />
                </ListItemButton>
                {
                    session?.user.rol == "USER_ROLE" && (
                        <>
                        <ListItemButton LinkComponent={Link} href="/gastos">
                            <ListItemIcon>
                                <CurrencyExchangeOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Registro de gastos'} />
                        </ListItemButton>  
                        <ListItemButton LinkComponent={Link} href="/depositos">
                            <ListItemIcon>
                                <LocalAtm/>
                            </ListItemIcon>
                            <ListItemText primary={'Depositos parciales'} />
                        </ListItemButton>                          
                        </>
                    )
                }
                <ListItemButton onClick={ logout }>
                    <ListItemIcon>
                        <LoginOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Cerrar sesión'} />
                </ListItemButton>  

                <Divider />

                <ListSubheader>Admin Panel</ListSubheader>
                <ListItemButton LinkComponent={Link} href="/cierre">
                    <ListItemIcon>
                        <InsertInvitationOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Cerrar día'} />
                </ListItemButton>                            
                {
                    session?.user.rol == "ADMIN_ROLE" && (
                        <>
                            <ListItemButton LinkComponent={Link} href="/products">
                                <ListItemIcon>
                                    <InventoryOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Productos'} />
                            </ListItemButton>                         
                            <ListItemButton LinkComponent={Link} href="/reports">
                                <ListItemIcon>
                                    <ArticleOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Reportes'} />
                            </ListItemButton>   
                            <ListItemButton LinkComponent={Link} href="/users">
                                <ListItemIcon>
                                    <ManageAccountsOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItemButton>                                
                            <ListItemButton LinkComponent={Link} href="/cart">
                                <ListItemIcon>
                                    <ShoppingCartOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Vender'} />
                            </ListItemButton> 
                            <ListItemButton LinkComponent={Link} href="/customers">
                                <ListItemIcon>
                                    <Face2Outlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Clientes'} />
                            </ListItemButton>        
                            <ListItemButton LinkComponent={Link} href="/notas">
                                <ListItemIcon>
                                    <Receipt/>
                                </ListItemIcon>
                                <ListItemText primary={'Notas de despacho'} />
                            </ListItemButton>                                                                                                      
                        </>
                        
                    )
                }                                        
            </List>
        </Box>       
    </Drawer>
  )
}