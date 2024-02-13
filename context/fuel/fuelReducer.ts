import { IFuel, IReceptor } from '@/interfaces';
import { FuelState } from '.';
import { IComprobante, IComprobanteAdminItem } from '@/interfaces/comprobante';
import { initialComprobante } from '@/database/comprobante';
import { initialReceptor } from '@/database/receptor';

type FuelActionType = 
   | { type: '[Cart] - LoadCart fuel' } 
   | { type: '[Cart] - Update fuel', payload: IFuel }
   | { type: '[Cart] - Update products in cart', payload: IComprobanteAdminItem[] }
   | { type: '[Cart] - LoadCart from cookies | storage', payload: IComprobanteAdminItem[] } 
   | { 
      type: '[Fuel] - Update comprobante y receptor', 
      payload: {
         receptor: IReceptor;
         comprobante: IComprobante;
      }
   }
   | { type: '[Cart] - Fuel complete' }
   | { type: '[Cart] - Fuel processing' }
   | { type: '[Cart] - Change cart quantity', payload: IComprobanteAdminItem }
   | { type: '[Cart] - Cart complete' }
   | { 
      type: '[Cart] - Update order cart', 
      payload: {
         numberOfItems: number;
         subTotal: number;
         tax: number;
         total: number;
      }
   }   

   export const fuelReducer = ( state: FuelState, action: FuelActionType ): FuelState => {

   switch (action.type) {
      case '[Cart] - LoadCart from cookies | storage':
         return {
            ...state,
            cart: [...action.payload]
          }      
      case '[Cart] - Update order cart':
         return {
            ...state,
            ...action.payload
         }
      case '[Fuel] - Update comprobante y receptor':
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
               isLoaded: false,
               receptor: initialReceptor,    
               comprobante: initialComprobante    
            }       
         case '[Cart] - Fuel processing':
            return {
               ...state,
               isLoaded: true
            }  
         case '[Cart] - Update products in cart':
            return {
               ...state,
               cart: [ ...action.payload ]
            }                      
         case '[Cart] - Change cart quantity':
            return {
               ...state,
               cart: state.cart.map( product => {
                  if ( product.codigo_producto !== action.payload.codigo_producto ) return product;
                  return action.payload;
               })
            }
         case '[Cart] - Cart complete':
            return {
               ...state,
               cart: []   
            }                  
       default:
          return state;
    }
}