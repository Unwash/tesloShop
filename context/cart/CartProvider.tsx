import { FC, useEffect, useReducer } from "react";
import { cartReducer, CartContext } from "./";
import { ICartProduct, IOrder } from "@/interfaces";
import Cookie from "js-cookie";
import { ShippingAddress } from "@/interfaces";
import { tesloApi } from "@/api";
import axios from "axios";

export interface CartState {
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
}



const CART_INITIAL_STATE: CartState = {
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: {
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    zip: "",
    city: "",
    country: "",
    phone: "",
  },
};

interface Props {
  children: JSX.Element;
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cartFromCookie = Cookie.get("cart")
        ? JSON.parse(Cookie.get("cart")!)
        : [];

      if (cartFromCookie.length > 0) {
        dispatch({
          type: "[Cart] - LoadCart from cookies | storage",
          payload: cartFromCookie,
        });
      }
    } catch (error) {
      dispatch({
        type: "[Cart] - LoadCart from cookies | storage",
        payload: [],
      });
    }
  }, []);

  
  const getAddressFromCookies = (): ShippingAddress => {
    return {
      firstName: Cookie.get("firstName") || "",
      lastName: Cookie.get("lastName") || "",
      address: Cookie.get("address") || "",
      address2: Cookie.get("address2") || "",
      zip: Cookie.get("zip") || "",
      city: Cookie.get("city") || "",
      country: Cookie.get("country") || "",
      phone: Cookie.get("phone") || "",
    };
  };

  useEffect(()=>{
    const AddressObj = getAddressFromCookies()
    dispatch({type:"[Cart] - LoadAddress from cookies",payload:AddressObj})
  },[])




  useEffect(() => {
    Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems: state.cart.reduce(
        (prev, current) => current.quantity + prev,
        0
      ),
      subTotal: state.cart.reduce(
        (prev, current) => current.price * current.quantity + prev,
        0
      ),
      tax: 0,
      total: 0,
    };
    orderSummary.tax = orderSummary.subTotal * taxRate;
    orderSummary.total = orderSummary.subTotal + orderSummary.tax;

    dispatch({ type: "[Cart] - Update order summary", payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    let duplicate = false;

    const cart = state.cart.map((p) => {
      if (p._id === product._id && p.size === product.size) {
        duplicate = true;
        p.quantity += product.quantity;
      }
      return p;
    });

    const products = duplicate ? cart : [...state.cart, product];

    dispatch({ type: "[Cart] - Add product", payload: products });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    const cart = state.cart.map((p) => {
      if (product._id !== p._id && product.size !== p.size) return p;
      return product;
    });
    dispatch({ type: "[Cart] - Change cart quantity", payload: cart });
  };

  const removeCartProduct = (product: ICartProduct) => {
    console.log(product);
    dispatch({ type: "[Cart] - Remove product in Cart", payload: product });
  };

  const updateAddress = (address: ShippingAddress) =>{
    Cookie.set("firstName", address.firstName);
    Cookie.set("lastName", address.lastName);
    Cookie.set("address", address.address);
    Cookie.set("address2", address.address2 || "");
    Cookie.set("zip", address.zip);
    Cookie.set("city", address.city);
    Cookie.set("country", address.country);
    Cookie.set("phone", address.phone);
   
    dispatch({type:"[Cart] - Update Address", payload:address})
  }

  const createOrder = async ():Promise <{hasError:boolean; message: string }>  =>{
    try {

      if(!state.shippingAddress){
        throw new Error("No hay direccion de entrega")
      }

      const body:IOrder = {
        orderItems:state.cart.map((p)=>({
          ...p,
          image:p.image,
          size:p.size!
        })),
        shippingAddress:state.shippingAddress,
        numberOfItems:state.numberOfItems,
        subTotal:state.subTotal,
        tax:state.tax,
        total:state.total,
        isPaid:false
      }
      
      const {data} = await tesloApi.post("/orders",body)

      dispatch({type: "[Cart] - Order complete"})

      return {
        hasError:false,
        message:data._id!
      }


    } catch (error) {
      console.log(error)

      if(axios.isAxiosError(error)){
        return{
          hasError:true,
          message:error.response?.data.message
        }
      }

      return {
        hasError:true,
        message:"Ocurrio un error al crear la orden"
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        // METODS
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
