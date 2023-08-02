import { IFuel, IReceptor } from '@/interfaces';
import { IComprobante } from '@/interfaces/comprobante';
import { CierreState } from './CierreProvider';

type CierreActionType = 
   | { type: '' } 
   | { type: '[Cierre] - Cierre complete' }

export const cierreReducer = ( state: CierreState, action: CierreActionType ): CierreState => {

   switch (action.type) {
    case '[Cierre] - Cierre complete':
        return {
           ...state,
           despachos: [],
           numberOfItems: 0,
           total: 0,
           idUsuario: 0,
        }          
      
       default:
          return state;
    }
}