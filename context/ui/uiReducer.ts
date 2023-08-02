import { IAlerta } from '@/interfaces';
import { UiState } from './';
import { Constantes } from '@/helpers';


type UiActionType = 
   | { type: '[UI] - ToggleMenu' } 
   | {
      type: '[UI] - FilterSumary',
      payload: {
         filterDispensers: React.SetStateAction<never[]>;
      }
   }
   | { type: '[UI] - ShowAlert', payload: IAlerta } 
   | { type: '[UI] - HideAlert'} 

export const uiReducer = ( state: UiState, action: UiActionType ): UiState => {

   switch (action.type) {
      case '[UI] - ToggleMenu':
         return {
            ...state,
            isMenuOpen: !state.isMenuOpen
        }
      case '[UI] - FilterSumary':
         return {
            ...state,
            ...action.payload
        }
      case '[UI] - ShowAlert':
         return {
            ...state,
            alerta: {
               mensaje: action.payload.mensaje,
               severity: action.payload.severity,
               status: true,
               time: action.payload.time?action.payload.time:Constantes.ALERT_DEFAULT_TIMER
           }
        }      
        case '[UI] - HideAlert':  
        return {
         ...state,
         alerta: {
            mensaje: state.alerta.mensaje,
            severity: state.alerta.severity,
            status: false,
        }
     }         
       default:
          return state;
   }

}