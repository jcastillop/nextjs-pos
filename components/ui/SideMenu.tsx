import React, { useState } from "react";
import { useContext } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Drawer, Grid, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material"
import { CloseOutlined, InsertInvitationOutlined, LoginOutlined, PersonOutlineOutlined, ManageAccountsOutlined, SavingsOutlined } from "@mui/icons-material"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { getSession, signOut, useSession } from 'next-auth/react';
import { FuelContext, UiContext } from "@/context";
import { formatDateSQL, getActualDate } from "@/helpers/util";

export const SideMenu = () => {

    const { data: session, status } = useSession()
    const { isMenuOpen, toggleSideMenu, showAlert } = useContext( UiContext );
    //const { logout } = useContext(  AuthContext );
    const { createCierre } = useContext(FuelContext)

    const [isOpenDialog, setOpenDialog] = useState(false);

    const [isOpenDate, setOpenDate] = useState(false);

    const [value, setValue] = React.useState<Date>(new Date());

    const handleClickOpen = () => {
        setOpenDialog(true);
    };
  
    const handleClose = () => {
        setOpenDialog(false);
    };    

    const logout = () => {
        signOut();
    }
  
    const handleAceptar = async () => {
        const session = await getSession();
        const respuesta = await createCierre(parseInt(session?.user.id?session?.user.id:"0"), new Date(formatDateSQL(value)));
        showAlert(respuesta.hasError? {mensaje: 'Ocurrió un error durante el cierre de turno', severity: 'error'}:{mensaje: 'Turno cerrado satisfactoriamente'})
        setOpenDialog(false);
    };    

    function toggle() {
        setOpenDate((isOpenDate) => !isOpenDate);
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
                    <ListItemText primary={'Salir'} />
                </ListItemButton>                  
                {/* <Divider />
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
                </ListItem> */}

                <Divider />
                {/* <ListSubheader>Aministración</ListSubheader> */}


                {/* <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
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
                */}
                <ListItemButton LinkComponent={Link} href="/perfil">
                    <ListItemIcon>
                        <PersonOutlineOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mi perfil'} />
                </ListItemButton>
                <ListItemButton onClick={ handleClickOpen }>
                    <ListItemIcon>
                        <SavingsOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Cerrar turno'} />
                </ListItemButton>

                {
                    session?.user.rol == "ADMIN_ROLE" && (
                        <>
                            <Divider />
                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItemButton LinkComponent={Link} href="/users">
                                <ListItemIcon>
                                    <ManageAccountsOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItemButton>

                            <ListItemButton>
                                <ListItemIcon>
                                    <InsertInvitationOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Cerrar día'} />
                            </ListItemButton>                            
                        </>
                    )
                }

                <Divider />

                <ListItemButton onClick={ logout }>
                    <ListItemIcon>
                        <LoginOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Cerrar sesión'} />
                </ListItemButton>                          
            </List>
        </Box>
        <Dialog open={isOpenDialog} onClose={handleClose}>
            <DialogTitle>
                <Typography>Cierre de turno</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                Esta cerrando su turno con fecha <Link href="#"  onClick={toggle}>{getActualDate('dd-mm-yyyy')}</Link>. Esta seguro ?
                <Typography variant="subtitle2"  style={{color: 'blue'}}>
                    Usted no podrá revertir esta operación.
                </Typography>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ paddingTop: 2 }}
                >
                {
                    isOpenDate && 
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Editar fecha de cierre"
                        value={value}
                        format="dd-MM-yyyy"
                        onChange={(newValue) => setValue(newValue?newValue:new Date())}
                    />
                  </LocalizationProvider>
                }     
                </Grid>           
                </DialogContentText>




            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}  color="error">Cancelar</Button>
            <Button onClick={handleAceptar} color="success">Aceptar</Button>
            </DialogActions>
        </Dialog>        
    </Drawer>
  )
}