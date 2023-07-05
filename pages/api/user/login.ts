import { db } from '@/database'
import { IUser } from '@/interfaces'
import { User } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcryptjs from "bcryptjs"
import { signToken } from '@/utils'

interface resp {
    token: string,
    user: IUser
}


type Data = | { message: string }
    | IUser
    | resp

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case "POST":
            return loginUser(req, res)

        default:
            return res.status(400).json({
                message: "Bad request"
            })
    }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    try {


        const { email, password } = req.body


        await db.connect()

        const usuario = await User.findOne({ email })
        await db.disconnect()
        if (!usuario) {
            res.status(404).json({ message: "Usuario o contraseña incorrectos" })
        }

        const valid = bcryptjs.compareSync(password, usuario?.password!)

        if (!valid) {
            res.status(404).json({ message: "Usuario o contraseña incorrectos" })
        }

        const { role, name } = usuario as IUser

        const parseId = JSON.parse(JSON.stringify(usuario?._id!))

        const token = signToken(parseId,email)

        const resp = {
            token,
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