import { IFuel, IKeyValue } from "@/interfaces";
import useSWR, { SWRConfiguration } from "swr"

// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json())

export const useFuel = ( url: string, config: SWRConfiguration = {} ) => {

    const { data, error, isLoading } = useSWR<IFuel>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/abastecimientos${ url }`, config);

    return{
        fuel: data,
        isLoading,
        isError:error
    }

}