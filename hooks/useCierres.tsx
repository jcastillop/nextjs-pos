import useSWR, { SWRConfiguration } from "swr"
import { ICierreTurnoGastos, ICierreTurnoHistorico, ICierreTurnoPrint, ICierreTurnoTotalesPrint } from '@/interfaces';

export const useObtieneCierre = ( idUsuario: string, config: SWRConfiguration = {} ) => {    
    
    const { data: cierres, error: cierreError, isLoading: isLoadingCierre } = useSWR<ICierreTurnoHistorico[]>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/cierreturnohistorico?idUsuario=${idUsuario}`, config);
    const { data: galonaje, error: galonajeError, isLoading: isLoadingGalonaje } = useSWR<ICierreTurnoPrint[]>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/cierreturnogalonaje?idUsuario=${idUsuario}`, config);
    const { data: totalsoles, error: totalsolesError, isLoading: isLoadingTotalsoles } = useSWR<ICierreTurnoTotalesPrint>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/cierreturnototalsoles?idUsuario=${idUsuario}`, config);
    const { data: gastos, error: gastosError, isLoading: isLoadingGastos } = useSWR<ICierreTurnoGastos>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/gastos/${ idUsuario }`, config);

    return {
        error: { cierreError, galonajeError, totalsolesError },
        isLoading : isLoadingCierre && isLoadingGalonaje && isLoadingTotalsoles && isLoadingGastos,
        cierres: cierres,
        galonaje: galonaje,
        totalsoles: totalsoles,
        gastos: gastos,
    }
}