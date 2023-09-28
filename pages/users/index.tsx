import { FuelLayout } from "@/components/layouts";
import { FuelContext } from "@/context";
import { useContext, useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";

import { Chip, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { getSession } from "next-auth/react";
import { UserDialog } from "@/components/users/UserDialog";
import { IUser } from "@/interfaces";
import { ResetPasswordDialog } from "@/components/users/ResetPasswordDialog";

const UserPage: NextPage = () => {

    const { listarUsuarios } = useContext(FuelContext)

    const [usuarios, setUsuarios] = useState<any[]>()

    useEffect(() => {
        const callAPI = async () => {
          const { hasError, usuarios} = await listarUsuarios();
          setUsuarios(usuarios);      
        }
        callAPI()
      }, [listarUsuarios]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 2 },
        { field: 'nombre', headerName: 'Nombre', width: 300 },
        { field: 'usuario', headerName: 'Usuario', width: 150 },
        { field: 'correo', headerName: 'Correo', width: 350 },
        { field: 'rol', headerName: 'Rol', width: 150 },
        {
            field: 'estado',
            headerName: 'Estado',
      
            renderCell: (params: GridRenderCellParams<String>) => {
                return <Chip variant='filled' label="Activo" color="success" />
            }, width: 150
      
        },        
        { 
            field: 'EmisorId', 
            headerName: 'Contraseña', 
            renderCell: (params: GridRenderCellParams<any>) => {
                const usuario = {
                    id: +params.id,
                    nombre: params.row.nombre.toString(),
                    usuario: params.row.usuario.toString(),
                    correo: params.row.correo.toString(),
                    img: '',
                    rol: params.row.rol.toString(),
                    estado: +params.row.estado,
                    EmisorId: +params.row.EmisorId
                  }                
                return  <ResetPasswordDialog user={ usuario } />
            },
            width: 150 
        },
    ]

    const nuevoUsuario: IUser = {
        id: 0,
        nombre: '',
        usuario: '',
        correo: '',
        img: '',
        rol: 'USER_ROLE',
        estado: 1,
        EmisorId: 1
    }

    if ( !usuarios ) return (<></>);

    const rows = usuarios.map( (usuarios) => ({
        id          : usuarios.id,
        nombre      : usuarios.nombre,
        usuario     : usuarios.usuario,
        correo      : usuarios.correo,
        rol         : usuarios.rol,
        estado      : usuarios.estado,
        EmisorId    : usuarios.EmisorId,
    }));

    return (
        <>
            <FuelLayout title={'Pos - Shop'} pageDescription={'Productos de POS'} imageFullUrl={''}>
                <Typography variant='h1' component = 'h1' sx={{mb:2}}>Mantenimiento de Usuarios</Typography>
                <UserDialog user={ nuevoUsuario } newUser={ true } />
                <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height:700, width: '100%', mt:2}}>
                    <DataGrid 
                        rows={ rows }
                        columns={ columns }
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 }},
                            columns: {
                            columnVisibilityModel: {
                                hash: false,
                                documento: false,
                            }
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                    />
                </Grid>
                </Grid>

            </FuelLayout>        
        </>
        )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query})=>{

    const session = await getSession({ req });
    const { p = '/auth/login'} = query
    const { q = '/'} = query
  
    if(!session){
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }else{
        if(session.user.rol != 'ADMIN_ROLE'){
            return {
                redirect: {
                    destination: q.toString(),
                    permanent: false
                }
            }        
        }
    }

    return{
        props: {}
    }
  }
  
  
  export default UserPage
  