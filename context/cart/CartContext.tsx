import { ICartProduct } from '@/interfaces';
import {createContext} from 'react';


interface ContextProps {
   cart:ICartProduct[],
   numberOfItems: number,
   subTotal: number,
   impuestos: number,
   total: number
   addProductToCart:(product:ICartProduct)=>void,
   updateCartQuantity:(Product:ICartProduct)=>void,
   removeCartProduct:(Product:ICartProduct)=>void
}

export const CartContext = createContext({} as ContextProps)