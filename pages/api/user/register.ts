import { db } from '@/database'
import { IUser } from '@/interfaces'
import { User } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcryptjs from "bcryptjs"
import { signToken,isValidEmail } from '@/utils'


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
            return registerUser(req, res)

        default:
            return res.status(400).json({
                message: "Bad request"
            })
    }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    try {


        const { name,email, password } = req.body

        if(!name || !email || !password) return res.status(400).json({message:"Parametros incompletos"})

        if(!isValidEmail(email)) return res.status(400).json({message:"El correo no es válido"})

        if(password.length < 6) return res.status(400).json({message:"La contraseña debe tener al menos 6 caracteres"})
     

        const cryptPassword = bcryptjs.hashSync(password)


        await db.connect()

        const validateEmail = await User.findOne({email})

        if(validateEmail) {
            await db.disconnect()
            return res.status(400).json({message:"Correo ya registrado"})   
        }

        const usuario =  new User({name,email:email.toLowerCase(),password:cryptPassword,role:"client"})
        
        await usuario.save()

        await db.disconnect()

        const {email:emailUser,_id,role} = usuario

        const parseId = JSON.parse(JSON.stringify(_id))

        const token = signToken(parseId,email)
       
        res.json({token,user:{
            email:emailUser,
            role,
            name
        }
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Ocurrio un error" })
    }
}