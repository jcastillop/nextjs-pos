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

    const { filterDispensers } = useContext( UiContext );
    const { data, error, isLoading } = useSWR<Props>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api${ url }?offset=${ offset }&limit=${ limit }${ filterDispensers?'&pistola=' + filterDispensers.toString():'' }${ desde?'&desde=' + desde:'' }${ hasta?'&hasta=' + hasta:'' }`, config);

    const fuels = data?.abastecimientos || [];

    return{
        fuels: fuels,
        isLoading,
        isError:error
    }

}