import { Product } from '@/models';
import { db } from '.';
import { IProduct } from '@/interfaces';
import { title } from 'process';

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
    try {
        await db.connect()

        const product = await Product.findOne({ slug }).lean()

        if (!product) return null

        await db.disconnect()
        return JSON.parse(JSON.stringify(product))




    } catch (error) {
        console.log(error)
        return null
    }
}

export interface ProductSlug {
    slug: string
}


export const getAllProductsBySlug = async (): Promise<ProductSlug[]> => {

    await db.connect()

    const products = await Product.find().select("slug -_id").lean()

    await db.disconnect()


    return products

}


export const getProductsBySearch = async (query: string): Promise<IProduct[]> => {

    try {

        const validQuery = new RegExp(query, "i")

        await db.connect()

        const products = await Product.find({$or:[{tags:validQuery},{title:validQuery}]}).select("title images price inStock slug -_id").lean()


        await db.disconnect()


        return products

    } catch (error) {
        console.log(error)
        return []
    }

}


export const getAllProducts = async (): Promise<IProduct[]> => {

    try {


        await db.connect()

        const products = await Product.find().select("title images price inStock slug -_id").limit(21).lean()


        await db.disconnect()


        return products

    } catch (error) {
        console.log(error)
        return []
    }

}
