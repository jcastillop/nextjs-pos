import { IFuel, IKeyValue } from "@/interfaces";
import useSWR, { SWRConfiguration } from "swr"

// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json())

export const useFuel = ( url: string, config: SWRConfiguration = {} ) => {

    // const { data, error, isLoading } = useSWR<Props>(`http://localhost:8000/api${ url }`, fetcher, config);
    const { data, error, isLoading } = useSWR<IFuel>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/abastecimientos${ url }`, config);

    let arrTiposCombustible:IKeyValue = {};
    let arrStylesCombustible:IKeyValue = {};

    if(process.env.NEXT_PUBLIC_COD_COMBUSTIBLE && process.env.NEXT_PUBLIC_DESC_COMBUSTIBLE && process.env.NEXT_PUBLIC_STYLE_COMBUSTIBLE){
        //console.log("entro")
        const LIST_COD = JSON.parse(process.env.NEXT_PUBLIC_COD_COMBUSTIBLE)
        const LIST_DES = JSON.parse(process.env.NEXT_PUBLIC_DESC_COMBUSTIBLE)
        const LIST_STYLE = JSON.parse(process.env.NEXT_PUBLIC_STYLE_COMBUSTIBLE)
        var i:number = 0;
        for (let i = 0; i < LIST_COD.length; i++) {
            arrTiposCombustible[LIST_COD[i]] = LIST_DES[i]; 
            arrStylesCombustible[LIST_COD[i]] = LIST_STYLE[i]; 
        }
    }
    if(data){
        data.descripcionCombustible = arrTiposCombustible[data.codigoCombustible],
        data.styleCombustible= arrStylesCombustible[data.codigoCombustible]
    }
    return{
        fuel: data,
        isLoading,
        isError:error
    }

}