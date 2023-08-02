import { FC, ReactNode, useReducer } from 'react';
import { UiContext, uiReducer } from './';
import { AlertColor } from '@mui/material';
import { IAlerta } from '@/interfaces';
import { Constantes } from '@/helpers';

export interface UiState {
    isMenuOpen: boolean;
    alerta: IAlerta;
    /*
    isAlertOpen: boolean;
    messageAlert: string;
    severityAlert: AlertColor;
    */
}

interface Props{
    children: ReactNode;
}

const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false,
    alerta: {
        mensaje: '',
        severity: 'success',
        status: false,
        time: Constantes.ALERT_DEFAULT_TIMER
    }


    /*
    isAlertOpen: false,
    messageAlert: '',
    severityAlert: 'success'
    */
}

export const UiProvider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( uiReducer , UI_INITIAL_STATE );

    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - ToggleMenu' });
    }

    const showAlert = (alerta: IAlerta) => {
        dispatch({ type: '[UI] - ShowAlert', payload: alerta });
    }

    const hideAlert = () => {
        dispatch({ type: '[UI] - HideAlert' });
    }    

    const setFilterDispensers = (newFormats: React.SetStateAction<never[]>) => {
        const filterDispensers = newFormats 
        dispatch({ type: '[UI] - FilterSumary', payload: { filterDispensers } })
    }

    


    return (
        <UiContext.Provider value={{
            ...state,
            // Methods
            setFilterDispensers,
            toggleSideMenu,
            showAlert,
            hideAlert,
        }}>
            { children }
        </UiContext.Provider>
    )
};