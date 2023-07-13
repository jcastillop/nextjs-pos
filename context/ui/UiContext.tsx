

import { createContext } from 'react';


interface ContextProps {
    isMenuOpen: boolean;
    filterDispensers?: string[];
    // Methods
    setFilterDispensers:(newFormats: React.SetStateAction<never[]>) => void;
    toggleSideMenu: () => void;
}


export const UiContext = createContext({} as ContextProps );