import { createContext } from 'react';

interface ContextProps {
    isLoaded: boolean;
    // Orders
    createOrder: () => Promise<{ hasError: boolean; message: string; }>;
}


export const FuelContext = createContext({} as ContextProps );