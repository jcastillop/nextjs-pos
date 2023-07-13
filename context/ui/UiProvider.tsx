import { FC, ReactNode, useReducer } from 'react';
import { UiContext, uiReducer } from './';

export interface UiState {
    isMenuOpen: boolean;
}

interface Props{
    children: ReactNode;
}

const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false
}

export const UiProvider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( uiReducer , UI_INITIAL_STATE );

    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - ToggleMenu' });
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
        }}>
            { children }
        </UiContext.Provider>
    )
};