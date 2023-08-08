import { IProduct } from "@/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/database";
import { Product } from "@/models";
import { isValidObjectId } from "mongoose";
import {v2 as cloudinary} from "cloudinary"

cloudinary.config(process.env.CLOUDINARU_URL || "")

type Data = { message: string } | IProduct[] | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    case "PUT":
      return updateProduct(req, res);
    case "POST":
        return createProduct(req,res)

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();

    const products = await Product.find().sort({ title: "asc" });

    await db.disconnect();

    const updatedProducts = products.map((product)=>{
      product.images = product.images.map((image)=>{
          return image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`
      })
      return product
  })

    res.status(200).json(updatedProducts);
  } catch (error) {
    await db.disconnect();
    return res.status(400).json({ message: "Ocurrio un error en el servidor" });
  }
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = "", images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: "El id del producto no es válido" });
  }

  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: "Se requieren al menos dos imagenes" });
  }

  try {
    await db.connect();

    const product = await Product.findById(_id);

    if (!product) {
      await db.disconnect();
      return res
        .status(400)
        .json({ message: "No existe un producto con ese id" });
    }

    product.images.forEach(async (image)=>{
      if(!images.includes(image)){
        const [fileId,extension] = image.substring(image.lastIndexOf("/")+1).split(".")
        await cloudinary.uploader.destroy(fileId)
      }
    } )

    await product.updateOne(req.body);

    await db.disconnect();

    return res.status(200).json(product);
  } catch (error) {
    await db.disconnect();
    return res.status(400).json({ message: "Ocurrio un error en el servidor" });
  }
};


const  createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const {images = [], slug } = req.body as IProduct

    await db.connect();

    const productDb = await Product.findOne({slug})

    if(productDb){
        await db.disconnect()
        return res
        .status(400)
        .json({ message: "El slug ya existe" });
    }

    if (images.length < 2) {
        await db.disconnect()
        return res
          .status(400)
          .json({ message: "Se requieren al menos dos imagenes" });
      }

      try {

        const producto = new Product(req.body);

        await producto.save()

        await db.disconnect()

        return res.json(producto)

      } catch (error) {
        await db.disconnect()
        return res.status(400).json({ message: "Ocurrio un error en el servidor" });
      }
}

