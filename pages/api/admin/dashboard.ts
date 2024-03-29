import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/database";
import { Order, Product, User } from "@/models";

type Data = {
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number;
  
}
|  {message: string}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    switch(req.method){
      case"GET":
      return getDashboard(req,res)

      default:
          res.status(400).json({ message: 'Bad request' })
  }
  

}

const getDashboard = async (req:NextApiRequest,res:NextApiResponse<Data>)=>{
  try {
  await db.connect();

  const [numberOfOrders,paidOrders,numberOfClients,numberOfProducts,productsWithNoInventory,lowInventory] = await Promise.all([
    Order.count(),
    Order.find({ isPaid: true }).count(),
    User.find({ role: "client" }).count(),
    Product.count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 10 } }).count()
])

const notPaidOrders = numberOfOrders - paidOrders

  await db.disconnect();

  res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  });
} catch (error) {
    console.log(error)
    return res.status(500).json({message:"Ocurrio un error"})
}
}
