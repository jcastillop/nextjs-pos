import { IFuel } from "@/interfaces"
import { Grid } from "@mui/material"
import { FC } from "react"
import { FuelCard } from "./FuelCard";


interface Props {
    fuels: IFuel[];
}

export const FuelList: FC<Props> = ({ fuels }) => {
  return (
    <Grid container spacing={3}>
        {
            fuels.map( fuel => (
                <FuelCard fuel={fuel} key={fuel.idAbastecimiento}/>
            ) )
        }
    </Grid>
  )
}
