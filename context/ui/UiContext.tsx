

import { createContext } from 'react';


interface ContextProps {
    isMenuOpen: boolean;
    isAlertOpen: boolean;
    filterDispensers?: string[];
    // Methods
    setFilterDispensers:(newFormats: React.SetStateAction<never[]>) => void;
    toggleSideMenu: () => void;
    toggleAlert: () => void;
}


export const UiContext = createContext({} as ContextProps );