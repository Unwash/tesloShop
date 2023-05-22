import { FC, useEffect, useReducer } from 'react'
import { cartReducer, CartContext } from './'
import { ICartProduct } from '@/interfaces'
import Cookie from "js-cookie"

export interface CartState {
    cart: ICartProduct[],
    numberOfItems: number,
    subTotal: number,
    impuestos: number,
    total: number
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems:0,
    subTotal: 0,
    impuestos: 0,
    total:0
}

interface Props {
    children: JSX.Element
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

    useEffect(() => {
        try {
            const cartFromCookie = Cookie.get("cart") ? JSON.parse(Cookie.get("cart")!) : []

            if (cartFromCookie.length > 0) {
                dispatch({ type: "[Cart] - LoadCart from cookies | storage", payload: cartFromCookie })
            }
        } catch (error) {
            dispatch({ type: "[Cart] - LoadCart from cookies | storage", payload: [] })
        }
    }, [])

    useEffect(() => {
        Cookie.set("cart", JSON.stringify(state.cart))
    }, [state.cart])

    
    useEffect(() => {

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) 

        const orderSummary = {
            numberOfItems: state.cart.reduce((prev,current)=> current.quantity + prev,0),
            subTotal: state.cart.reduce((prev,current)=> (current.price * current.quantity) + prev,0),
            impuestos:0,
            total:0
        }
        orderSummary.impuestos = (orderSummary.subTotal * taxRate)
        orderSummary.total = orderSummary.subTotal + orderSummary.impuestos
        
       dispatch({type:"[Cart] - Update order summary",payload:orderSummary})

    }, [state.cart])

    const addProductToCart = (product: ICartProduct) => {

        let duplicate = false

        const cart = state.cart.map((p) => {
            if (p._id === product._id && p.size === product.size) {
                duplicate = true
                p.quantity += product.quantity
            }
            return p
        })

        const products = duplicate ? cart : [...state.cart, product]

        dispatch({ type: "[Cart] - Add product", payload: products })
    }

    const updateCartQuantity =(product:ICartProduct)=>{
        const cart = state.cart.map((p)=>{
            if(product._id !== p._id && product.size !== p.size) return p
            return product
        })
        dispatch({type:"[Cart] - Change cart quantity",payload:cart})
    }

    const removeCartProduct = (product:ICartProduct) =>{
        console.log(product)
        dispatch({type:"[Cart] - Remove product in Cart",payload:product})
    }


    return (
        <CartContext.Provider value={
            {
                ...state,

                // METODS
                addProductToCart,
                updateCartQuantity,
                removeCartProduct
            }
        }>
            {children}
        </CartContext.Provider>
    )
}