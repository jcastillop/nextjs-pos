import { UiContext } from '@/context';
import { IFuel, IKeyValue } from '@/interfaces';
import { useContext } from 'react';
import useSWR, { SWRConfiguration } from "swr"

interface Props {
  comprobantes: any;
}

// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json())
// eslint-disable-next-line react-hooks/rules-of-hooks

//const { data } = await posApi.get(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes`);
export const useComprobantes = ( config: SWRConfiguration = {}) => {

    const { data } = useSWR<Props>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes`, config);

    return{
      comprobantes: data
    }

}