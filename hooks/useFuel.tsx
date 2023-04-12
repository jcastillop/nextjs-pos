import { IFuel } from "@/interfaces";
import useSWR, { SWRConfiguration } from "swr"

// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json())

export const useFuel = ( url: string, config: SWRConfiguration = {} ) => {

    // const { data, error, isLoading } = useSWR<Props>(`http://localhost:8000/api${ url }`, fetcher, config);
    const { data, error, isLoading } = useSWR<IFuel>(`http://192.168.1.16:8000/api/abastecimientos${ url }`, config);

    return{
        fuel: data,
        isLoading,
        isError:error
    }

}