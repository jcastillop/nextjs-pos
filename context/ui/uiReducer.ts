import { UiState } from './';


type UiActionType = 
   | { type: '[UI] - ToggleMenu' } 
   | {
      type: '[UI] - FilterSumary',
      payload: {
         filterDispensers: React.SetStateAction<never[]>;
      }
   }


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
       default:
          return state;
   }

}