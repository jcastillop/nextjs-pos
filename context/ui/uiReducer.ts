import { UiState } from './';


type UiActionType = 
   | { type: '[UI] - ToggleMenu' } 
   | {
      type: '[UI] - FilterSumary',
      payload: {
         filterDispensers: React.SetStateAction<never[]>;
      }
   }
   | { type: '[UI] - ToggleAlert' } 

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
      case '[UI] - ToggleAlert':
         return {
            ...state,
            isAlertOpen: !state.isAlertOpen
        }        
       default:
          return state;
   }

}