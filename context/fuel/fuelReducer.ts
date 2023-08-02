import { IFuel, IReceptor } from '@/interfaces';
import { FuelState, RECEPTOR_INITIAL } from '.';
import { IComprobante } from '@/interfaces/comprobante';

type FuelActionType = 
   | { type: '[Cart] - LoadCart fuel' } 
   | { type: '[Cart] - Update fuel', payload: IFuel }
   | { 
      type: '[Cart] - Update order summary', 
      payload: {
         receptor: IReceptor;
         comprobante: IComprobante;
      }
   }
   | { type: '[Cart] - Fuel complete' }
   | { type: '[Cart] - Fuel processing' }
   | { type: '[Cart] - Fuel clean' }

export const fuelReducer = ( state: FuelState, action: FuelActionType ): FuelState => {

   switch (action.type) {
      case '[Cart] - Update order summary':
         return {
            ...state,
            ...action.payload
         }
         case '[Cart] - Update fuel':
            return {
               ...state,
               ...action.payload
            }         
         case '[Cart] - Fuel complete':
            return {
               ...state,
               isLoaded: false        
            }
         case '[Cart] - Fuel clean':
            return {
               ...state,
               receptor: RECEPTOR_INITIAL        
            }            
         case '[Cart] - Fuel processing':
            return {
               ...state,
               isLoaded: true
            }            
      
       default:
          return state;
    }
}