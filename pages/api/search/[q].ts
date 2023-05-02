import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';

type Data =
    | { message: string }
    | IProduct[]
export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
    
        case "GET":
            return searchProducts(req, res)
        default:
            res.status(400).json({ message: 'Metodo invalido' })
    }
}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    try {

        const { q = "" } = req.query

        if (q.length === 0) return res.status(400).json({message:"Debe especificar la busqueda "})

        const validQuery = new RegExp(`${q}`, "i")

        await db.connect()


        const products = await Product.find({ $or: [{ tags: validQuery }, { title: validQuery }] }).select("title images price inStock slug -_id").lean()

        await db.disconnect()

        return res.json(products)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error de servidor" })
    }


}