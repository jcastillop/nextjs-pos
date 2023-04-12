import { FuelState } from '.';

type CartActionType = 
   | { type: '[Cart] - LoadCart from cookies | storage' } 
   | { 
      type: '[Cart] - Update order summary', 
      payload: {
         numberOfItems: number;
         subTotal: number;
         tax: number;
         total: number;
      }
   }
   | { type: '[Cart] - Order complete' }

export const fuelReducer = ( state: FuelState, action: CartActionType ): FuelState => {

   switch (action.type) {
      case '[Cart] - Update order summary':
         return {
            ...state,
            ...action.payload
         }
       default:
          return state;
    }
}