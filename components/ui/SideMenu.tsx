import React from "react";
import { useContext } from "react";
import { AuthContext, UiContext } from "@/context";
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, CloseOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { useRouter } from "next/router";


export const SideMenu = () => {

    const router = useRouter();
    const { isMenuOpen, toggleSideMenu, filterDispensers, setFilterDispensers } = useContext( UiContext );
    const { user, isLoggedIn, logout } = useContext(  AuthContext );

    const handleFormat = (_event: any, newFormats: React.SetStateAction<never[]>) => {
        setFilterDispensers(newFormats);
    };    
  
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
                    <ListItemText primary={'Salir'} />
                </ListItemButton>                  
                <Divider />
                <ListSubheader>Filtro de pistolas</ListSubheader>

                <ListItem>
                    <ToggleButtonGroup
                        value={filterDispensers}
                        onChange={handleFormat}
                        aria-label="text formatting"
                        >
                        <ToggleButton value="1">1</ToggleButton>
                        <ToggleButton value="2">2</ToggleButton>
                        <ToggleButton value="3">3</ToggleButton>
                        <ToggleButton value="4">4</ToggleButton>
                        <ToggleButton value="5">5</ToggleButton>
                    </ToggleButtonGroup>  
                </ListItem>

                <Divider />
                <ListSubheader>Aministración</ListSubheader>

                <ListItem button>
                    <ListItemIcon>
                        <AccountCircleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Perfil'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Hombres'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mujeres'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Niños'} />
                </ListItem>

                <ListItemButton onClick={ logout }>
                    <ListItemIcon>
                        <LoginOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Cerrar sesión'} />
                </ListItemButton>              
            </List>
        </Box>
    </Drawer>
  )
}