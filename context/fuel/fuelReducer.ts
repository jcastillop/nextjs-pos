import { IFuel, IReceptor } from '@/interfaces';
import { FuelState } from '.';
import { IComprobante, IComprobanteAdminItem } from '@/interfaces/comprobante';

type FuelActionType = 
   | { type: '[Cart] - LoadCart fuel' } 
   | { type: '[Cart] - Update fuel', payload: IFuel }
   | { type: '[Cart] - Update products in cart', payload: IComprobanteAdminItem[] }
   | { type: '[Cart] - LoadCart from cookies | storage', payload: IComprobanteAdminItem[] } 
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

const RECEPTOR_INITIAL:IReceptor = {
   id_receptor: 0,
   tipo_documento: 0,
   numero_documento: '',
   razon_social: '',
   direccion: '',
   correo: '',
   placa: ''
}

export const fuelReducer = ( state: FuelState, action: FuelActionType ): FuelState => {

   switch (action.type) {
      case '[Cart] - LoadCart from cookies | storage':
         return {
            ...state,
            isLoaded: true,
            cart: [...action.payload]
          }      
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
         case '[Cart] - Update products in cart':
            return {
               ...state,
               cart: [ ...action.payload ]
            }                      
      
       default:
          return state;
    }
}