import useSWR, { SWRConfiguration } from "swr"
import { ICierreTurnoHistorico, ICierreTurnoPrint, ICierreTurnoTotalesPrint } from '@/interfaces';

export const useObtieneCierre = ( idUsuario: string, config: SWRConfiguration = {} ) => {    
    
    const { data: cierres, error: cierreError, isLoading: isLoadingCierre } = useSWR<ICierreTurnoHistorico[]>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/cierreturnohistorico?idUsuario=${idUsuario}`, config);
    const { data: galonaje, error: galonajeError, isLoading: isLoadingGalonaje } = useSWR<ICierreTurnoPrint[]>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/cierreturnogalonaje?idUsuario=${idUsuario}`, config);
    const { data: totalproducto, error: totalproductoError, isLoading: isLoadingTotalproducto } = useSWR<ICierreTurnoPrint[]>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/cierreturnototalproducto?idUsuario=${idUsuario}`, config);
    const { data: totalsoles, error: totalsolesError, isLoading: isLoadingTotalsoles } = useSWR<ICierreTurnoTotalesPrint>(`${process.env.NEXT_PUBLIC_URL_RESTSERVER}/api/comprobantes/cierreturnototalsoles?idUsuario=${idUsuario}`, config);

    return {
        error: { cierreError, galonajeError, totalproductoError, totalsolesError },
        isLoading : isLoadingCierre && isLoadingGalonaje && isLoadingTotalproducto && isLoadingTotalsoles,
        cierres: cierres,
        galonaje: galonaje,
        totalproducto: totalproducto,
        totalsoles: totalsoles
    }
}