import { posApi } from '@/api';
import { UiContext } from '@/context';
import { IComprobante, IFuel, IKeyValue } from '@/interfaces';
import { useContext } from 'react';
import useSWR, { SWRConfiguration } from "swr"

interface Props {
  comprobantes: any;
}

export const listarHistorico = async(idUsuario: number):Promise<{ hasError: boolean; comprobantes?: IComprobante[]; }> => {
  try {
      const body = {
          "idUsuario": idUsuario
      }
      const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/historico`, body);
      return {
          hasError: false,
          comprobantes: data.comprobantes
      }

  } catch (error) {
      return {
          hasError: true
      }
  }

}
