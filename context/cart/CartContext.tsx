import { ICartProduct } from '@/interfaces';
import {createContext} from 'react';
import { ShippingAddress } from './CartProvider';


interface ContextProps {
   cart:ICartProduct[];
   numberOfItems: number;
   subTotal: number;
   impuestos: number;
   total: number;
   shippingAddress:ShippingAddress
   //METHODS
   addProductToCart:(product:ICartProduct)=>void;
   updateCartQuantity:(Product:ICartProduct)=>void;
   removeCartProduct:(Product:ICartProduct)=>void;
   updateAddress:(Address:ShippingAddress)=>void

}
export const CartContext = createContext({} as ContextProps)