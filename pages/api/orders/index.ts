import { db, dbProducts } from '@/database';
import { IOrder } from '@/interfaces'
import { Order, Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"

type Data = { message: string} | IOrder

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch(req.method){
        case"POST":
        return createOrder(req,res)

        default:
            res.status(400).json({ message: 'Bad request' })
    }

}

const createOrder = async (req: NextApiRequest,res:NextApiResponse)=>{
try {
    
    const {orderItems, total} = req.body as IOrder

    const session = await getToken({req,secret:process.env.NEXTAUTH_URL}) as any

    if(!session){
        return res.status(401).json({message: "Sesión requerida"})
    }

    const productsId = orderItems.map((product=>product._id))

    await db.connect()

    const dbProducts = await Product.find({_id:{$in:productsId}})

    try {
        const subTotal = orderItems.reduce((prev,current)=> {

            const currentPrice = dbProducts.find((p)=>p.id === current._id)?.price

            if(!currentPrice){
                throw new Error("No se encontro producto, verifique su carrito")
            }

            return (currentPrice*current.quantity) + prev

        },0  )
   

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const tax = subTotal * taxRate;
    const backendTotal = subTotal + tax;

    if(backendTotal !== total){
        throw new Error("El total no cuadra con el monto")
    }

    const userId = session.user._id

    const newOrder = new Order({...req.body, isPaid:false,user:userId})

    newOrder.total = Math.round(newOrder.total * 100) / 100

    await newOrder.save()

    await db.disconnect()

    return res.status(201).json(newOrder)



} catch (error:any) {
    await db.disconnect()
    return res.status(400).json({ message: error.message || 'Ocurrio un error'  }) 
}

} catch (error) {
    await db.disconnect()
    return res.status(500).json({ message: 'Ocurrio un error' }) 
}
}