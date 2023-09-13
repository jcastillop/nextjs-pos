import React, { useContext, useEffect, useState } from 'react'
import { signIn, getSession, getProviders } from 'next-auth/react';
import { AuthLayout } from '@/components/layouts'
import { Box, Button, Chip, Grid,Link,MenuItem,TextField,ToggleButton,ToggleButtonGroup,Typography } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ErrorOutline } from '@mui/icons-material'
import { GetServerSideProps } from 'next';
import router from 'next/router';
import { UiContext } from '@/context';
import { useValidaIp } from '@/hooks';


type FormData = {
    user: string,
    password: string,
    turno: string
};


const LoginPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ showError, setShowError ] = useState(false);
    const [providers, setProviders] = useState<any>({});
    const { showAlert } = useContext( UiContext );
    //const callbackUrl = (router.query?.callbackUrl as string) ?? "/";    
    const { isla, hasError, terminal, message } = useValidaIp();

    useEffect(() => {
        getProviders().then( prov => {
          setProviders(prov)
        })
      }, [])    

    const onSubmit  = async ({ user, password, turno }: FormData) =>{
        setShowError(false);
        const result = await signIn('credentials',{ user, password, turno, isla, terminal, redirect: false });
        if (result?.error) {
            showAlert({mensaje: result?.error, severity: 'error', time: 7000})
          } else {
            router.push("/");
          }
      }

    return (
        <AuthLayout title={'Ingresar'}>
            <form  onSubmit={ handleSubmit(onSubmit) } noValidate>
            <Box sx={{width:350, padding:'50% 20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>FUEL-HUB</Typography>
                        <Chip 
                            label= { hasError? message : `${terminal} - ${isla}`}
                            color= { hasError? 'error' :'success' }
                            className="fadeIn"
                        />                         
                        <Chip 
                            label="No reconocemos ese usuario / contraseña"
                            color="error"
                            icon={ <ErrorOutline /> }
                            className="fadeIn"
                            sx={{ display: showError ? 'flex': 'none' }}
                        />                        
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="text"
                            label="Usuario"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }} 
                            fullWidth 
                            { ...register('user', {
                                required: 'Este campo es requerido'
                                
                            })}
                            error={ !!errors.user }
                            helperText={ errors.user?.message }
                        />
                    </Grid>                    
                    <Grid item xs={12}>
                        <TextField 
                            label='Codigo' 
                            type='password' 
                            InputLabelProps={{ shrink: true }} 
                            variant='outlined' 
                            fullWidth 
                            { ...register('password', {
                                required: 'Este campo es requerido',
                                minLength: { value: 4, message: 'Mínimo 4 caracteres' }
                            })}
                            error={ !!errors.password }
                            helperText={ errors.password?.message }                            
                            />
                    </Grid>
                    <Grid item xs={12}
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="center"                   
                    >
                        <TextField
                        select
                        fullWidth
                        label="Select"
                        defaultValue='TURNO1'
                        inputProps={register('turno', {
                            required: 'Please enter currency',
                        })}
                        error={ !!errors.turno }
                        helperText={errors.turno?.message}
                        >
                            <MenuItem value={"TURNO1"}>TURNO1</MenuItem>
                            <MenuItem value={"TURNO2"}>TURNO2</MenuItem>
                            <MenuItem value={"TURNO3"}>TURNO3</MenuItem>
                        </TextField>                      
                    </Grid>
                    <Grid item xs={12}>
                            <Button
                                type="submit"
                                color="secondary"
                                className='circular-btn'
                                size='large'
                                disabled = { hasError }
                                fullWidth>
                                Ingresar
                            </Button>
                        </Grid>                    
                </Grid>
            </Box>
            </form>
        </AuthLayout>
    )
}

export default LoginPage