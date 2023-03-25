import { IFuel } from "@/interfaces";
import useSWR, { SWRConfiguration } from "swr"

interface Props {
    total: number;
    abastecimientos: IFuel[];
}

// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json())

export const useFuels = ( url: string, config: SWRConfiguration = {} ) => {

    // const { data, error, isLoading } = useSWR<Props>(`http://localhost:8000/api${ url }`, fetcher, config);
    const { data, error, isLoading } = useSWR<Props>(`http://localhost:8000/api${ url }`, config);

    return{
        fuels: data?.abastecimientos || [],
        isLoading,
        isError:error
    }

}