import { IFuel, IReceptor } from '@/interfaces';
import { FuelState } from '.';
import { IComprobante } from '@/interfaces/comprobante';

type FuelActionType = 
   | { type: '[Cart] - LoadCart from cookies | storage' } 
   | { type: '[Cart] - Update fuel', payload: IFuel }
   | { 
      type: '[Cart] - Update order summary', 
      payload: {
         receptor: IReceptor;
         comprobante: IComprobante;
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