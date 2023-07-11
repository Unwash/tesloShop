import { ICartProduct } from '@/interfaces';
import { ShippingAddress } from '@/interfaces';
import {createContext} from 'react';



interface ContextProps {
   cart:ICartProduct[];
   numberOfItems: number;
   subTotal: number;
   tax: number;
   total: number;
   shippingAddress:ShippingAddress
   //METHODS
   addProductToCart:(product:ICartProduct)=>void;
   updateCartQuantity:(Product:ICartProduct)=>void;
   removeCartProduct:(Product:ICartProduct)=>void;
   updateAddress:(Address:ShippingAddress)=>void;
   createOrder: () => Promise<{hasError:boolean; message: string }>

}
export const CartContext = createContext({} as ContextProps)