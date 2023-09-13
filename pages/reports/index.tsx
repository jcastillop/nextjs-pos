import { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { Button, Collapse, Grid, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material";

import { FuelLayout } from "@/components/layouts";
import { Storefront, ExpandLess, ExpandMore, PunchClock, PeopleAlt } from "@mui/icons-material";
import { CalendarIcon } from "@mui/x-date-pickers";
import { useState } from "react";
import { Diario, Turnos } from "@/components/reports";

interface IReporte {
    tipo: 'diario'|'turnos'
}

const PerfilPage: NextPage = () => {

    const [tipoReporte, setTipoReporte] = useState<IReporte>({tipo: 'diario'});

    const [open, setOpen] = useState(true);
    
    const handleClick = () => {
        setOpen(!open);
    };

    const renderSwitch = ({ tipo }: IReporte) => {
        switch(tipo) {
            case 'diario':
                return <>
                    <Diario/>
                </>
            case 'turnos':
                return <>
                    <Turnos/>
                </>
        }
    }


    return(
        <>
            <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
                <Typography variant='h1' component = 'h1' sx={{mb:2}}>Reportes</Typography>

                <Grid container  spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                            Seleccione
                            </ListSubheader>
                        }
                        >
                        <ListItemButton onClick={handleClick}>
                            <ListItemIcon>
                            <Storefront />
                            </ListItemIcon>
                            <ListItemText primary="Ventas" />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                
                            <ListItemButton sx={{ pl: 4 }} onClick={ ()=> {setTipoReporte({ tipo: 'diario'})} }>
                                <ListItemIcon>
                                <CalendarIcon />
                                </ListItemIcon>
                                <ListItemText primary="Diario" />
                            </ListItemButton>

                            <ListItemButton sx={{ pl: 4 }} onClick={ ()=> {setTipoReporte({ tipo: 'turnos'})} }>
                                <ListItemIcon>
                                <PunchClock />
                                </ListItemIcon>
                                <ListItemText primary="Turno" />
                            </ListItemButton>  

                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                <PeopleAlt />
                                </ListItemIcon>
                                <ListItemText primary="Usuario" />
                            </ListItemButton>  
                                                    
                            </List>
                        </Collapse>
                        </List>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        { renderSwitch( tipoReporte ) }
                    </Grid>
                </Grid>


  

            </FuelLayout>             
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query})=>{

    const session = await getSession({ req });
    const { p = '/auth/login'} = query
  
    if(!session){
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }
    return{
        props: {}
    }
  }
  
  
  export default PerfilPage