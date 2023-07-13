import { IFuel } from '@/interfaces';
import { FuelState } from '.';

type FuelActionType = 
   | { type: '[Cart] - LoadCart from cookies | storage' } 
   | { type: '[Cart] - Update fuel', payload: IFuel }
   | { 
      type: '[Cart] - Update order summary', 
      payload: {
         numeroComprobante: string;
         codigoHash: string;
         codigoQr: string;
      }
   }
   | { type: '[Cart] - Order complete' }

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
         case '[Cart] - Order complete':
            return {
               ...state
            }
      
       default:
          return state;
    }
}