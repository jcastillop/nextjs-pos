import { UiContext } from '@/context';
import { IFuel, IKeyValue } from '@/interfaces';
import { useContext } from 'react';
import useSWR, { SWRConfiguration } from "swr"

interface Props {
    total: number;
    abastecimientos: IFuel[];
}

// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json())
// eslint-disable-next-line react-hooks/rules-of-hooks


export const useFuels = ( url: string, desde: string | null, hasta: string | null, config: SWRConfiguration = {}, offset: string = "0", limit: string = "10" ) => {

    // const { data, error, isLoading } = useSWR<Props>(`http://localhost:8000/api${ url }`, fetcher, config);
    const { filterDispensers } = useContext( UiContext );
    const { data, error, isLoading } = useSWR<Props>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api${ url }?offset=${ offset }&limit=${ limit }${ filterDispensers?'&pistola=' + filterDispensers.toString():'' }${ desde?'&desde=' + desde:'' }${ hasta?'&hasta=' + hasta:'' }`, config);

    const fuels = data?.abastecimientos || [];

    let arrTiposCombustible:IKeyValue = {};
    let arrStylesCombustible:IKeyValue = {};

    if(process.env.NEXT_PUBLIC_COD_COMBUSTIBLE && process.env.NEXT_PUBLIC_DESC_COMBUSTIBLE && process.env.NEXT_PUBLIC_STYLE_COMBUSTIBLE){
        const LIST_COD = JSON.parse(process.env.NEXT_PUBLIC_COD_COMBUSTIBLE)
        const LIST_DES = JSON.parse(process.env.NEXT_PUBLIC_DESC_COMBUSTIBLE)
        const LIST_STYLE = JSON.parse(process.env.NEXT_PUBLIC_STYLE_COMBUSTIBLE)
        var i:number = 0;
        for (let i = 0; i < LIST_COD.length; i++) {
            arrTiposCombustible[LIST_COD[i]] = LIST_DES[i]; 
            arrStylesCombustible[LIST_COD[i]] = LIST_STYLE[i]; 
        }
    }

    fuels.map( fuel => (
        fuel.descripcionCombustible = arrTiposCombustible[fuel.codigoCombustible],
        fuel.styleCombustible= arrStylesCombustible[fuel.codigoCombustible]
    ) )

    return{
        fuels: fuels,
        isLoading,
        isError:error
    }

}