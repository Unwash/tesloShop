import type { NextApiRequest, NextApiResponse } from 'next'
import { SHOP_CONSTANTS, db } from '@/database'
import { Product } from '@/models'
import { IProduct } from '@/interfaces'


type Data = 
|{ message: string }
|IProduct[]
|IProduct

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch(req.method){
        case "GET":
        return getProductBySlug(req,res)

        default:
            return res.status(400).json({
                message:"Bad request"
            })
    }

}

const getProductBySlug = async (req:NextApiRequest,res:NextApiResponse <Data>)=>{

    const  {slug } = req.query

    await db.connect()


    const product = await Product.findOne({slug}).lean()

    if(!product) return res.status(404).json({message:"Producto no encontrado"})

    await db.disconnect()

   
        product.images = product.images.map((image)=>{
            return image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`
        })


    
    return res.json(product) 
    

}