import { createContext, useState } from 'react';
 
// --------------------------------------------------------------------
// Interface
// --------------------------------------------------------------------
interface CtxProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  toggleMenu: () => void;
}
 
// --------------------------------------------------------------------
// Context
// --------------------------------------------------------------------
export const UIContext = createContext<CtxProps>({} as CtxProps);
 
// --------------------------------------------------------------------
// Provider
// --------------------------------------------------------------------
type Props = { children?: React.ReactNode };
export const UIProvider = ({ children }: Props) => {
  const setIsMenuOpen = (isMenuOpen: boolean) => {
    setState((prev) => ({ ...prev, isMenuOpen }));
  };
 
  const toggleMenu = () => {
    setState((prev) => ({ ...prev, isMenuOpen: !prev.isMenuOpen }));
  };
 
  const initState: CtxProps = {
    isMenuOpen: false,
    setIsMenuOpen,
    toggleMenu,
  };
 
  const [state, setState] = useState(initState);
 
  return <UIContext.Provider value={state}>{children}</UIContext.Provider>;
};