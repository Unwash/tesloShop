import { db } from '@/database'
import { IUser } from '@/interfaces'
import { User } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import { signToken, isValidToken } from '@/utils'

interface resp {
    token: string,
    user: IUser
}


type Data = | { message: string }
    | IUser
    | resp

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case "GET":
            return checkJWT(req, res)

        default:
            return res.status(400).json({
                message: "Bad request"
            })
    }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    try {

        const { token = "" } = req.cookies

        let userId = ""
        try {

            userId = await isValidToken(token)
        } catch (error) {
            return res.status(401).json({
                message:"Token de autorizacion no válido"
            })
        }

        await db.connect()

        const usuario = await User.findById(userId).lean()
        await db.disconnect()

        if (!usuario) {
            res.status(404).json({ message: "Usuario no existe" })
        }

        const {email,role,name} = usuario as IUser

        const parseId = JSON.parse(JSON.stringify(usuario?._id!))

        const newToken = signToken(parseId,email)

        const resp = {
            token:newToken,
            user: {
                email, role, name
            }
        }

        res.json(resp)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Ocurrio un error" })
    }
}