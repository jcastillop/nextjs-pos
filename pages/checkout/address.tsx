import { ShopLayout } from '@/components/layouts'
import { Box, Button, FormControl, Grid, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

const AddressPage = () => {
  return (
    <ShopLayout title={'Direccion'} pageDescription={'confirmar direccion del destin'}>
        <Typography variant='h1' component='h1'>Dirección</Typography>

        <Grid container spacing={2} sx={{ mt: 2}}>

            <Grid item xs={12} sm={6}>
                <TextField label='Nombre' variant='filled' fullWidth></TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Apellido' variant='filled' fullWidth></TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Direccion' variant='filled' fullWidth></TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Direccion 2 (opcional)' variant='filled' fullWidth></TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Codigo postal' variant='filled' fullWidth></TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Ciudad' variant='filled' fullWidth></TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <Select
                        variant='filled'
                        label='Pais'
                        value={1}
                    >
                        <MenuItem value={1}>Costa</MenuItem>
                        <MenuItem value={2}>asd</MenuItem>
                        <MenuItem value={3}>asdas</MenuItem>
                    </Select>
                </FormControl>

            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Telefono' variant='filled' fullWidth></TextField>
            </Grid>
        </Grid>

        <Box sx={{ mt: 5}} display='flex' justifyContent='center'>
            <Button color='secondary' className='circular-btn' size='large'>
                Revisar pedido
            </Button>
        </Box>
    </ShopLayout>
  )
}

export default AddressPage