import { IFuel } from "@/interfaces"
import { Button, Grid } from "@mui/material"
import { FC } from "react"
import { FuelCard } from "./FuelCard";






interface Props {
    fuels: IFuel[];
}

export const FuelList: FC<Props> = ({ fuels }) => {


  const print = async (msg: any) => {
     
    //console.log(devices);

  };

  return (
    <Grid container spacing={3}>
        <Button
            color='secondary'
            className='circular-btn'
            fullWidth
            onClick={ print }
            type='button'
        >                           
            Confirmar orden
        </Button>      
        {
            fuels.map( fuel => (
                <FuelCard fuel={fuel} key={fuel.idAbastecimiento}/>
            ) )
        }
    </Grid>
  )
}
