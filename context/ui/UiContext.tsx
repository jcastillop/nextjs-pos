

import { IAlerta } from '@/interfaces';
import { createContext } from 'react';


interface ContextProps {
    isMenuOpen: boolean;
    filterDispensers?: string[];
    alerta: IAlerta;
    setFilterDispensers:(newFormats: React.SetStateAction<never[]>) => void;
    toggleSideMenu: () => void;
    showAlert: (alerta: IAlerta) => void;
    hideAlert: () => void;
}


export const UiContext = createContext({} as ContextProps );