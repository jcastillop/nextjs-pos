import { posApi } from '@/api';
import { UiContext } from '@/context';
import { IComprobante, IFuel, IKeyValue } from '@/interfaces';
import { useContext } from 'react';
import useSWR, { SWRConfiguration } from "swr"

interface IData {
    message: string;
    hasError: boolean;
    terminal: string;
    isla: string;
}

export const useValidaIp = (  config: SWRConfiguration = {}  ) => {
  
  

      const { data, error, isLoading  } = useSWR<IData>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/usuarios/validaip`);

      return {
        message: data?.message,
        hasError: data?.hasError,
        terminal: data?.terminal,
        isla: data?.isla
      }


}
