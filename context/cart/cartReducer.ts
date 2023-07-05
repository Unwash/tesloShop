import { ICartProduct } from '@/interfaces';
import { CartState } from './';
import { ShippingAddress } from './CartProvider';



type CartActionType =
   | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
   | { type: '[Cart] - Add product', payload: ICartProduct[] }
   | { type: '[Cart] - Change cart quantity', payload: ICartProduct[] }
   | { type: '[Cart] - Remove product in Cart', payload: ICartProduct }
   | {
      type: '[Cart] - Update order summary', payload: {
         numberOfItems: number,
         subTotal: number,
         impuestos: number,
         total: number
      }
   }
   |{ type: '[Cart] - LoadAddress from cookies', payload: ShippingAddress }
   |{ type: '[Cart] - Update Address', payload: ShippingAddress }


export const cartReducer = (state: CartState, action: CartActionType): CartState => {
   switch (action.type) {
      case '[Cart] - LoadCart from cookies | storage':
         return {
            ...state,  cart: [...action.payload]
         }
      case '[Cart] - Change cart quantity':
         return {
            ...state, cart: [...action.payload]
         }

      case "[Cart] - Add product":

         return {
            ...state, cart: [...action.payload]
         }

      case '[Cart] - Remove product in Cart':
         return {
            ...state,
            cart: state.cart.filter((p) => !(p.size === action.payload.size && p._id === action.payload._id))
         }

         case '[Cart] - Update order summary':
            return{
               ...state,
               ...action.payload
            }

            case '[Cart] - LoadAddress from cookies':
            case '[Cart] - Update Address':
               return{
                  ...state,
                  shippingAddress:action.payload
               }

            


      default:
         return state
   }
}