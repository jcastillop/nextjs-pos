import React from "react";
import { useContext } from "react";
import { Box, Divider, Drawer, Link, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { CloseOutlined, InsertInvitationOutlined, LoginOutlined, PersonOutlineOutlined, ManageAccountsOutlined, SavingsOutlined } from "@mui/icons-material"

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
                        <ListItemButton LinkComponent={Link} href="/users">
                            <ListItemIcon>
                                <ManageAccountsOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Usuarios'} />
                        </ListItemButton>
                    )
                }                                        
            </List>
        </Box>       
    </Drawer>
  )
}